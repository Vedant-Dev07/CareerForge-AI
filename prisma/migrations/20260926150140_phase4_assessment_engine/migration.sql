/*
  Warnings:

  - You are about to drop the column `contentScore` on the `ResumeAnalysis` table. All the data in the column will be lost.
  - You are about to drop the column `feedback` on the `ResumeAnalysis` table. All the data in the column will be lost.
  - You are about to drop the column `keywordScore` on the `ResumeAnalysis` table. All the data in the column will be lost.
  - You are about to drop the column `overallScore` on the `ResumeAnalysis` table. All the data in the column will be lost.
  - You are about to drop the column `readabilityScore` on the `ResumeAnalysis` table. All the data in the column will be lost.
  - You are about to drop the column `skillsScore` on the `ResumeAnalysis` table. All the data in the column will be lost.
  - You are about to drop the column `structureScore` on the `ResumeAnalysis` table. All the data in the column will be lost.
  - Added the required column `sectionScore` to the `ResumeAnalysis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `ResumeAnalysis` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "QuestionCategory" AS ENUM ('QUANTITATIVE', 'LOGICAL_REASONING', 'VERBAL_ABILITY', 'DATA_INTERPRETATION', 'TECHNICAL');

-- CreateEnum
CREATE TYPE "QuestionDifficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- CreateEnum
CREATE TYPE "AssessmentStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED', 'EXPIRED');

-- AlterTable
ALTER TABLE "Resume" ADD COLUMN     "extractedText" TEXT,
ADD COLUMN     "fileSize" INTEGER,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "targetCareerId" TEXT,
ALTER COLUMN "fileUrl" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ResumeAnalysis" DROP COLUMN "contentScore",
DROP COLUMN "feedback",
DROP COLUMN "keywordScore",
DROP COLUMN "overallScore",
DROP COLUMN "readabilityScore",
DROP COLUMN "skillsScore",
DROP COLUMN "structureScore",
ADD COLUMN     "detectedSkills" TEXT[],
ADD COLUMN     "educationSummary" TEXT,
ADD COLUMN     "experienceSummary" TEXT,
ADD COLUMN     "keywords" TEXT[],
ADD COLUMN     "matchedSkills" TEXT[],
ADD COLUMN     "missingSkills" TEXT[],
ADD COLUMN     "projectSummary" TEXT,
ADD COLUMN     "recommendations" TEXT[],
ADD COLUMN     "sectionScore" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "category" "QuestionCategory" NOT NULL,
    "difficulty" "QuestionDifficulty" NOT NULL,
    "optionA" TEXT NOT NULL,
    "optionB" TEXT NOT NULL,
    "optionC" TEXT NOT NULL,
    "optionD" TEXT NOT NULL,
    "correctAnswer" TEXT NOT NULL,
    "explanation" TEXT,
    "skillId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Assessment" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" "QuestionCategory" NOT NULL,
    "difficulty" "QuestionDifficulty" NOT NULL,
    "totalQuestions" INTEGER NOT NULL,
    "durationMinutes" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Assessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssessmentAttempt" (
    "id" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "studentProfileId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "status" "AssessmentStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "score" INTEGER,
    "percentage" DOUBLE PRECISION,
    "correctAnswers" INTEGER,
    "incorrectAnswers" INTEGER,
    "unanswered" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AssessmentAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssessmentAnswer" (
    "id" TEXT NOT NULL,
    "attemptId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "selectedAnswer" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "answeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AssessmentAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Question_category_idx" ON "Question"("category");

-- CreateIndex
CREATE INDEX "Question_difficulty_idx" ON "Question"("difficulty");

-- CreateIndex
CREATE INDEX "Question_skillId_idx" ON "Question"("skillId");

-- CreateIndex
CREATE INDEX "Assessment_category_idx" ON "Assessment"("category");

-- CreateIndex
CREATE INDEX "Assessment_difficulty_idx" ON "Assessment"("difficulty");

-- CreateIndex
CREATE INDEX "AssessmentAttempt_assessmentId_idx" ON "AssessmentAttempt"("assessmentId");

-- CreateIndex
CREATE INDEX "AssessmentAttempt_studentProfileId_idx" ON "AssessmentAttempt"("studentProfileId");

-- CreateIndex
CREATE INDEX "AssessmentAttempt_status_idx" ON "AssessmentAttempt"("status");

-- CreateIndex
CREATE INDEX "AssessmentAttempt_createdAt_idx" ON "AssessmentAttempt"("createdAt");

-- CreateIndex
CREATE INDEX "AssessmentAnswer_attemptId_idx" ON "AssessmentAnswer"("attemptId");

-- CreateIndex
CREATE INDEX "AssessmentAnswer_questionId_idx" ON "AssessmentAnswer"("questionId");

-- CreateIndex
CREATE INDEX "Resume_targetCareerId_idx" ON "Resume"("targetCareerId");

-- AddForeignKey
ALTER TABLE "Resume" ADD CONSTRAINT "Resume_targetCareerId_fkey" FOREIGN KEY ("targetCareerId") REFERENCES "CareerRole"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentAttempt" ADD CONSTRAINT "AssessmentAttempt_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "Assessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentAttempt" ADD CONSTRAINT "AssessmentAttempt_studentProfileId_fkey" FOREIGN KEY ("studentProfileId") REFERENCES "StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentAnswer" ADD CONSTRAINT "AssessmentAnswer_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "AssessmentAttempt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentAnswer" ADD CONSTRAINT "AssessmentAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;
