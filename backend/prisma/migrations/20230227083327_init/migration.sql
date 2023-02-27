-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_organisationId_fkey";

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "organisationId" DROP NOT NULL,
ALTER COLUMN "totalAmount" DROP NOT NULL,
ALTER COLUMN "deliveryMan" DROP NOT NULL,
ALTER COLUMN "deliveryDate" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
