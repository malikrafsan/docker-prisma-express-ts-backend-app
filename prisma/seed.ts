import { PrismaClient, VerificationStatus } from '@prisma/client';
import { faker } from '@faker-js/faker';
const prisma = new PrismaClient();
import { hasher } from '../src/utils';
import { exchangeRatesSymbols } from '../src/data';

const SIZE_GENERATED_USERS = 6;
const MAX_SIZE_GENERATED_TRANSFER_PER_USER = 20;
const MAX_SIZE_GENERATED_SALDO_CHANGES_PER_USER = 20;

const adminData = [
  {
    name: 'Malik Akbar',
    username: 'malikrafsan',
    password: 'ini-password',
    fotoKTP: '',
    linkKTP:
      'https://firebasestorage.googleapis.com/v0/b/labpro-selection.appspot.com/o/files%2FGuesthouse-vila-dago-cisitu-djuanda-tubagus-ismail-cimbuluit-sangkuriang-resort-asri-cigadung-cikutr-Bandung-Indonesia.jpg?alt=media&token=96d0a604-3a34-40fa-8a51-91c6c9f24eae',
    is_admin: true,
    verification_status: VerificationStatus.VERIFIED,
  },
];

const randomVerificationStatus = (bound1: number, bound2: number) => {
  const random = Math.random();
  if (random < bound1) {
    return VerificationStatus.VERIFIED;
  } else if (random < bound2) {
    return VerificationStatus.DRAFT;
  } else {
    return VerificationStatus.REJECTED;
  }
};

const userData = Array(SIZE_GENERATED_USERS)
  .fill({})
  .map((_) => {
    const name = faker.name.findName();
    const verification_status = randomVerificationStatus(0.5, 0.8);
    const saldo =
      verification_status === VerificationStatus.VERIFIED
        ? Math.floor(Math.random() * 100000)
        : 0;

    return {
      name,
      username: faker.internet.userName(name),
      password: 'password',
      fotoKTP: '-',
      linkKTP:
        'https://firebasestorage.googleapis.com/v0/b/labpro-selection.appspot.com/o/files%2FGuesthouse-vila-dago-cisitu-djuanda-tubagus-ismail-cimbuluit-sangkuriang-resort-asri-cigadung-cikutr-Bandung-Indonesia.jpg?alt=media&token=96d0a604-3a34-40fa-8a51-91c6c9f24eae',
      is_admin: false,
      verification_status,
      saldo,
    };
  });

const randomize = (arr: number[], except: number): number => {
  const randomIdx = Math.floor(Math.random() * arr.length);
  if (arr[randomIdx] === except) {
    return randomize(arr, except);
  }
  return arr[randomIdx];
};

const main = async () => {
  console.log('start seeding');
  const data = [...adminData, ...userData];
  const currencies = Object.keys(exchangeRatesSymbols);

  const createdUser = await Promise.all(
    data.map(async (_user) => {
      _user.password = await hasher(_user.password);
      const user = await prisma.user.create({
        data: _user,
      });
      console.log(`Created user with id: ${user.id_user}`);

      return user;
    }),
  );

  await Promise.all(
    createdUser.map(async (user) => {
      if (user.verification_status !== VerificationStatus.VERIFIED) {
        return;
      }

      if (user.is_admin) {
        return;
      }

      const res = await Promise.all(
        Array(
          Math.floor(
            Math.random() * MAX_SIZE_GENERATED_SALDO_CHANGES_PER_USER,
          ),
        )
          .fill(null)
          .map(async (_) => {
            const amount = Math.floor(
              (Math.random() - 0.5) *
                (user.saldo /
                  MAX_SIZE_GENERATED_SALDO_CHANGES_PER_USER),
            );
            const currency =
              currencies[
                Math.floor(Math.random() * currencies.length)
              ];

            // to reduce api hit
            const convertedAmount: number = amount;

            const reqSaldoChange = await prisma.reqSaldoChange.create(
              {
                data: {
                  id_user: user.id_user,
                  currency,
                  amount: convertedAmount,
                  verification_status: randomVerificationStatus(
                    0.4,
                    0.6,
                  ),
                },
              },
            );
            console.log(
              `Created reqSaldoChange with id: ${reqSaldoChange.id_req_saldo_change}`,
            );

            if (
              reqSaldoChange.verification_status ===
              VerificationStatus.VERIFIED
            ) {
              const updatedUser = await prisma.user.update({
                where: {
                  id_user: user.id_user,
                },
                data: {
                  saldo: user.saldo + convertedAmount,
                },
              });
              console.log(
                `Updated user with id: ${updatedUser.id_user}`,
              );
            }

            return reqSaldoChange;
          }),
      );

      return res;
    }),
  );

  // seed transfer data
  const updatedUsers = await prisma.user.findMany();
  const idUsersVerified = updatedUsers
    .filter((user) => {
      return (
        !user.is_admin &&
        user.verification_status === VerificationStatus.VERIFIED
      );
    })
    .map((user) => user.id_user);

  await Promise.all(
    updatedUsers.map(async (user) => {
      if (user.verification_status !== VerificationStatus.VERIFIED) {
        return;
      }

      if (user.is_admin) {
        return;
      }

      const res = [];
      for (const _ of Array(
        Math.floor(
          Math.random() * MAX_SIZE_GENERATED_TRANSFER_PER_USER,
        ),
      )) {
        const amount = Math.floor(
          (Math.random() * user.saldo) /
            MAX_SIZE_GENERATED_TRANSFER_PER_USER,
        );
        const currency =
          currencies[Math.floor(Math.random() * currencies.length)];

        // to reduce api hit
        const convertedAmount: number = amount;

        const id_user_dest = randomize(idUsersVerified, user.id_user);
        const userDest = await prisma.user.findFirst({
          where: {
            id_user: id_user_dest,
          },
        });

        if (!userDest) {
          return null;
        }

        const transfer = await prisma.transfer.create({
          data: {
            id_user_src: user.id_user,
            id_user_dest,
            currency,
            amount: convertedAmount,
          },
        });

        console.log(
          `id user src ${user.id_user}, id user dest ${userDest.id_user}`,
        );

        const updatedUserSrc = await prisma.user.update({
          where: {
            id_user: transfer.id_user_src,
          },
          data: {
            saldo: user.saldo - convertedAmount,
          },
        });

        const updatedUserDest = await prisma.user.update({
          where: {
            id_user: transfer.id_user_dest,
          },
          data: {
            saldo: userDest.saldo + convertedAmount,
          },
        });

        console.log(
          `Created transfer with id: ${transfer.id_transfer} and update saldo user ${updatedUserSrc.id_user} and ${updatedUserDest.id_user}`,
        );

        res.push(transfer);
      }

      return res;
    }),
  );

  console.log('seeding done');
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
