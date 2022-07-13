-- CreateTable
CREATE TABLE `User` (
    `id_user` INTEGER NOT NULL AUTO_INCREMENT,
    `is_admin` BOOLEAN NOT NULL DEFAULT false,
    `name` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `foto_KTP` VARCHAR(191) NOT NULL,
    `verification_status` ENUM('DRAFT', 'VERIFIED', 'REJECTED') NOT NULL DEFAULT 'DRAFT',
    `saldo` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `User_username_key`(`username`),
    PRIMARY KEY (`id_user`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ReqSaldoChange` (
    `id_req_saldo_change` INTEGER NOT NULL AUTO_INCREMENT,
    `id_user` INTEGER NOT NULL,
    `currency` VARCHAR(191) NOT NULL,
    `amount_source` INTEGER NOT NULL,
    `amount_target` INTEGER NOT NULL,
    `verification_status` ENUM('DRAFT', 'VERIFIED', 'REJECTED') NOT NULL DEFAULT 'DRAFT',

    PRIMARY KEY (`id_req_saldo_change`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ReqTransfer` (
    `id_req_transfer` INTEGER NOT NULL AUTO_INCREMENT,
    `id_user` INTEGER NOT NULL,
    `currency` VARCHAR(191) NOT NULL,
    `amount` INTEGER NOT NULL,
    `verification_status` ENUM('DRAFT', 'VERIFIED', 'REJECTED') NOT NULL DEFAULT 'DRAFT',

    PRIMARY KEY (`id_req_transfer`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ReqSaldoChange` ADD CONSTRAINT `ReqSaldoChange_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `User`(`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReqTransfer` ADD CONSTRAINT `ReqTransfer_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `User`(`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE;
