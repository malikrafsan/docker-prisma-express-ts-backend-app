/*
  Warnings:

  - The primary key for the `Transfer` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id_req_transfer` on the `Transfer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Transfer" DROP CONSTRAINT "Transfer_pkey",
DROP COLUMN "id_req_transfer",
ADD COLUMN     "id_transfer" SERIAL NOT NULL,
ADD CONSTRAINT "Transfer_pkey" PRIMARY KEY ("id_transfer");
