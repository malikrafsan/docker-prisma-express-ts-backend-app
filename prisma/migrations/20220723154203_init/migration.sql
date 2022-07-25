-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('DRAFT', 'VERIFIED', 'REJECTED');

-- CreateTable
CREATE TABLE "User" (
    "id_user" SERIAL NOT NULL,
    "is_admin" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "fotoKTP" TEXT NOT NULL,
    "linkKTP" TEXT NOT NULL,
    "verification_status" "VerificationStatus" NOT NULL DEFAULT 'DRAFT',
    "saldo" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id_user")
);

-- CreateTable
CREATE TABLE "ReqSaldoChange" (
    "id_req_saldo_change" SERIAL NOT NULL,
    "id_user" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "amount_source" INTEGER NOT NULL,
    "amount_target" INTEGER NOT NULL,
    "verification_status" "VerificationStatus" NOT NULL DEFAULT 'DRAFT',

    CONSTRAINT "ReqSaldoChange_pkey" PRIMARY KEY ("id_req_saldo_change")
);

-- CreateTable
CREATE TABLE "Transfer" (
    "id_req_transfer" SERIAL NOT NULL,
    "id_user_src" INTEGER NOT NULL,
    "id_user_dest" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,

    CONSTRAINT "Transfer_pkey" PRIMARY KEY ("id_req_transfer")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "ReqSaldoChange" ADD CONSTRAINT "ReqSaldoChange_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transfer" ADD CONSTRAINT "Transfer_id_user_src_fkey" FOREIGN KEY ("id_user_src") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transfer" ADD CONSTRAINT "Transfer_id_user_dest_fkey" FOREIGN KEY ("id_user_dest") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;
