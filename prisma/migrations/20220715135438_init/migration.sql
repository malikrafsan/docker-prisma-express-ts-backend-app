/*
  Warnings:

  - You are about to drop the column `foto_KTP` on the `user` table. All the data in the column will be lost.
  - Added the required column `fotoKTP` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `foto_KTP`,
    ADD COLUMN `fotoKTP` VARCHAR(191) NOT NULL;
