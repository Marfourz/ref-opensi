/*
  Warnings:

  - You are about to drop the column `actor` on the `ActivityLog` table. All the data in the column will be lost.
  - Added the required column `actorId` to the `ActivityLog` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `action` on the `ActivityLog` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ActionEnum" AS ENUM ('created', 'updated', 'deleted');

-- AlterTable
ALTER TABLE "ActivityLog" DROP COLUMN "actor",
ADD COLUMN     "actorId" TEXT NOT NULL,
DROP COLUMN "action",
ADD COLUMN     "action" "ActionEnum" NOT NULL;

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
