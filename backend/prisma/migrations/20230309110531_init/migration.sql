/*
  Warnings:

  - Added the required column `parentOrganisationId` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "parentOrganisationId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Organisation" ADD COLUMN     "parentOrganisationId" TEXT;
