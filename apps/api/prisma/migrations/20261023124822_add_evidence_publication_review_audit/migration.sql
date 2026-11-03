-- CreateEnum
CREATE TYPE "EvidencePublicationDecision" AS ENUM ('APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "EvidencePublicationReview" (
    "id" TEXT NOT NULL,
    "decision" "EvidencePublicationDecision" NOT NULL,
    "notes" TEXT,
    "evidenceId" TEXT NOT NULL,
    "reviewerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EvidencePublicationReview_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EvidencePublicationReview_evidenceId_idx" ON "EvidencePublicationReview"("evidenceId");

-- CreateIndex
CREATE INDEX "EvidencePublicationReview_reviewerId_idx" ON "EvidencePublicationReview"("reviewerId");

-- CreateIndex
CREATE INDEX "EvidencePublicationReview_decision_idx" ON "EvidencePublicationReview"("decision");

-- CreateIndex
CREATE INDEX "EvidencePublicationReview_createdAt_idx" ON "EvidencePublicationReview"("createdAt");

-- AddForeignKey
ALTER TABLE "EvidencePublicationReview" ADD CONSTRAINT "EvidencePublicationReview_evidenceId_fkey" FOREIGN KEY ("evidenceId") REFERENCES "Evidence"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvidencePublicationReview" ADD CONSTRAINT "EvidencePublicationReview_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
