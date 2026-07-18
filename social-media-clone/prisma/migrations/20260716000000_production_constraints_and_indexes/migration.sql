-- Reject impossible connection records even if application validation is bypassed.
ALTER TABLE "Connection"
ADD CONSTRAINT "Connection_distinct_users_check"
CHECK ("requestUserId" <> "responseUserId");

-- A new account may have no interests; every configured account must have exactly three.
ALTER TABLE "user"
ADD CONSTRAINT "user_interest_count_check"
CHECK (cardinality("interest") IN (0, 3));

-- Make future account deletion consistent across user-authored and relationship data.
ALTER TABLE "Post" DROP CONSTRAINT "Post_userId_fkey";
ALTER TABLE "Post"
ADD CONSTRAINT "Post_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Comment" DROP CONSTRAINT "Comment_userId_fkey";
ALTER TABLE "Comment"
ADD CONSTRAINT "Comment_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "UploadedImage" DROP CONSTRAINT "UploadedImage_userId_fkey";
ALTER TABLE "UploadedImage"
ADD CONSTRAINT "UploadedImage_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "UploadedImage" DROP CONSTRAINT "UploadedImage_postId_fkey";
ALTER TABLE "UploadedImage"
ADD CONSTRAINT "UploadedImage_postId_fkey"
FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Connection" DROP CONSTRAINT "Connection_requestUserId_fkey";
ALTER TABLE "Connection"
ADD CONSTRAINT "Connection_requestUserId_fkey"
FOREIGN KEY ("requestUserId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Connection" DROP CONSTRAINT "Connection_responseUserId_fkey";
ALTER TABLE "Connection"
ADD CONSTRAINT "Connection_responseUserId_fkey"
FOREIGN KEY ("responseUserId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE UNIQUE INDEX "UploadedImage_imageId_key" ON "UploadedImage"("imageId");
CREATE UNIQUE INDEX "account_providerId_accountId_key" ON "account"("providerId", "accountId");
CREATE INDEX "Post_createdAt_id_idx" ON "Post"("createdAt", "id");
CREATE INDEX "Post_userId_createdAt_idx" ON "Post"("userId", "createdAt");
CREATE INDEX "Post_interest_createdAt_idx" ON "Post"("interest", "createdAt");
CREATE INDEX "Comment_postId_createdAt_id_idx" ON "Comment"("postId", "createdAt", "id");
CREATE INDEX "UploadedImage_userId_isIncludeInPost_createdAt_idx"
ON "UploadedImage"("userId", "isIncludeInPost", "createdAt");
CREATE INDEX "Connection_requestUserId_status_createdAt_idx"
ON "Connection"("requestUserId", "status", "createdAt");
CREATE INDEX "Connection_responseUserId_status_createdAt_idx"
ON "Connection"("responseUserId", "status", "createdAt");

