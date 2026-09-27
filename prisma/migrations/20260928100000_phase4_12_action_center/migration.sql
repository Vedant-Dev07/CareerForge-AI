CREATE TABLE "CareerAction" (
    "id" TEXT NOT NULL,
    "studentProfileId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "sourceId" TEXT,
    "actionUrl" TEXT,
    "estimatedMinutes" INTEGER,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "CareerAction_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "CareerAction_studentProfileId_source_key" ON "CareerAction"("studentProfileId", "source");
CREATE INDEX "CareerAction_studentProfileId_idx" ON "CareerAction"("studentProfileId");
CREATE INDEX "CareerAction_studentProfileId_completed_idx" ON "CareerAction"("studentProfileId", "completed");

ALTER TABLE "CareerAction" ADD CONSTRAINT "CareerAction_studentProfileId_fkey" FOREIGN KEY ("studentProfileId") REFERENCES "StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
