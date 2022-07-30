/*
  Warnings:

  - You are about to drop the column `amount_source` on the `ReqSaldoChange` table. All the data in the column will be lost.
  - You are about to drop the column `amount_target` on the `ReqSaldoChange` table. All the data in the column will be lost.
  - Added the required column `amount` to the `ReqSaldoChange` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ReqSaldoChange" DROP COLUMN "amount_source",
DROP COLUMN "amount_target",
ADD COLUMN     "amount" INTEGER NOT NULL;
