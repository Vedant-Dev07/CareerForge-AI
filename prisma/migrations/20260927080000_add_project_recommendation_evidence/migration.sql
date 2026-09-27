ALTER TABLE "Project"
ADD COLUMN "careerRoleId" TEXT;

CREATE INDEX "Project_careerRoleId_idx" ON "Project"("careerRoleId");

ALTER TABLE "Project"
ADD CONSTRAINT "Project_careerRoleId_fkey"
FOREIGN KEY ("careerRoleId") REFERENCES "CareerRole"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "ProjectRecommendation"
ADD COLUMN "status" TEXT NOT NULL DEFAULT 'RECOMMENDED',
ADD COLUMN "repositoryUrl" TEXT,
ADD COLUMN "demoUrl" TEXT,
ADD COLUMN "summary" TEXT,
ADD COLUMN "skillsDemonstrated" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
ADD COLUMN "startedAt" TIMESTAMP(3),
ADD COLUMN "completedAt" TIMESTAMP(3);

CREATE INDEX "ProjectRecommendation_status_idx" ON "ProjectRecommendation"("status");
