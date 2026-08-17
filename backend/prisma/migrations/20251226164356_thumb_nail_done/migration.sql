-- AlterTable
ALTER TABLE "UserFile" ADD COLUMN     "streamId" INTEGER;

-- CreateIndex
CREATE INDEX "UserFile_streamId_idx" ON "UserFile"("streamId");

-- AddForeignKey
ALTER TABLE "UserFile" ADD CONSTRAINT "UserFile_streamId_fkey" FOREIGN KEY ("streamId") REFERENCES "Stream"("id") ON DELETE CASCADE ON UPDATE CASCADE;
