import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || !user.studentProfileId) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  try {
    // Get the most recent in-progress attempt
    const attempt = await prisma.assessmentAttempt.findFirst({
      where: {
        studentProfileId: user.studentProfileId,
        status: 'IN_PROGRESS',
      },
      include: {
        assessment: {
          include: {
            questions: {
              include: {
                question: {
                  select: {
                    id: true,
                    question: true,
                    category: true,
                    difficulty: true,
                    optionA: true,
                    optionB: true,
                    optionC: true,
                    optionD: true,
                    skill: {
                      select: {
                        name: true,
                      },
                    },
                  },
                },
              },
              orderBy: {
                position: 'asc',
              },
            },
          },
        },
        answers: {
          include: {
            question: {
              select: {
                id: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!attempt) {
      return NextResponse.json({ attempt: null });
    }

    // Check if time has expired
    const startedAt = new Date(attempt.startedAt);
    const durationMs = attempt.assessment.durationMinutes * 60 * 1000;
    const elapsedMs = Date.now() - startedAt.getTime();
    const remainingMs = Math.max(0, durationMs - elapsedMs);

    if (remainingMs <= 0) {
      // Auto-submit expired assessment
      await submitExpiredAssessment(attempt);
      return NextResponse.json({ 
        attempt: null,
        expiredAttemptId: attempt.id,
      });
    }

    // Create a map of answers by questionId
    const answerMap = new Map(
      attempt.answers.map(a => [a.questionId, a.selectedAnswer])
    );

    // Format the session data
    const session = {
      attemptId: attempt.id,
      title: attempt.assessment.title,
      category: attempt.assessment.category,
      difficulty: attempt.assessment.difficulty,
      questionCount: attempt.assessment.totalQuestions,
      durationMinutes: attempt.assessment.durationMinutes,
      startedAt: attempt.startedAt.toISOString(),
      expiresAt: new Date(startedAt.getTime() + durationMs).toISOString(),
      serverNow: new Date().toISOString(),
      questions: attempt.assessment.questions.map((aq) => {
        const question = aq.question;
        const savedAnswer = answerMap.get(question.id);
        
        return {
          id: question.id,
          question: question.question,
          category: question.category,
          difficulty: question.difficulty,
          options: [question.optionA, question.optionB, question.optionC, question.optionD],
          skill: question.skill?.name || null,
          selectedAnswer: savedAnswer || null,
        };
      }),
    };

    return NextResponse.json({ attempt: session });
  } catch (error) {
    console.error("Error retrieving active attempt:", error);
    return NextResponse.json({ error: "Failed to retrieve active attempt." }, { status: 500 });
  }
}

async function submitExpiredAssessment(attempt: any) {
  try {
    // Get all questions in the assessment
    const assessmentQuestions = await prisma.assessmentQuestion.findMany({
      where: { assessmentId: attempt.assessmentId },
      include: {
        question: true,
      },
    });

    // Get user's answers
    const userAnswers = await prisma.assessmentAnswer.findMany({
      where: { attemptId: attempt.id },
    });

    const answerMap = new Map(
      userAnswers.map(a => [a.questionId, a.selectedAnswer])
    );

    let correctCount = 0;
    let incorrectCount = 0;
    let unansweredCount = 0;

    // Calculate score
    for (const aq of assessmentQuestions) {
      const userAnswer = answerMap.get(aq.questionId);
      if (!userAnswer) {
        unansweredCount++;
      } else if (userAnswer === aq.question.correctAnswer) {
        correctCount++;
        await prisma.assessmentAnswer.updateMany({
          where: {
            attemptId: attempt.id,
            questionId: aq.questionId,
          },
          data: { isCorrect: true },
        });
      } else {
        incorrectCount++;
        await prisma.assessmentAnswer.updateMany({
          where: {
            attemptId: attempt.id,
            questionId: aq.questionId,
          },
          data: { isCorrect: false },
        });
      }
    }

    const totalQuestions = assessmentQuestions.length;
    const percentage = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;
    const score = Math.round(percentage);

    // Update attempt
    await prisma.assessmentAttempt.update({
      where: { id: attempt.id },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
        score,
        percentage,
        correctAnswers: correctCount,
        incorrectAnswers: incorrectCount,
        unanswered: unansweredCount,
      },
    });
  } catch (error) {
    console.error("Error auto-submitting assessment:", error);
  }
}