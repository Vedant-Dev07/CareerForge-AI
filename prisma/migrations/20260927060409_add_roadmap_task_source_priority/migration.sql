-- AlterTable
ALTER TABLE "RoadmapTask" ADD COLUMN     "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
ADD COLUMN     "skillId" TEXT,
ADD COLUMN     "source" TEXT NOT NULL DEFAULT 'CAREER_GAP';

-- CreateTable
CREATE TABLE "SkillPerformance" (
    "id" TEXT NOT NULL,
    "studentProfileId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,
    "totalQuestions" INTEGER NOT NULL,
    "attemptedQuestions" INTEGER NOT NULL,
    "correctAnswers" INTEGER NOT NULL,
    "incorrectAnswers" INTEGER NOT NULL,
    "accuracy" DOUBLE PRECISION NOT NULL,
    "classification" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "assessmentCount" INTEGER NOT NULL DEFAULT 1,
    "lastAssessedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SkillPerformance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SkillPerformance_studentProfileId_idx" ON "SkillPerformance"("studentProfileId");

-- CreateIndex
CREATE INDEX "SkillPerformance_skillId_idx" ON "SkillPerformance"("skillId");

-- CreateIndex
CREATE UNIQUE INDEX "SkillPerformance_studentProfileId_skillId_key" ON "SkillPerformance"("studentProfileId", "skillId");

-- CreateIndex
CREATE INDEX "RoadmapTask_source_idx" ON "RoadmapTask"("source");

-- AddForeignKey
ALTER TABLE "SkillPerformance" ADD CONSTRAINT "SkillPerformance_studentProfileId_fkey" FOREIGN KEY ("studentProfileId") REFERENCES "StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkillPerformance" ADD CONSTRAINT "SkillPerformance_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;
