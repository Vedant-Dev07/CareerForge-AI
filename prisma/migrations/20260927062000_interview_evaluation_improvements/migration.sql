ALTER TABLE "InterviewEvaluation"
ADD COLUMN "improvements" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
