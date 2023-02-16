/*
  Warnings:

  - The values [pending,rejected] on the enum `OrderStatusEnum` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "OrderStatusEnum_new" AS ENUM ('new', 'delivered', 'acepted');
ALTER TABLE "Order" ALTER COLUMN "status" TYPE "OrderStatusEnum_new" USING ("status"::text::"OrderStatusEnum_new");
ALTER TYPE "OrderStatusEnum" RENAME TO "OrderStatusEnum_old";
ALTER TYPE "OrderStatusEnum_new" RENAME TO "OrderStatusEnum";
DROP TYPE "OrderStatusEnum_old";
COMMIT;
