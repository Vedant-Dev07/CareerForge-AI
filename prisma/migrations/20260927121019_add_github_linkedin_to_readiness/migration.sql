-- AlterTable
ALTER TABLE "ReadinessScore" ADD COLUMN     "githubScore" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "linkedinScore" INTEGER NOT NULL DEFAULT 0;
