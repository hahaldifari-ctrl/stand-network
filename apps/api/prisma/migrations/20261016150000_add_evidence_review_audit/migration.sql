CREATE TYPE "EvidenceReviewDecision" AS ENUM (
  'VERIFIED',
  'REJECTED'
);

CREATE TABLE "EvidenceReview" (
  "id" TEXT NOT NULL,
  "decision" "EvidenceReviewDecision" NOT NULL,
  "notes" TEXT,
  "evidenceId" TEXT NOT NULL,
  "reviewerId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "EvidenceReview_pkey"
    PRIMARY KEY ("id")
);

CREATE INDEX "EvidenceReview_evidenceId_idx"
  ON "EvidenceReview"("evidenceId");

CREATE INDEX "EvidenceReview_reviewerId_idx"
  ON "EvidenceReview"("reviewerId");

CREATE INDEX "EvidenceReview_decision_idx"
  ON "EvidenceReview"("decision");

CREATE INDEX "EvidenceReview_createdAt_idx"
  ON "EvidenceReview"("createdAt");

ALTER TABLE "EvidenceReview"
  ADD CONSTRAINT "EvidenceReview_evidenceId_fkey"
  FOREIGN KEY ("evidenceId")
  REFERENCES "Evidence"("id")
  ON DELETE CASCADE
  ON UPDATE CASCADE;

ALTER TABLE "EvidenceReview"
  ADD CONSTRAINT "EvidenceReview_reviewerId_fkey"
  FOREIGN KEY ("reviewerId")
  REFERENCES "User"("id")
  ON DELETE RESTRICT
  ON UPDATE CASCADE;