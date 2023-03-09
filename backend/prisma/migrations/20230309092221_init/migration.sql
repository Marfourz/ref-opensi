/*
  Warnings:

  - You are about to drop the column `transactionId` on the `Invoice` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[invoiceId]` on the table `Transaction` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `invoiceId` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_transactionId_fkey";

-- DropIndex
DROP INDEX "Invoice_transactionId_key";

-- AlterTable
ALTER TABLE "Invoice" DROP COLUMN "transactionId";

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "invoiceId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_invoiceId_key" ON "Transaction"("invoiceId");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
