ALTER TABLE "StudentProfile"
ADD COLUMN "preferredDomain" TEXT,
ADD COLUMN "preferredJobType" TEXT,
ADD COLUMN "programmingLanguages" TEXT,
ADD COLUMN "frameworks" TEXT,
ADD COLUMN "databases" TEXT,
ADD COLUMN "tools" TEXT,
ADD COLUMN "certifications" TEXT,
ADD COLUMN "projects" TEXT,
ADD COLUMN "experience" TEXT,
ADD COLUMN "github" TEXT,
ADD COLUMN "linkedin" TEXT,
ADD COLUMN "portfolio" TEXT,
ADD COLUMN "targetCareerId" TEXT;

CREATE TABLE "CareerAnalysis" (
    "id" TEXT NOT NULL,
    "studentProfileId" TEXT NOT NULL,
    "careerRoleId" TEXT NOT NULL,
    "matchPercentage" INTEGER NOT NULL,
    "matchedSkills" TEXT[] NOT NULL,
    "missingSkills" TEXT[] NOT NULL,
    "recommendations" TEXT[] NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CareerAnalysis_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "StudentProfile_targetCareerId_idx" ON "StudentProfile"("targetCareerId");
CREATE INDEX "CareerAnalysis_studentProfileId_createdAt_idx" ON "CareerAnalysis"("studentProfileId", "createdAt");
CREATE INDEX "CareerAnalysis_careerRoleId_idx" ON "CareerAnalysis"("careerRoleId");

ALTER TABLE "StudentProfile"
ADD CONSTRAINT "StudentProfile_targetCareerId_fkey"
FOREIGN KEY ("targetCareerId") REFERENCES "CareerRole"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "CareerAnalysis"
ADD CONSTRAINT "CareerAnalysis_studentProfileId_fkey"
FOREIGN KEY ("studentProfileId") REFERENCES "StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT "CareerAnalysis_careerRoleId_fkey"
FOREIGN KEY ("careerRoleId") REFERENCES "CareerRole"("id") ON DELETE CASCADE ON UPDATE CASCADE;
