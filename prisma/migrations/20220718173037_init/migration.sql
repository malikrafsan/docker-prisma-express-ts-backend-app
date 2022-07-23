/*
  Warnings:

  - You are about to drop the column `verification_status` on the `reqtransfer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `reqtransfer` DROP COLUMN `verification_status`;
