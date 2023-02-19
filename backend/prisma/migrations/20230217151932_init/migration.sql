-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_engineId_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "engineId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_engineId_fkey" FOREIGN KEY ("engineId") REFERENCES "Engine"("id") ON DELETE SET NULL ON UPDATE CASCADE;
