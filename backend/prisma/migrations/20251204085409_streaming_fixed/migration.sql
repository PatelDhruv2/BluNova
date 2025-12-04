-- DropForeignKey
ALTER TABLE "public"."StreamViewer" DROP CONSTRAINT "StreamViewer_userId_fkey";

-- DropIndex
DROP INDEX "public"."Stream_userId_key";

-- AddForeignKey
ALTER TABLE "StreamViewer" ADD CONSTRAINT "StreamViewer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
