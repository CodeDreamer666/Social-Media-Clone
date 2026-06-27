/*
  Warnings:

  - You are about to drop the column `commentCount` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `likeCount` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `followersCount` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `followingCount` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `Like` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_postId_fkey";

-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_userId_fkey";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "commentCount",
DROP COLUMN "likeCount";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "followersCount",
DROP COLUMN "followingCount";

-- DropTable
DROP TABLE "Like";
