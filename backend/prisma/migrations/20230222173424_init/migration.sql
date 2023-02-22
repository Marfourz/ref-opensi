/*
  Warnings:

  - You are about to drop the column `packPrice` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `rackPrice` on the `Product` table. All the data in the column will be lost.
  - Added the required column `packagingType` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PackagingTypeEnum" AS ENUM ('rack', 'pack');

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "packPrice",
DROP COLUMN "rackPrice",
ADD COLUMN     "packagingType" "PackagingTypeEnum" NOT NULL;
