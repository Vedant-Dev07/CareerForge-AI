CREATE TABLE "AssessmentQuestion" (
    "assessmentId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "AssessmentQuestion_pkey" PRIMARY KEY ("assessmentId", "questionId")
);

CREATE UNIQUE INDEX "AssessmentQuestion_assessmentId_position_key"
ON "AssessmentQuestion"("assessmentId", "position");

CREATE INDEX "AssessmentQuestion_questionId_idx"
ON "AssessmentQuestion"("questionId");

ALTER TABLE "AssessmentQuestion"
ADD CONSTRAINT "AssessmentQuestion_assessmentId_fkey"
FOREIGN KEY ("assessmentId") REFERENCES "Assessment"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "AssessmentQuestion"
ADD CONSTRAINT "AssessmentQuestion_questionId_fkey"
FOREIGN KEY ("questionId") REFERENCES "Question"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
