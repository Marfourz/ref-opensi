-- CreateEnum
CREATE TYPE "UserStatusEnum" AS ENUM ('active', 'inactive', 'suspended');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "status" "UserStatusEnum" NOT NULL DEFAULT 'active';
