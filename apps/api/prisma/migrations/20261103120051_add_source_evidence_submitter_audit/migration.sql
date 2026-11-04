-- AlterTable
ALTER TABLE "Evidence" ADD COLUMN     "submittedById" TEXT;

-- AlterTable
ALTER TABLE "Source" ADD COLUMN     "submittedById" TEXT;

-- CreateIndex
CREATE INDEX "Evidence_submittedById_idx" ON "Evidence"("submittedById");

-- CreateIndex
CREATE INDEX "Source_submittedById_idx" ON "Source"("submittedById");

-- AddForeignKey
ALTER TABLE "Source" ADD CONSTRAINT "Source_submittedById_fkey" FOREIGN KEY ("submittedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evidence" ADD CONSTRAINT "Evidence_submittedById_fkey" FOREIGN KEY ("submittedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
