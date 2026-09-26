import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { QuestionCategory, QuestionDifficulty } from "@prisma/client";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || !user.studentProfileId) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { category, difficulty, questionCount, durationMinutes } = body;

    // Validate inputs
    const count = questionCount && typeof questionCount === 'number' ? questionCount : 10;
    const duration = durationMinutes && typeof durationMinutes === 'number' ? durationMinutes : 30;

    if (count < 1 || count > 50) {
      return NextResponse.json({ error: "Question count must be between 1 and 50." }, { status: 400 });
    }

    if (duration < 5 || duration > 180) {
      return NextResponse.json({ error: "Duration must be between 5 and 180 minutes." }, { status: 400 });
    }

    // Build where clause for question selection
    const where: any = {};
    if (category && Object.values(QuestionCategory).includes(category as QuestionCategory)) {
      where.category = category as QuestionCategory;
    }
    if (difficulty && Object.values(QuestionDifficulty).includes(difficulty as QuestionDifficulty)) {
      where.difficulty = difficulty as QuestionDifficulty;
    }

    // Select questions
    const questions = await prisma.question.findMany({
      where,
      take: count,
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
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (questions.length === 0) {
      return NextResponse.json({ error: "No questions found matching the criteria." }, { status: 404 });
    }

    // Determine assessment title
    const categoryText = category || 'Mixed';
    const difficultyText = difficulty || 'Mixed';
    const title = `${categoryText} Aptitude Test (${difficultyText})`;

    // Create assessment
    const assessment = await prisma.assessment.create({
      data: {
        title,
        category: (category || 'TECHNICAL') as QuestionCategory,
        difficulty: (difficulty || 'MEDIUM') as QuestionDifficulty,
        totalQuestions: questions.length,
        durationMinutes: duration,
        questions: {
          create: questions.map((q, index) => ({
            questionId: q.id,
            position: index + 1,
          })),
        },
      },
    });

    // Create assessment attempt for the student
    const attempt = await prisma.assessmentAttempt.create({
      data: {
        assessmentId: assessment.id,
        studentProfileId: user.studentProfileId,
        status: 'IN_PROGRESS',
      },
    });

    // Return safe question data
    const safeQuestions = questions.map((q) => ({
      id: q.id,
      question: q.question,
      options: [q.optionA, q.optionB, q.optionC, q.optionD],
      category: q.category,
      difficulty: q.difficulty,
      skill: q.skill?.name || null,
    }));

    return NextResponse.json({
      assessment: {
        id: assessment.id,
        title: assessment.title,
        category: assessment.category,
        difficulty: assessment.difficulty,
        totalQuestions: assessment.totalQuestions,
        durationMinutes: assessment.durationMinutes,
      },
      attempt: {
        id: attempt.id,
        status: attempt.status,
        startedAt: attempt.startedAt,
      },
      questions: safeQuestions,
    });
  } catch (error) {
    console.error("Error creating assessment:", error);
    return NextResponse.json({ error: "Failed to create assessment." }, { status: 500 });
  }
}