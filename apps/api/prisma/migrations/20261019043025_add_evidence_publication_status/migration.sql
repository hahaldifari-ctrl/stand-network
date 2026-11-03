-- CreateEnum
CREATE TYPE "EvidencePublicationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "Evidence" ADD COLUMN     "publicationStatus" "EvidencePublicationStatus" NOT NULL DEFAULT 'PENDING';

-- CreateIndex
CREATE INDEX "Evidence_publicationStatus_idx" ON "Evidence"("publicationStatus");
