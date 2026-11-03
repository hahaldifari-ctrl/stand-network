-- CreateEnum
CREATE TYPE "IntakeStatus" AS ENUM ('NEW', 'UNDER_REVIEW', 'NEEDS_MORE_INFORMATION', 'ACCEPTED', 'REJECTED', 'DUPLICATE', 'CONVERTED');

-- CreateEnum
CREATE TYPE "IntakeAnalysisStatus" AS ENUM ('DRAFT', 'REVIEWED', 'SUPERSEDED');

-- CreateEnum
CREATE TYPE "IntakeReviewDecision" AS ENUM ('START_REVIEW', 'NEEDS_MORE_INFORMATION', 'ACCEPT_FOR_INCIDENT', 'REJECT', 'MARK_DUPLICATE');

-- CreateTable
CREATE TABLE "IncidentIntake" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "originalText" TEXT NOT NULL,
    "countryCode" VARCHAR(2) NOT NULL DEFAULT 'NG',
    "admin1" TEXT,
    "admin2" TEXT,
    "locality" TEXT,
    "claimedIncidentDate" TIMESTAMP(3),
    "incidentType" "IncidentType",
    "status" "IntakeStatus" NOT NULL DEFAULT 'NEW',
    "submittedById" TEXT,
    "createdIncidentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IncidentIntake_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IntakeSource" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sourceType" "SourceType" NOT NULL,
    "url" TEXT,
    "canonicalUrl" TEXT,
    "title" TEXT,
    "publisher" TEXT,
    "author" TEXT,
    "publishedAt" TIMESTAMP(3),
    "retrievedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "excerpt" TEXT,
    "contentHash" TEXT,
    "notes" TEXT,
    "intakeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IntakeSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IntakeAnalysis" (
    "id" TEXT NOT NULL,
    "provider" TEXT,
    "model" TEXT,
    "promptVersion" TEXT,
    "summary" TEXT NOT NULL,
    "extractedData" JSONB,
    "uncertaintyNotes" TEXT,
    "duplicateCandidates" JSONB,
    "status" "IntakeAnalysisStatus" NOT NULL DEFAULT 'DRAFT',
    "intakeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IntakeAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IntakeReview" (
    "id" TEXT NOT NULL,
    "decision" "IntakeReviewDecision" NOT NULL,
    "notes" TEXT,
    "intakeId" TEXT NOT NULL,
    "reviewerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IntakeReview_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "IncidentIntake_createdIncidentId_key" ON "IncidentIntake"("createdIncidentId");

-- CreateIndex
CREATE INDEX "IncidentIntake_status_createdAt_idx" ON "IncidentIntake"("status", "createdAt");

-- CreateIndex
CREATE INDEX "IncidentIntake_countryCode_admin1_admin2_idx" ON "IncidentIntake"("countryCode", "admin1", "admin2");

-- CreateIndex
CREATE INDEX "IncidentIntake_claimedIncidentDate_idx" ON "IncidentIntake"("claimedIncidentDate");

-- CreateIndex
CREATE INDEX "IncidentIntake_submittedById_idx" ON "IncidentIntake"("submittedById");

-- CreateIndex
CREATE INDEX "IntakeSource_intakeId_idx" ON "IntakeSource"("intakeId");

-- CreateIndex
CREATE INDEX "IntakeSource_sourceType_idx" ON "IntakeSource"("sourceType");

-- CreateIndex
CREATE INDEX "IntakeSource_contentHash_idx" ON "IntakeSource"("contentHash");

-- CreateIndex
CREATE INDEX "IntakeSource_canonicalUrl_idx" ON "IntakeSource"("canonicalUrl");

-- CreateIndex
CREATE INDEX "IntakeAnalysis_intakeId_createdAt_idx" ON "IntakeAnalysis"("intakeId", "createdAt");

-- CreateIndex
CREATE INDEX "IntakeAnalysis_status_idx" ON "IntakeAnalysis"("status");

-- CreateIndex
CREATE INDEX "IntakeReview_intakeId_createdAt_idx" ON "IntakeReview"("intakeId", "createdAt");

-- CreateIndex
CREATE INDEX "IntakeReview_reviewerId_idx" ON "IntakeReview"("reviewerId");

-- CreateIndex
CREATE INDEX "IntakeReview_decision_idx" ON "IntakeReview"("decision");

-- AddForeignKey
ALTER TABLE "IncidentIntake" ADD CONSTRAINT "IncidentIntake_submittedById_fkey" FOREIGN KEY ("submittedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncidentIntake" ADD CONSTRAINT "IncidentIntake_createdIncidentId_fkey" FOREIGN KEY ("createdIncidentId") REFERENCES "Incident"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntakeSource" ADD CONSTRAINT "IntakeSource_intakeId_fkey" FOREIGN KEY ("intakeId") REFERENCES "IncidentIntake"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntakeAnalysis" ADD CONSTRAINT "IntakeAnalysis_intakeId_fkey" FOREIGN KEY ("intakeId") REFERENCES "IncidentIntake"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntakeReview" ADD CONSTRAINT "IntakeReview_intakeId_fkey" FOREIGN KEY ("intakeId") REFERENCES "IncidentIntake"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntakeReview" ADD CONSTRAINT "IntakeReview_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
