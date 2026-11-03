/*
  Warnings:

  - The values [KIDNAPPING] on the enum `IncidentType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `location` on the `Incident` table. All the data in the column will be lost.
  - Added the required column `state` to the `Incident` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "IncidentMotivation" AS ENUM ('RELIGIOUS_PERSECUTION', 'INSURGENCY_TERRORISM', 'CRIMINAL_RANSOM', 'LAND_RESOURCE_CONFLICT', 'COMMUNAL_VIOLENCE', 'POLITICAL', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "ReligiousContext" AS ENUM ('HIGH', 'MODERATE', 'LOW', 'UNKNOWN', 'UNDER_REVIEW');

-- CreateEnum
CREATE TYPE "ConfidenceLevel" AS ENUM ('UNVERIFIED', 'CORROBORATING', 'VERIFIED', 'DISPUTED');

-- AlterEnum
BEGIN;
CREATE TYPE "IncidentType_new" AS ENUM ('ATTACK', 'KILLING', 'ABDUCTION', 'DISPLACEMENT', 'DESTRUCTION', 'THREAT', 'ARSON', 'OTHER');
ALTER TABLE "Incident" ALTER COLUMN "incidentType" TYPE "IncidentType_new" USING ("incidentType"::text::"IncidentType_new");
ALTER TYPE "IncidentType" RENAME TO "IncidentType_old";
ALTER TYPE "IncidentType_new" RENAME TO "IncidentType";
DROP TYPE "public"."IncidentType_old";
COMMIT;

-- DropIndex
DROP INDEX "Incident_location_idx";

-- AlterTable
ALTER TABLE "Incident" DROP COLUMN "location",
ADD COLUMN     "confidenceLevel" "ConfidenceLevel" NOT NULL DEFAULT 'UNVERIFIED',
ADD COLUMN     "lga" TEXT,
ADD COLUMN     "motivation" "IncidentMotivation" NOT NULL DEFAULT 'UNKNOWN',
ADD COLUMN     "peopleAbducted" INTEGER,
ADD COLUMN     "peopleDisplaced" INTEGER,
ADD COLUMN     "peopleInjured" INTEGER,
ADD COLUMN     "peopleKilled" INTEGER,
ADD COLUMN     "propertyDamage" TEXT,
ADD COLUMN     "region" TEXT,
ADD COLUMN     "religiousContext" "ReligiousContext" NOT NULL DEFAULT 'UNKNOWN',
ADD COLUMN     "state" TEXT NOT NULL,
ADD COLUMN     "verificationSummary" TEXT;

-- CreateIndex
CREATE INDEX "Incident_motivation_idx" ON "Incident"("motivation");

-- CreateIndex
CREATE INDEX "Incident_religiousContext_idx" ON "Incident"("religiousContext");

-- CreateIndex
CREATE INDEX "Incident_confidenceLevel_idx" ON "Incident"("confidenceLevel");

-- CreateIndex
CREATE INDEX "Incident_state_idx" ON "Incident"("state");

-- CreateIndex
CREATE INDEX "Incident_lga_idx" ON "Incident"("lga");
