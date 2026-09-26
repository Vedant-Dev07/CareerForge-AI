import "server-only";

import { randomInt } from "crypto";
import {
  AssessmentStatus,
  Prisma,
  type QuestionCategory,
  type QuestionDifficulty,
} from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const attemptInclude = {
  assessment: {
    include: {
      questions: {
        orderBy: { position: "asc" },
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
              correctAnswer: true,
              skill: { select: { name: true } },
            },
          },
        },
      },
    },
  },
  answers: true,
} satisfies Prisma.AssessmentAttemptInclude;

export type IncludedAttempt = Prisma.AssessmentAttemptGetPayload<{
  include: typeof attemptInclude;
}>;

export type PublicQuestion = {
  id: string;
  question: string;
  category: QuestionCategory;
  difficulty: QuestionDifficulty;
  options: [string, string, string, string];
  skill: string | null;
  selectedAnswer: string | null;
};

export type AttemptResult = {
  attemptId: string;
  title: string;
  category: QuestionCategory;
  difficulty: QuestionDifficulty;
  questionCount: number;
  durationMinutes: number;
  startedAt: string;
  expiresAt: string;
  completedAt: string;
  timeTakenSeconds: number;
  status: AssessmentStatus;
  score: number;
  percentage: number;
  attempted: number;
  correct: number;
  incorrect: number;
  unanswered: number;
  accuracy: number;
};

export function getExpiresAt(attempt: {
  startedAt: Date;
  assessment: { durationMinutes: number };
}) {
  return new Date(
    attempt.startedAt.getTime() + attempt.assessment.durationMinutes * 60_000,
  );
}

export async function findOwnedAttempt(
  client: typeof prisma | Prisma.TransactionClient,
  attemptId: string,
  studentProfileId: string,
) {
  return client.assessmentAttempt.findFirst({
    where: { id: attemptId, studentProfileId },
    include: attemptInclude,
  });
}

export function toPublicQuestion(
  question: IncludedAttempt["assessment"]["questions"][number]["question"],
  selectedAnswer: string | null,
): PublicQuestion {
  return {
    id: question.id,
    question: question.question,
    category: question.category,
    difficulty: question.difficulty,
    options: [
      question.optionA,
      question.optionB,
      question.optionC,
      question.optionD,
    ],
    skill: question.skill?.name ?? null,
    selectedAnswer,
  };
}

export function toAttemptSession(
  attempt: IncludedAttempt,
  serverNow = new Date(),
) {
  const answerByQuestion = new Map(
    attempt.answers.map((answer) => [answer.questionId, answer.selectedAnswer]),
  );

  return {
    attemptId: attempt.id,
    title: attempt.assessment.title,
    category: attempt.assessment.category,
    difficulty: attempt.assessment.difficulty,
    questionCount: attempt.assessment.totalQuestions,
    durationMinutes: attempt.assessment.durationMinutes,
    startedAt: attempt.startedAt.toISOString(),
    expiresAt: getExpiresAt(attempt).toISOString(),
    serverNow: serverNow.toISOString(),
    questions: attempt.assessment.questions.map(({ question }) =>
      toPublicQuestion(
        question,
        answerByQuestion.get(question.id) ?? null,
      ),
    ),
  };
}

export function toAttemptResult(attempt: IncludedAttempt): AttemptResult {
  const total = attempt.assessment.totalQuestions;
  const correct = attempt.correctAnswers ?? 0;
  const incorrect = attempt.incorrectAnswers ?? 0;
  const unanswered = attempt.unanswered ?? total;
  const attempted = correct + incorrect;
  const completedAt = attempt.completedAt ?? attempt.startedAt;
  const accuracy = attempted > 0 ? (correct / attempted) * 100 : 0;

  return {
    attemptId: attempt.id,
    title: attempt.assessment.title,
    category: attempt.assessment.category,
    difficulty: attempt.assessment.difficulty,
    questionCount: total,
    durationMinutes: attempt.assessment.durationMinutes,
    startedAt: attempt.startedAt.toISOString(),
    expiresAt: getExpiresAt(attempt).toISOString(),
    completedAt: completedAt.toISOString(),
    timeTakenSeconds: Math.max(
      0,
      Math.floor((completedAt.getTime() - attempt.startedAt.getTime()) / 1000),
    ),
    status: attempt.status,
    score: attempt.score ?? 0,
    percentage: attempt.percentage ?? 0,
    attempted,
    correct,
    incorrect,
    unanswered,
    accuracy: Math.round(accuracy * 100) / 100,
  };
}

export async function lockOwnedAttempt(
  tx: Prisma.TransactionClient,
  attemptId: string,
  studentProfileId: string,
) {
  await tx.$queryRaw`
    SELECT "id"
    FROM "AssessmentAttempt"
    WHERE "id" = ${attemptId}
      AND "studentProfileId" = ${studentProfileId}
    FOR UPDATE
  `;

  return findOwnedAttempt(tx, attemptId, studentProfileId);
}

export async function finalizeLockedAttempt(
  tx: Prisma.TransactionClient,
  attempt: IncludedAttempt,
  now: Date,
) {
  if (attempt.status !== AssessmentStatus.IN_PROGRESS) {
    return attempt;
  }

  const questionIds = new Set(
    attempt.assessment.questions.map(({ question }) => question.id),
  );
  const answersByQuestion = new Map(
    attempt.answers
      .filter((answer) => questionIds.has(answer.questionId))
      .map((answer) => [answer.questionId, answer]),
  );
  let correct = 0;

  for (const { question } of attempt.assessment.questions) {
    const answer = answersByQuestion.get(question.id);
    if (!answer) continue;
    const isCorrect = answer.selectedAnswer === question.correctAnswer;
    if (isCorrect) correct += 1;
    await tx.assessmentAnswer.update({
      where: { id: answer.id },
      data: { isCorrect },
    });
  }

  const total = attempt.assessment.totalQuestions;
  const attempted = answersByQuestion.size;
  const incorrect = attempted - correct;
  const unanswered = Math.max(0, total - attempted);
  const percentage = total > 0 ? (correct / total) * 100 : 0;
  const expiresAt = getExpiresAt(attempt);
  const expired = now >= expiresAt;
  const completedAt = expired ? expiresAt : now;

  const updated = await tx.assessmentAttempt.update({
    where: { id: attempt.id },
    data: {
      status: expired ? AssessmentStatus.EXPIRED : AssessmentStatus.COMPLETED,
      completedAt,
      score: Math.round(percentage),
      percentage,
      correctAnswers: correct,
      incorrectAnswers: incorrect,
      unanswered,
    },
    include: attemptInclude,
  });

  return updated;
}

export function shuffle<T>(items: T[]) {
  for (let index = items.length - 1; index > 0; index -= 1) {
    const swapIndex = randomInt(index + 1);
    [items[index], items[swapIndex]] = [items[swapIndex], items[index]];
  }
  return items;
}
