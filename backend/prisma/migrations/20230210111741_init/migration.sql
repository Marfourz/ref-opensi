/*
  Warnings:

  - You are about to drop the column `quantity` on the `Stock` table. All the data in the column will be lost.
  - Added the required column `currentQuantity` to the `Stock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `originalQuantity` to the `Stock` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Stock" DROP COLUMN "quantity",
ADD COLUMN     "currentQuantity" INTEGER NOT NULL,
ADD COLUMN     "originalQuantity" INTEGER NOT NULL;
