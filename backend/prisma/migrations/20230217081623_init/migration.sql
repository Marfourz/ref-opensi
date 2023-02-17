/*
  Warnings:

  - The values [admin] on the enum `UserRoleEnum` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UserRoleEnum_new" AS ENUM ('superUser', 'administrator', 'accountant', 'commercial', 'deliveryMan');
ALTER TABLE "User" ALTER COLUMN "role" TYPE "UserRoleEnum_new" USING ("role"::text::"UserRoleEnum_new");
ALTER TYPE "UserRoleEnum" RENAME TO "UserRoleEnum_old";
ALTER TYPE "UserRoleEnum_new" RENAME TO "UserRoleEnum";
DROP TYPE "UserRoleEnum_old";
COMMIT;
