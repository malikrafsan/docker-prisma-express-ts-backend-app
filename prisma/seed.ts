import { PrismaClient, VerificationStatus } from '@prisma/client'
const prisma = new PrismaClient()
import { hasher } from '../src/utils';

const usersData = [
  {
    name: 'Malik Akbar',
    username: `malikrafsan-${Math.floor(Math.random() * 100)}`,
    password: 'ini-password',
    fotoKTP: 'https://i.pravatar.cc/300',
    linkKTP: '-',
    is_admin: true,
    verification_status: VerificationStatus.VERIFIED,
  }
]

const main = async () => {
  console.log('start seeding …')
  for (const _user of usersData) {
    _user.password = await hasher(_user.password);
    const user = await prisma.user.create({
      data: _user,
    });
    console.log(`Created user with id: ${user.id_user}`);
  }
  console.log('seeding done');
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
