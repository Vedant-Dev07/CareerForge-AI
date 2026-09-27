import "server-only";

import { calculateReadiness } from "@/lib/readiness";
import { prisma } from "@/lib/prisma";
import type { MentorAction, MentorContext } from "@/lib/mentor/types";

const priorityOrder: Record<string, number> = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };

export async function buildMentorContext(studentProfileId: string): Promise<MentorContext> {
  const [profile, readiness] = await Promise.all([
    prisma.studentProfile.findUnique({
      where: { id: studentProfileId },
      select: {
        careerGoal: true,
        targetDomain: true,
        targetCareer: { select: { title: true } },
        careerAnalyses: { orderBy: { createdAt: "desc" }, take: 1, select: { matchPercentage: true, missingSkills: true } },
        resumes: { where: { status: "ANALYZED" }, orderBy: { createdAt: "desc" }, take: 1, select: { analysis: { select: { atsScore: true, missingSkills: true, recommendations: true } } } },
        assessmentAttempts: { where: { status: "COMPLETED" }, orderBy: { completedAt: "desc" }, take: 1, select: { percentage: true } },
        aptitudeAttempts: { orderBy: { createdAt: "desc" }, take: 1, select: { accuracy: true, score: true } },
        skillPerformances: { orderBy: { accuracy: "asc" }, take: 5, select: { accuracy: true, classification: true, skill: { select: { name: true } } } },
        learningRoadmaps: { orderBy: { updatedAt: "desc" }, take: 1, select: { progress: true, tasks: { select: { id: true, title: true, priority: true, source: true, status: true } } } },
        projectRecommendations: { orderBy: { relevanceScore: "desc" }, take: 8, select: { id: true, status: true, project: { select: { title: true } } } },
        interviewSessions: { where: { status: "COMPLETED", score: { not: null } }, select: { score: true, answers: { select: { evaluation: { select: { relevance: true, technicalAccuracy: true, completeness: true, clarity: true, professionalism: true } } } } } },
      },
    }),
    calculateReadiness(studentProfileId),
  ]);

  if (!profile) throw new Error("Student profile not found.");
  const analysis = profile.careerAnalyses[0];
  const resume = profile.resumes[0]?.analysis;
  const roadmap = profile.learningRoadmaps[0];
  const weakSkills = profile.skillPerformances
    .filter((item) => ["CRITICAL", "WEAK", "DEVELOPING"].includes(item.classification))
    .map((item) => ({ name: item.skill.name, accuracy: Math.round(item.accuracy), classification: item.classification }));
  const priorityTasks = (roadmap?.tasks ?? [])
    .filter((task) => task.status !== "COMPLETED")
    .sort((left, right) => (priorityOrder[left.priority] ?? 9) - (priorityOrder[right.priority] ?? 9))
    .slice(0, 4);
  const completedInterviews = profile.interviewSessions;
  const averageScore = completedInterviews.length
    ? Math.round(completedInterviews.reduce((total, interview) => total + (interview.score ?? 0), 0) / completedInterviews.length)
    : null;
  const evaluations = completedInterviews.flatMap((interview) => interview.answers.map((answer) => answer.evaluation).filter(Boolean));
  const dimensions = ["relevance", "technicalAccuracy", "completeness", "clarity", "professionalism"] as const;
  const weakestDimension = evaluations.length
    ? dimensions.reduce((weakest, dimension) => {
        const average = evaluations.reduce((total, evaluation) => total + (evaluation?.[dimension] ?? 0), 0) / evaluations.length;
        const weakestAverage = evaluations.reduce((total, evaluation) => total + (evaluation?.[weakest] ?? 0), 0) / evaluations.length;
        return average < weakestAverage ? dimension : weakest;
      })
    : null;
  const actionCandidates: MentorAction[] = [
    ...priorityTasks.map((task) => ({ type: "ROADMAP_TASK" as const, id: task.id, label: `Complete ${task.title}`, href: "/dashboard/roadmap" })),
    ...profile.projectRecommendations.filter((recommendation) => recommendation.status !== "COMPLETED").slice(0, 3).map((recommendation) => ({ type: "PROJECT" as const, id: recommendation.id, label: `Work on ${recommendation.project.title}`, href: "/dashboard/projects" })),
    ...readiness.recommendations.map((recommendation) => ({ type: "READINESS" as const, id: recommendation.id, label: recommendation.title, href: recommendation.href })),
  ];

  return {
    career: { title: profile.targetCareer?.title ?? profile.targetDomain ?? null, goal: profile.careerGoal, matchPercentage: analysis?.matchPercentage ?? null, missingSkills: analysis?.missingSkills ?? [] },
    resume: { atsScore: resume?.atsScore ?? null, missingSkills: resume?.missingSkills ?? [], recommendations: resume?.recommendations.slice(0, 3) ?? [] },
    aptitude: { latestScore: profile.assessmentAttempts[0]?.percentage ?? profile.aptitudeAttempts[0]?.accuracy ?? profile.aptitudeAttempts[0]?.score ?? null, weakSkills },
    roadmap: { progress: roadmap?.progress ?? null, priorityTasks: priorityTasks.map(({ title, priority, source }) => ({ title, priority, source })) },
    projects: { recommended: profile.projectRecommendations.filter((recommendation) => recommendation.status !== "COMPLETED").map((recommendation) => recommendation.project.title), completed: profile.projectRecommendations.filter((recommendation) => recommendation.status === "COMPLETED").map((recommendation) => recommendation.project.title) },
    interview: { completedCount: completedInterviews.length, averageScore, weakestDimension },
    readiness: { overallScore: readiness.overallScore, weakSkillCount: readiness.weakSkillCount, recommendations: readiness.recommendations.map(({ title, detail }) => ({ title, detail })) },
    actionCandidates,
  };
}
