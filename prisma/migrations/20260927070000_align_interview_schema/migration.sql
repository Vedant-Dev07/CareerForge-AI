-- Extend the existing session table without replacing legacy session data.
ALTER TABLE "InterviewSession"
ADD COLUMN "difficulty" TEXT NOT NULL DEFAULT 'MEDIUM',
ADD COLUMN "numQuestions" INTEGER NOT NULL DEFAULT 5,
ADD COLUMN "technicalScore" DOUBLE PRECISION,
ADD COLUMN "hrScore" DOUBLE PRECISION,
ADD COLUMN "resumeScore" DOUBLE PRECISION,
ADD COLUMN "communicationScore" DOUBLE PRECISION,
ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE "InterviewSession"
ALTER COLUMN "score" TYPE DOUBLE PRECISION USING "score"::DOUBLE PRECISION,
ALTER COLUMN "updatedAt" DROP DEFAULT;

CREATE TABLE "InterviewQuestion" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "expectedPoints" TEXT,
    "explanation" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "skillId" TEXT,
    "careerRoleId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InterviewQuestion_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "InterviewQuestion_category_idx" ON "InterviewQuestion"("category");
CREATE INDEX "InterviewQuestion_difficulty_idx" ON "InterviewQuestion"("difficulty");
CREATE INDEX "InterviewQuestion_skillId_idx" ON "InterviewQuestion"("skillId");
CREATE INDEX "InterviewQuestion_careerRoleId_idx" ON "InterviewQuestion"("careerRoleId");

ALTER TABLE "InterviewQuestion"
ADD CONSTRAINT "InterviewQuestion_skillId_fkey"
FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE SET NULL ON UPDATE CASCADE,
ADD CONSTRAINT "InterviewQuestion_careerRoleId_fkey"
FOREIGN KEY ("careerRoleId") REFERENCES "CareerRole"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "InterviewAnswer" (
    "id" TEXT NOT NULL,
    "interviewSessionId" TEXT NOT NULL,
    "interviewQuestionId" TEXT,
    "questionText" TEXT NOT NULL,
    "answerText" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InterviewAnswer_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "InterviewAnswer_interviewSessionId_idx" ON "InterviewAnswer"("interviewSessionId");
CREATE INDEX "InterviewAnswer_interviewQuestionId_idx" ON "InterviewAnswer"("interviewQuestionId");

ALTER TABLE "InterviewAnswer"
ADD CONSTRAINT "InterviewAnswer_interviewSessionId_fkey"
FOREIGN KEY ("interviewSessionId") REFERENCES "InterviewSession"("id") ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT "InterviewAnswer_interviewQuestionId_fkey"
FOREIGN KEY ("interviewQuestionId") REFERENCES "InterviewQuestion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Keep the legacy evaluation table intact as an archive; its rows lack the
-- per-dimension scores required by the current evaluation model.
ALTER TABLE "InterviewEvaluation" RENAME TO "_InterviewEvaluationLegacy";
ALTER TABLE "_InterviewEvaluationLegacy"
RENAME CONSTRAINT "InterviewEvaluation_pkey" TO "_InterviewEvaluationLegacy_pkey";
ALTER TABLE "_InterviewEvaluationLegacy"
RENAME CONSTRAINT "InterviewEvaluation_interviewSessionId_fkey" TO "_InterviewEvaluationLegacy_interviewSessionId_fkey";
ALTER INDEX "InterviewEvaluation_interviewSessionId_idx"
RENAME TO "_InterviewEvaluationLegacy_interviewSessionId_idx";

CREATE TABLE "InterviewEvaluation" (
    "id" TEXT NOT NULL,
    "interviewAnswerId" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "relevance" DOUBLE PRECISION NOT NULL,
    "technicalAccuracy" DOUBLE PRECISION NOT NULL,
    "completeness" DOUBLE PRECISION NOT NULL,
    "clarity" DOUBLE PRECISION NOT NULL,
    "professionalism" DOUBLE PRECISION NOT NULL,
    "feedback" TEXT,
    "improvements" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InterviewEvaluation_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "InterviewEvaluation_interviewAnswerId_key"
ON "InterviewEvaluation"("interviewAnswerId");

ALTER TABLE "InterviewEvaluation"
ADD CONSTRAINT "InterviewEvaluation_interviewAnswerId_fkey"
FOREIGN KEY ("interviewAnswerId") REFERENCES "InterviewAnswer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Preserve legacy question/answer text as answer records without fabricating
-- dimensions or AI feedback that were not present in the old data model.
INSERT INTO "InterviewAnswer" ("id", "interviewSessionId", "questionText", "answerText", "createdAt")
SELECT
    'legacy_' || md5(legacy."id"),
    legacy."interviewSessionId",
    legacy."question",
    legacy."answer",
    legacy."createdAt"
FROM "_InterviewEvaluationLegacy" AS legacy;
