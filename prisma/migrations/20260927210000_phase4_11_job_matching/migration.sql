CREATE TABLE "JobOpportunity" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "location" TEXT,
    "workMode" TEXT,
    "description" TEXT,
    "requiredSkills" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "preferredSkills" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "experienceLevel" TEXT,
    "salaryRange" TEXT,
    "deadline" TIMESTAMP(3),
    "applicationUrl" TEXT NOT NULL,
    "source" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "JobOpportunity_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "JobRecommendation" (
    "id" TEXT NOT NULL,
    "studentProfileId" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "matchScore" INTEGER NOT NULL,
    "careerAlignment" INTEGER NOT NULL,
    "skillCoverage" INTEGER NOT NULL,
    "evidenceScore" INTEGER NOT NULL,
    "resumeAlignment" INTEGER NOT NULL,
    "projectRelevance" INTEGER NOT NULL,
    "aptitudeReadiness" INTEGER NOT NULL,
    "interviewReadiness" INTEGER NOT NULL,
    "missingSkills" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "explanation" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "JobRecommendation_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "JobApplication" (
    "id" TEXT NOT NULL,
    "studentProfileId" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'SAVED',
    "appliedAt" TIMESTAMP(3),
    "notes" TEXT,
    "interviewDate" TIMESTAMP(3),
    "interviewNotes" TEXT,
    "followUpDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "JobApplication_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "JobRecommendation_studentProfileId_jobId_key" ON "JobRecommendation"("studentProfileId", "jobId");
CREATE INDEX "JobOpportunity_company_idx" ON "JobOpportunity"("company");
CREATE INDEX "JobOpportunity_isActive_idx" ON "JobOpportunity"("isActive");
CREATE INDEX "JobOpportunity_deadline_idx" ON "JobOpportunity"("deadline");
CREATE INDEX "JobRecommendation_studentProfileId_matchScore_idx" ON "JobRecommendation"("studentProfileId", "matchScore");
CREATE INDEX "JobRecommendation_jobId_idx" ON "JobRecommendation"("jobId");
CREATE UNIQUE INDEX "JobApplication_studentProfileId_jobId_key" ON "JobApplication"("studentProfileId", "jobId");
CREATE INDEX "JobApplication_studentProfileId_status_idx" ON "JobApplication"("studentProfileId", "status");
CREATE INDEX "JobApplication_jobId_idx" ON "JobApplication"("jobId");

ALTER TABLE "JobRecommendation" ADD CONSTRAINT "JobRecommendation_studentProfileId_fkey" FOREIGN KEY ("studentProfileId") REFERENCES "StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "JobRecommendation" ADD CONSTRAINT "JobRecommendation_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "JobOpportunity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "JobApplication" ADD CONSTRAINT "JobApplication_studentProfileId_fkey" FOREIGN KEY ("studentProfileId") REFERENCES "StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "JobApplication" ADD CONSTRAINT "JobApplication_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "JobOpportunity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

INSERT INTO "JobOpportunity" ("id", "title", "company", "location", "workMode", "description", "requiredSkills", "preferredSkills", "experienceLevel", "salaryRange", "applicationUrl", "source", "updatedAt")
VALUES
('job_phase411_fullstack', 'Full-Stack Software Engineer', 'Northstar Labs', 'Bengaluru, India', 'HYBRID', 'Build reliable product experiences across React and API services.', ARRAY['JavaScript','React','Node.js','SQL'], ARRAY['Docker','AWS','TypeScript'], 'Entry level', '₹8-14 LPA', 'https://example.com/jobs/fullstack', 'CareerForge catalog', CURRENT_TIMESTAMP),
('job_phase411_data', 'Data Analyst', 'SignalWorks', 'Remote - India', 'REMOTE', 'Turn product data into clear decisions with repeatable analysis and dashboards.', ARRAY['Python','SQL','Pandas'], ARRAY['Power BI','Statistics','A/B testing'], 'Entry level', '₹6-10 LPA', 'https://example.com/jobs/data-analyst', 'CareerForge catalog', CURRENT_TIMESTAMP),
('job_phase411_frontend', 'Frontend Developer', 'PixelGrid', 'Pune, India', 'HYBRID', 'Create accessible interfaces and collaborate with design and platform teams.', ARRAY['JavaScript','React','CSS'], ARRAY['Next.js','Testing','TypeScript'], 'Entry level', '₹7-12 LPA', 'https://example.com/jobs/frontend', 'CareerForge catalog', CURRENT_TIMESTAMP),
('job_phase411_backend', 'Backend Engineer', 'Cloudline Systems', 'Hyderabad, India', 'ONSITE', 'Design APIs and data services for a growing B2B platform.', ARRAY['Python','FastAPI','PostgreSQL'], ARRAY['Docker','AWS','Redis'], 'Entry level', '₹8-15 LPA', 'https://example.com/jobs/backend', 'CareerForge catalog', CURRENT_TIMESTAMP),
('job_phase411_qa', 'Quality Engineer', 'Evergreen Software', 'Remote - India', 'REMOTE', 'Build pragmatic automated test coverage for customer-facing software.', ARRAY['JavaScript','Testing','SQL'], ARRAY['Playwright','CI/CD','Python'], 'Entry level', '₹5-9 LPA', 'https://example.com/jobs/quality-engineer', 'CareerForge catalog', CURRENT_TIMESTAMP);
