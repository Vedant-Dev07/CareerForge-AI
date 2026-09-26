-- Add unique constraint to AssessmentAnswer to prevent duplicate answers
-- This ensures one answer per question per attempt

ALTER TABLE "AssessmentAnswer" 
ADD CONSTRAINT "AssessmentAnswer_attemptId_questionId_key" 
UNIQUE ("attemptId", "questionId");