-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "streamId" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Message_streamId_idx" ON "Message"("streamId");
