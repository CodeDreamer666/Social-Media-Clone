/*
  Warnings:

  - You are about to drop the column `comment` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `createdById` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `like` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Post` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_createdById_fkey";

-- DropIndex
DROP INDEX "Post_name_idx";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "comment",
DROP COLUMN "createdById",
DROP COLUMN "like",
DROP COLUMN "name",
ADD COLUMN     "commentCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "likeCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
