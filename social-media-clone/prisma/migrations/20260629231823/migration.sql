/*
  Warnings:

  - A unique constraint covering the columns `[imageUrl]` on the table `UploadedImage` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[imageId]` on the table `UploadedImage` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[postId]` on the table `UploadedImage` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "ConnectionStatus" AS ENUM ('PENDING', 'ACCEPTED');

-- CreateTable
CREATE TABLE "Connection" (
    "id" TEXT NOT NULL,
    "requestUserId" TEXT NOT NULL,
    "responseUserId" TEXT NOT NULL,
    "status" "ConnectionStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Connection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Connection_requestUserId_responseUserId_key" ON "Connection"("requestUserId", "responseUserId");

-- CreateIndex
CREATE UNIQUE INDEX "UploadedImage_imageUrl_key" ON "UploadedImage"("imageUrl");

-- CreateIndex
CREATE UNIQUE INDEX "UploadedImage_imageId_key" ON "UploadedImage"("imageId");

-- CreateIndex
CREATE UNIQUE INDEX "UploadedImage_postId_key" ON "UploadedImage"("postId");

-- AddForeignKey
ALTER TABLE "Connection" ADD CONSTRAINT "Connection_requestUserId_fkey" FOREIGN KEY ("requestUserId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Connection" ADD CONSTRAINT "Connection_responseUserId_fkey" FOREIGN KEY ("responseUserId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
