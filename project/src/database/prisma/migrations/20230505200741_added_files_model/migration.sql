-- CreateTable
CREATE TABLE "files" (
    "id" UUID NOT NULL,
    "mimeType" TEXT,
    "size" BIGINT NOT NULL DEFAULT 0,
    "originalName" TEXT NOT NULL,
    "finalName" TEXT NOT NULL,
    "creatorId" UUID NOT NULL,
    "postId" UUID NOT NULL,

    CONSTRAINT "files_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
