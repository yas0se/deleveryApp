-- CreateTable
CREATE TABLE `Demande` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `offer` DOUBLE NOT NULL,
    `userId` INTEGER NOT NULL,
    `parcelId` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'pending',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Demande` ADD CONSTRAINT `Demande_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Demande` ADD CONSTRAINT `Demande_parcelId_fkey` FOREIGN KEY (`parcelId`) REFERENCES `Parcel`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
