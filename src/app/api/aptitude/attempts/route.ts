import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || !user.studentProfileId) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  try {
    // Get all attempts for the student
    const attempts = await prisma.assessmentAttempt.findMany({
      where: {
        studentProfileId: user.studentProfileId,
      },
      include: {
        assessment: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    });

    return NextResponse.json({
      attempts: attempts.map((attempt) => ({
        attemptId: attempt.id,
        title: attempt.assessment.title,
        category: attempt.assessment.category,
        difficulty: attempt.assessment.difficulty,
        questionCount: attempt.assessment.totalQuestions,
        durationMinutes: attempt.assessment.durationMinutes,
        startedAt: attempt.startedAt,
        completedAt: attempt.completedAt,
        status: attempt.status,
        score: attempt.score,
        percentage: attempt.percentage,
      })),
    });
  } catch (error) {
    console.error("Error retrieving attempts:", error);
    return NextResponse.json({ error: "Failed to retrieve attempts." }, { status: 500 });
  }
}