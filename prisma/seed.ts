import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const usersData = [
  {
    name: 'Malik Akbar',
    username: `malikrafsan-${Math.floor(Math.random() * 100)}`,
    password: 'ini-password',
    foto_KTP: 'https://i.pravatar.cc/300',
    is_admin: true,
  }
]

const main = async () => {
  console.log('start seeding …')
  for (const _user of usersData) {
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
