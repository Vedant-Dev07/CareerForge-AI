-- Extend the existing readiness history without replacing prior snapshots.
ALTER TABLE "ReadinessScore"
ADD COLUMN "roadmapProgress" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "weakSkillCount" INTEGER NOT NULL DEFAULT 0;

CREATE INDEX "ReadinessScore_studentProfileId_createdAt_idx"
ON "ReadinessScore"("studentProfileId", "createdAt");
