import "server-only";

import { prisma } from "@/lib/prisma";

const READINESS_WEIGHTS = {
  career: 15,
  skills: 20,
  resume: 15,
  aptitude: 15,
  interview: 15,
  learning: 20,
} as const;

type MetricKey = keyof typeof READINESS_WEIGHTS;

export type ReadinessMetric = {
  score: number;
  available: boolean;
  explanation: string;
};

export type ReadinessRecommendation = {
  id: string;
  title: string;
  detail: string;
  href: string;
};

export type ReadinessProfile = {
  overallScore: number;
  metrics: Record<MetricKey, ReadinessMetric>;
  weakSkillCount: number;
  recommendations: ReadinessRecommendation[];
  computedAt: string;
};

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function unavailable(explanation: string): ReadinessMetric {
  return { score: 0, available: false, explanation };
}

function startOfToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

export async function calculateReadiness(studentProfileId: string): Promise<ReadinessProfile> {
  const [careerAnalysis, resume, assessment, legacyAptitudeAttempt, skillPerformances, roadmap, interviewSessions] =
    await Promise.all([
      prisma.careerAnalysis.findFirst({
        where: { studentProfileId },
        orderBy: { createdAt: "desc" },
        select: { matchPercentage: true, matchedSkills: true, missingSkills: true, careerRole: { select: { title: true } } },
      }),
      prisma.resume.findFirst({
        where: { studentProfileId },
        orderBy: { createdAt: "desc" },
        select: { analysis: { select: { atsScore: true } } },
      }),
      prisma.assessmentAttempt.findFirst({
        where: { studentProfileId, status: "COMPLETED" },
        orderBy: { completedAt: "desc" },
        select: { percentage: true },
      }),
      prisma.aptitudeAttempt.findFirst({
        where: { studentProfileId },
        orderBy: { createdAt: "desc" },
        select: { score: true, accuracy: true },
      }),
      prisma.skillPerformance.findMany({
        where: { studentProfileId },
        select: { accuracy: true, classification: true },
      }),
      prisma.learningRoadmap.findFirst({
        where: { studentProfileId },
        orderBy: { updatedAt: "desc" },
        select: { progress: true, tasks: { select: { status: true } } },
      }),
      prisma.interviewSession.findMany({
        where: { studentProfileId, status: "COMPLETED", score: { not: null } },
        select: { score: true },
      }),
    ]);

  const career = careerAnalysis
    ? {
        score: clampScore(careerAnalysis.matchPercentage),
        available: true,
        explanation: `${careerAnalysis.matchPercentage}% match for ${careerAnalysis.careerRole.title}.`,
      }
    : unavailable("Run a career analysis to measure role alignment.");

  const skillCoverage = careerAnalysis
    ? (careerAnalysis.matchedSkills.length / Math.max(1, careerAnalysis.matchedSkills.length + careerAnalysis.missingSkills.length)) * 100
    : null;
  const skills = skillPerformances.length
    ? {
        score: clampScore(skillPerformances.reduce((total, skill) => total + skill.accuracy, 0) / skillPerformances.length),
        available: true,
        explanation: `Average accuracy across ${skillPerformances.length} assessed skill${skillPerformances.length === 1 ? "" : "s"}.`,
      }
    : skillCoverage !== null
      ? {
          score: clampScore(skillCoverage),
          available: true,
          explanation: `${careerAnalysis?.matchedSkills.length ?? 0} matched and ${careerAnalysis?.missingSkills.length ?? 0} missing career skills.`,
        }
      : unavailable("Complete an assessment or career analysis to measure technical skills.");

  const resumeScore = resume?.analysis?.atsScore;
  const resumeMetric = typeof resumeScore === "number"
    ? { score: clampScore(resumeScore), available: true, explanation: `Latest ATS analysis scored ${clampScore(resumeScore)}%.` }
    : unavailable("Upload and analyze a resume to measure ATS readiness.");

  const aptitudeSource = assessment?.percentage ?? legacyAptitudeAttempt?.accuracy ?? legacyAptitudeAttempt?.score;
  const aptitude = typeof aptitudeSource === "number"
    ? { score: clampScore(aptitudeSource), available: true, explanation: "Based on the latest completed aptitude attempt." }
    : unavailable("Complete an aptitude assessment to measure problem-solving performance.");

  const completedTasks = roadmap?.tasks.filter((task) => task.status === "COMPLETED").length ?? 0;
  const roadmapScore = roadmap
    ? roadmap.tasks.length
      ? (completedTasks / roadmap.tasks.length) * 100
      : roadmap.progress
    : null;
  const learning = roadmapScore !== null
    ? {
        score: clampScore(roadmapScore),
        available: true,
        explanation: roadmap?.tasks.length
          ? `${completedTasks} of ${roadmap.tasks.length} roadmap tasks completed.`
          : `Roadmap progress is ${clampScore(roadmapScore)}%.`,
      }
    : unavailable("Generate a learning roadmap to track completion.");

  const scoredInterviews = interviewSessions.map((session) => session.score).filter((score): score is number => score !== null);
  const interview = scoredInterviews.length
    ? {
        score: clampScore(scoredInterviews.reduce((total, score) => total + score, 0) / scoredInterviews.length),
        available: true,
        explanation: `Average score across ${scoredInterviews.length} completed mock interview${scoredInterviews.length === 1 ? "" : "s"}.`,
      }
    : unavailable("Complete a mock interview to measure interview performance.");

  const metrics = { career, skills, resume: resumeMetric, aptitude, interview, learning };
  const overallScore = clampScore(
    (Object.keys(READINESS_WEIGHTS) as MetricKey[]).reduce(
      (total, key) => total + metrics[key].score * (READINESS_WEIGHTS[key] / 100),
      0
    )
  );
  const weakSkillCount = skillPerformances.filter((skill) => ["CRITICAL", "WEAK"].includes(skill.classification)).length;
  const recommendations: ReadinessRecommendation[] = [];

  if (!resumeMetric.available || resumeMetric.score < 70) {
    recommendations.push({ id: "resume", title: "Improve resume ATS coverage", detail: resumeMetric.available ? `ATS score is ${resumeMetric.score}%; target 70% or higher.` : resumeMetric.explanation, href: "/dashboard/resume" });
  }
  if (!aptitude.available || aptitude.score < 65) {
    recommendations.push({ id: "aptitude", title: "Practice aptitude questions", detail: aptitude.available ? `Latest aptitude score is ${aptitude.score}%; target 65% or higher.` : aptitude.explanation, href: "/dashboard/aptitude" });
  }
  if (weakSkillCount > 0 || (!skills.available || skills.score < 65)) {
    recommendations.push({ id: "skills", title: "Close technical skill gaps", detail: weakSkillCount ? `${weakSkillCount} skill${weakSkillCount === 1 ? " is" : "s are"} marked weak or critical.` : skills.explanation, href: "/dashboard/skills" });
  }
  if (!learning.available || learning.score < 100) {
    recommendations.push({ id: "roadmap", title: "Complete learning roadmap tasks", detail: learning.explanation, href: "/dashboard/roadmap" });
  }
  if (!interview.available || interview.score < 70) {
    recommendations.push({ id: "interview", title: "Practice a mock interview", detail: interview.available ? `Interview score is ${interview.score}%; target 70% or higher.` : interview.explanation, href: "/dashboard/interview" });
  }
  if (careerAnalysis && careerAnalysis.missingSkills.length > 0) {
    recommendations.push({ id: "career", title: "Address target-role skill gaps", detail: `${careerAnalysis.missingSkills.length} skills are still missing for ${careerAnalysis.careerRole.title}.`, href: "/dashboard/career" });
  }

  return { overallScore, metrics, weakSkillCount, recommendations: recommendations.slice(0, 5), computedAt: new Date().toISOString() };
}

export async function storeDailyReadinessSnapshot(studentProfileId: string, readiness: ReadinessProfile) {
  const today = startOfToday();
  const existing = await prisma.readinessScore.findFirst({
    where: { studentProfileId, createdAt: { gte: today } },
    orderBy: { createdAt: "desc" },
  });
  if (existing) return existing;

  return prisma.readinessScore.create({
    data: {
      studentProfileId,
      overallScore: readiness.overallScore,
      careerScore: readiness.metrics.career.score,
      skillScore: readiness.metrics.skills.score,
      resumeScore: readiness.metrics.resume.score,
      aptitudeScore: readiness.metrics.aptitude.score,
      interviewScore: readiness.metrics.interview.score,
      projectScore: readiness.metrics.learning.score,
      roadmapProgress: readiness.metrics.learning.score,
      weakSkillCount: readiness.weakSkillCount,
    },
  });
}
