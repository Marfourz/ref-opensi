/*
  Warnings:

  - Made the column `organisationId` on table `Order` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_organisationId_fkey";

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "organisationId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
