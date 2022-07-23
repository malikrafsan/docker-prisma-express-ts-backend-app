/*
  Warnings:

  - You are about to drop the `reqtransfer` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `reqtransfer` DROP FOREIGN KEY `ReqTransfer_id_user_fkey`;

-- DropTable
DROP TABLE `reqtransfer`;

-- CreateTable
CREATE TABLE `Transfer` (
    `id_req_transfer` INTEGER NOT NULL AUTO_INCREMENT,
    `id_user_src` INTEGER NOT NULL,
    `id_user_dest` INTEGER NOT NULL,
    `currency` VARCHAR(191) NOT NULL,
    `amount` INTEGER NOT NULL,

    PRIMARY KEY (`id_req_transfer`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Transfer` ADD CONSTRAINT `Transfer_id_user_src_fkey` FOREIGN KEY (`id_user_src`) REFERENCES `User`(`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transfer` ADD CONSTRAINT `Transfer_id_user_dest_fkey` FOREIGN KEY (`id_user_dest`) REFERENCES `User`(`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE;
