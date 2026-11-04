-- CreateEnum
CREATE TYPE "IncidentPublicationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "IncidentPublicationDecision" AS ENUM ('APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "Incident" ADD COLUMN     "publicationStatus" "IncidentPublicationStatus" NOT NULL DEFAULT 'PENDING';

-- CreateTable
CREATE TABLE "IncidentPublicationReview" (
    "id" TEXT NOT NULL,
    "incidentId" TEXT NOT NULL,
    "reviewerId" TEXT NOT NULL,
    "decision" "IncidentPublicationDecision" NOT NULL,
    "notes" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IncidentPublicationReview_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "IncidentPublicationReview_incidentId_idx" ON "IncidentPublicationReview"("incidentId");

-- CreateIndex
CREATE INDEX "IncidentPublicationReview_reviewerId_idx" ON "IncidentPublicationReview"("reviewerId");

-- CreateIndex
CREATE INDEX "IncidentPublicationReview_decision_idx" ON "IncidentPublicationReview"("decision");

-- CreateIndex
CREATE INDEX "IncidentPublicationReview_createdAt_idx" ON "IncidentPublicationReview"("createdAt");

-- CreateIndex
CREATE INDEX "Incident_publicationStatus_idx" ON "Incident"("publicationStatus");

-- AddForeignKey
ALTER TABLE "IncidentPublicationReview" ADD CONSTRAINT "IncidentPublicationReview_incidentId_fkey" FOREIGN KEY ("incidentId") REFERENCES "Incident"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncidentPublicationReview" ADD CONSTRAINT "IncidentPublicationReview_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
