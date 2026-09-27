-- AlterTable
ALTER TABLE "InterviewSession" ALTER COLUMN "difficulty" DROP DEFAULT;

-- CreateTable
CREATE TABLE "GitHubConnection" (
    "id" TEXT NOT NULL,
    "studentProfileId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "scope" TEXT,
    "lastSyncedAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GitHubConnection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GitHubRepository" (
    "id" TEXT NOT NULL,
    "connectionId" TEXT NOT NULL,
    "repositoryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "description" TEXT,
    "url" TEXT NOT NULL,
    "primaryLanguage" TEXT,
    "languages" JSONB,
    "stars" INTEGER NOT NULL DEFAULT 0,
    "forks" INTEGER NOT NULL DEFAULT 0,
    "topics" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "hasReadme" BOOLEAN NOT NULL DEFAULT false,
    "readmeLength" INTEGER,
    "hasLicense" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "pushedAt" TIMESTAMP(3),
    "lastSyncedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GitHubRepository_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GitHubSkillEvidence" (
    "id" TEXT NOT NULL,
    "connectionId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,
    "repositoryIds" TEXT[],
    "confidence" TEXT NOT NULL,
    "evidenceCount" INTEGER NOT NULL DEFAULT 0,
    "lastAnalyzedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GitHubSkillEvidence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LinkedInProfile" (
    "id" TEXT NOT NULL,
    "studentProfileId" TEXT NOT NULL,
    "profileUrl" TEXT,
    "name" TEXT,
    "headline" TEXT,
    "about" TEXT,
    "location" TEXT,
    "lastSyncedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LinkedInProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LinkedInSkill" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,
    "proficiency" TEXT,
    "endorsements" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LinkedInSkill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LinkedInExperience" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "location" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "isCurrent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LinkedInExperience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LinkedInEducation" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "degree" TEXT,
    "field" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LinkedInEducation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfessionalEvidence" (
    "id" TEXT NOT NULL,
    "studentProfileId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "sourceReference" TEXT,
    "evidenceType" TEXT NOT NULL,
    "confidence" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProfessionalEvidence_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GitHubConnection_studentProfileId_key" ON "GitHubConnection"("studentProfileId");

-- CreateIndex
CREATE INDEX "GitHubConnection_studentProfileId_idx" ON "GitHubConnection"("studentProfileId");

-- CreateIndex
CREATE INDEX "GitHubConnection_username_idx" ON "GitHubConnection"("username");

-- CreateIndex
CREATE INDEX "GitHubRepository_connectionId_idx" ON "GitHubRepository"("connectionId");

-- CreateIndex
CREATE INDEX "GitHubRepository_repositoryId_idx" ON "GitHubRepository"("repositoryId");

-- CreateIndex
CREATE INDEX "GitHubRepository_primaryLanguage_idx" ON "GitHubRepository"("primaryLanguage");

-- CreateIndex
CREATE INDEX "GitHubSkillEvidence_connectionId_idx" ON "GitHubSkillEvidence"("connectionId");

-- CreateIndex
CREATE INDEX "GitHubSkillEvidence_skillId_idx" ON "GitHubSkillEvidence"("skillId");

-- CreateIndex
CREATE INDEX "GitHubSkillEvidence_confidence_idx" ON "GitHubSkillEvidence"("confidence");

-- CreateIndex
CREATE UNIQUE INDEX "GitHubSkillEvidence_connectionId_skillId_key" ON "GitHubSkillEvidence"("connectionId", "skillId");

-- CreateIndex
CREATE UNIQUE INDEX "LinkedInProfile_studentProfileId_key" ON "LinkedInProfile"("studentProfileId");

-- CreateIndex
CREATE INDEX "LinkedInProfile_studentProfileId_idx" ON "LinkedInProfile"("studentProfileId");

-- CreateIndex
CREATE INDEX "LinkedInSkill_profileId_idx" ON "LinkedInSkill"("profileId");

-- CreateIndex
CREATE INDEX "LinkedInSkill_skillId_idx" ON "LinkedInSkill"("skillId");

-- CreateIndex
CREATE UNIQUE INDEX "LinkedInSkill_profileId_skillId_key" ON "LinkedInSkill"("profileId", "skillId");

-- CreateIndex
CREATE INDEX "LinkedInExperience_profileId_idx" ON "LinkedInExperience"("profileId");

-- CreateIndex
CREATE INDEX "LinkedInExperience_company_idx" ON "LinkedInExperience"("company");

-- CreateIndex
CREATE INDEX "LinkedInEducation_profileId_idx" ON "LinkedInEducation"("profileId");

-- CreateIndex
CREATE INDEX "LinkedInEducation_institution_idx" ON "LinkedInEducation"("institution");

-- CreateIndex
CREATE INDEX "ProfessionalEvidence_studentProfileId_idx" ON "ProfessionalEvidence"("studentProfileId");

-- CreateIndex
CREATE INDEX "ProfessionalEvidence_skillId_idx" ON "ProfessionalEvidence"("skillId");

-- CreateIndex
CREATE INDEX "ProfessionalEvidence_source_idx" ON "ProfessionalEvidence"("source");

-- CreateIndex
CREATE INDEX "ProfessionalEvidence_confidence_idx" ON "ProfessionalEvidence"("confidence");

-- CreateIndex
CREATE UNIQUE INDEX "ProfessionalEvidence_studentProfileId_skillId_source_source_key" ON "ProfessionalEvidence"("studentProfileId", "skillId", "source", "sourceReference");

-- AddForeignKey
ALTER TABLE "GitHubConnection" ADD CONSTRAINT "GitHubConnection_studentProfileId_fkey" FOREIGN KEY ("studentProfileId") REFERENCES "StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GitHubRepository" ADD CONSTRAINT "GitHubRepository_connectionId_fkey" FOREIGN KEY ("connectionId") REFERENCES "GitHubConnection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GitHubSkillEvidence" ADD CONSTRAINT "GitHubSkillEvidence_connectionId_fkey" FOREIGN KEY ("connectionId") REFERENCES "GitHubConnection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GitHubSkillEvidence" ADD CONSTRAINT "GitHubSkillEvidence_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LinkedInProfile" ADD CONSTRAINT "LinkedInProfile_studentProfileId_fkey" FOREIGN KEY ("studentProfileId") REFERENCES "StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LinkedInSkill" ADD CONSTRAINT "LinkedInSkill_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "LinkedInProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LinkedInSkill" ADD CONSTRAINT "LinkedInSkill_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LinkedInExperience" ADD CONSTRAINT "LinkedInExperience_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "LinkedInProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LinkedInEducation" ADD CONSTRAINT "LinkedInEducation_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "LinkedInProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfessionalEvidence" ADD CONSTRAINT "ProfessionalEvidence_studentProfileId_fkey" FOREIGN KEY ("studentProfileId") REFERENCES "StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfessionalEvidence" ADD CONSTRAINT "ProfessionalEvidence_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;
