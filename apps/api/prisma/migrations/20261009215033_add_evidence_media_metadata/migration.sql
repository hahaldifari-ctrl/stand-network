-- CreateEnum
CREATE TYPE "EvidenceContentRating" AS ENUM ('STANDARD', 'GRAPHIC');

-- CreateEnum
CREATE TYPE "EvidenceVerificationStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED');

-- AlterTable
ALTER TABLE "Evidence" ADD COLUMN     "caption" TEXT,
ADD COLUMN     "contentRating" "EvidenceContentRating" NOT NULL DEFAULT 'STANDARD',
ADD COLUMN     "credit" TEXT,
ADD COLUMN     "license" TEXT,
ADD COLUMN     "verificationStatus" "EvidenceVerificationStatus" NOT NULL DEFAULT 'PENDING';

-- CreateIndex
CREATE INDEX "Evidence_verificationStatus_idx" ON "Evidence"("verificationStatus");

-- CreateIndex
CREATE INDEX "Evidence_contentRating_idx" ON "Evidence"("contentRating");
