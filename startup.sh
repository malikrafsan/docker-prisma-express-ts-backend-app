npm i -g prisma
npx prisma db push
npx prisma generate
npx prisma migrate dev --name init --preview-feature
npx prisma db seed
npm run dev
