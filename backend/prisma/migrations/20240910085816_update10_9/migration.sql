/*
  Warnings:

  - Added the required column `imageUrl` to the `Parcel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `parcel` ADD COLUMN `imageUrl` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `isAdmine` BOOLEAN NOT NULL DEFAULT false;
