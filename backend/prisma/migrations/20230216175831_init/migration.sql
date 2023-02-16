-- CreateEnum
CREATE TYPE "OrganisationStatusEnum" AS ENUM ('active', 'inactive');

-- AlterTable
ALTER TABLE "Organisation" ADD COLUMN     "status" "OrganisationStatusEnum" NOT NULL DEFAULT 'active';
