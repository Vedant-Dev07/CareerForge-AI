import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { Prisma, QuestionCategory, QuestionDifficulty } from "@prisma/client";

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const categoryValue = searchParams.get("category");
  const difficultyValue = searchParams.get("difficulty");
  const limitValue = searchParams.get("limit") ?? "10";
  const limit = /^\d+$/.test(limitValue) ? Number(limitValue) : Number.NaN;

  if (isNaN(limit) || limit < 1 || limit > 100) {
    return NextResponse.json({ error: "Limit must be between 1 and 100." }, { status: 400 });
  }
  if (
    categoryValue &&
    !Object.values(QuestionCategory).includes(categoryValue as QuestionCategory)
  ) {
    return NextResponse.json({ error: "Invalid question category." }, { status: 400 });
  }
  if (
    difficultyValue &&
    !Object.values(QuestionDifficulty).includes(difficultyValue as QuestionDifficulty)
  ) {
    return NextResponse.json({ error: "Invalid question difficulty." }, { status: 400 });
  }

  const where: Prisma.QuestionWhereInput = {
    ...(categoryValue ? { category: categoryValue as QuestionCategory } : {}),
    ...(difficultyValue ? { difficulty: difficultyValue as QuestionDifficulty } : {}),
  };

  try {
    const questions = await prisma.question.findMany({
      where,
      take: limit,
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
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      questions: questions.map((q) => ({
        id: q.id,
        question: q.question,
        options: [q.optionA, q.optionB, q.optionC, q.optionD],
        category: q.category,
        difficulty: q.difficulty,
        skill: q.skill?.name || null,
      })),
    });
  } catch (error) {
    console.error("Error fetching questions:", error);
    return NextResponse.json({ error: "Failed to fetch questions." }, { status: 500 });
  }
}