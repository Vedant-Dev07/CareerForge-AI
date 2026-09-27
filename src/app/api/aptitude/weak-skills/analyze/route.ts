import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-server";

// Utility to calculate classification
function getClassification(accuracy: number): string {
  if (accuracy >= 80) return "STRONG";
  if (accuracy >= 60) return "DEVELOPING";
  if (accuracy >= 40) return "WEAK";
  return "CRITICAL";
}

// Utility to calculate priority
function getPriority(accuracy: number, careerRelevance: string = "MEDIUM"): string {
  if (careerRelevance === "HIGH" && accuracy < 60) return "CRITICAL";
  if (accuracy < 40) return "CRITICAL";
  if (accuracy < 60) return "HIGH";
  if (accuracy < 70) return "MEDIUM";
  if (accuracy < 80) return "LOW";
  return "NONE";
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.studentProfileId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const studentProfileId = user.studentProfileId;

    const { attemptId } = await req.json();
    if (!attemptId) {
      return NextResponse.json({ error: "attemptId is required" }, { status: 400 });
    }

    // Fetch the assessment attempt
    const attempt = await prisma.assessmentAttempt.findUnique({
      where: { id: attemptId },
      include: {
        answers: {
          include: {
            question: {
              include: {
                skill: true
              }
            }
          }
        },
        studentProfile: {
          include: {
            targetCareer: true
          }
        }
      }
    });

    if (!attempt) {
      return NextResponse.json({ error: "Assessment attempt not found" }, { status: 404 });
    }

    if (attempt.studentProfileId !== studentProfileId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (attempt.status !== "COMPLETED") {
      return NextResponse.json({ error: "Assessment is not completed" }, { status: 400 });
    }

    // Group answers by skill
    const skillStats: Record<string, { total: number, attempted: number, correct: number }> = {};

    for (const answer of attempt.answers) {
      const skillId = answer.question.skillId;
      if (!skillId) continue; // Skip questions without a mapped skill

      if (!skillStats[skillId]) {
        skillStats[skillId] = { total: 0, attempted: 0, correct: 0 };
      }

      skillStats[skillId].total += 1;
      skillStats[skillId].attempted += 1; // Since it's in answers, it was attempted
      if (answer.isCorrect) {
        skillStats[skillId].correct += 1;
      }
    }

    // Process each skill
    const results = [];
    const targetCareer = attempt.studentProfile.targetCareer;
    
    for (const skillId of Object.keys(skillStats)) {
      const stats = skillStats[skillId];
      const incorrect = stats.attempted - stats.correct;
      const accuracy = (stats.correct / stats.attempted) * 100;
      
      const classification = getClassification(accuracy);
      
      // Check career relevance
      let careerRelevance = "LOW";
      if (targetCareer && targetCareer.requiredSkills.includes(skillId)) {
        careerRelevance = "HIGH";
      }
      
      const priority = getPriority(accuracy, careerRelevance);

      // Upsert SkillPerformance
      const performance = await prisma.skillPerformance.upsert({
        where: {
          studentProfileId_skillId: {
            studentProfileId,
            skillId: skillId,
          }
        },
        update: {
          totalQuestions: stats.total,
          attemptedQuestions: stats.attempted,
          correctAnswers: stats.correct,
          incorrectAnswers: incorrect,
          accuracy: accuracy,
          classification: classification,
          priority: priority,
          assessmentCount: { increment: 1 },
          lastAssessedAt: new Date()
        },
        create: {
          studentProfileId,
          skillId: skillId,
          totalQuestions: stats.total,
          attemptedQuestions: stats.attempted,
          correctAnswers: stats.correct,
          incorrectAnswers: incorrect,
          accuracy: accuracy,
          classification: classification,
          priority: priority,
          assessmentCount: 1,
        }
      });
      
      results.push(performance);
    }

    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error("Error analyzing weak skills:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
