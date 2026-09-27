import "server-only";

import { prisma } from "@/lib/prisma";

const RECOMMENDATION_STATUSES = ["RECOMMENDED", "IN_PROGRESS", "COMPLETED"] as const;

export type ProjectRecommendationStatus = (typeof RECOMMENDATION_STATUSES)[number];

type ProjectEvidence = {
  careerGaps: Set<string>;
  aptitudeGaps: Set<string>;
  resumeGaps: Set<string>;
  roadmapProjectSkills: Set<string>;
  knownSkills: Set<string>;
  targetCareerId: string | null;
};

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function overlap(requiredSkills: string[], evidence: Set<string>) {
  return requiredSkills.filter((skill) => evidence.has(normalize(skill)));
}

function difficultySuitability(difficulty: string, knownRatio: number) {
  const ideal = knownRatio < 0.35 ? "EASY" : knownRatio < 0.7 ? "MEDIUM" : "HARD";
  return difficulty === ideal ? 5 : 2;
}

function buildReason(project: { title: string; requiredSkills: string[]; careerRole: { title: string } | null }, evidence: ProjectEvidence) {
  const covered = [
    ...overlap(project.requiredSkills, evidence.careerGaps),
    ...overlap(project.requiredSkills, evidence.aptitudeGaps),
    ...overlap(project.requiredSkills, evidence.resumeGaps),
  ];
  const skills = [...new Set(covered)];
  const sourceLabels = [
    overlap(project.requiredSkills, evidence.careerGaps).length ? "career analysis" : null,
    overlap(project.requiredSkills, evidence.aptitudeGaps).length ? "aptitude performance" : null,
    overlap(project.requiredSkills, evidence.resumeGaps).length ? "resume analysis" : null,
    overlap(project.requiredSkills, evidence.roadmapProjectSkills).length ? "roadmap project tasks" : null,
  ].filter(Boolean);

  if (skills.length) {
    return `Recommended for ${project.careerRole?.title ?? "your target path"} because it addresses ${skills.join(", ")} gaps identified from ${sourceLabels.join(", ")}.`;
  }
  return `Recommended for ${project.careerRole?.title ?? "your target path"} because its technologies and scope align with your current placement preparation.`;
}

async function loadEvidence(studentProfileId: string): Promise<ProjectEvidence> {
  const profile = await prisma.studentProfile.findUnique({
    where: { id: studentProfileId },
    select: {
      targetCareerId: true,
      studentSkills: { select: { skill: { select: { name: true } } } },
      careerAnalyses: { orderBy: { createdAt: "desc" }, take: 1, select: { missingSkills: true } },
      skillPerformances: {
        where: { classification: { in: ["CRITICAL", "WEAK", "DEVELOPING"] } },
        select: { skill: { select: { name: true } } },
      },
      resumes: {
        where: { status: "ANALYZED" },
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { analysis: { select: { missingSkills: true } } },
      },
      learningRoadmaps: {
        orderBy: { updatedAt: "desc" },
        take: 1,
        select: { tasks: { where: { category: "PROJECT" }, select: { title: true } } },
      },
    },
  });

  if (!profile) throw new Error("Student profile not found.");
  const projectTaskText = profile.learningRoadmaps[0]?.tasks.map((task) => normalize(task.title)).join(" ") ?? "";
  const knownSkills = new Set(profile.studentSkills.map(({ skill }) => normalize(skill.name)));
  const careerGaps = new Set((profile.careerAnalyses[0]?.missingSkills ?? []).map(normalize));
  const aptitudeGaps = new Set(profile.skillPerformances.map(({ skill }) => normalize(skill.name)));
  const resumeGaps = new Set((profile.resumes[0]?.analysis?.missingSkills ?? []).map(normalize));
  const roadmapProjectSkills = new Set([...careerGaps, ...aptitudeGaps, ...resumeGaps].filter((skill) => projectTaskText.includes(skill)));

  return { careerGaps, aptitudeGaps, resumeGaps, roadmapProjectSkills, knownSkills, targetCareerId: profile.targetCareerId };
}

function rankProject(project: { careerRoleId: string | null; difficulty: string; requiredSkills: string[] }, evidence: ProjectEvidence) {
  const careerRelevance = project.careerRoleId === evidence.targetCareerId ? 25 : 0;
  const required = project.requiredSkills.map(normalize);
  const denominator = Math.max(1, required.length);
  const careerCoverage = (overlap(required, evidence.careerGaps).length / denominator) * 25;
  const aptitudeCoverage = (overlap(required, evidence.aptitudeGaps).length / denominator) * 20;
  const resumeCoverage = (overlap(required, evidence.resumeGaps).length / denominator) * 15;
  const roadmapAlignment = (overlap(required, evidence.roadmapProjectSkills).length / denominator) * 10;
  const knownRatio = overlap(required, evidence.knownSkills).length / denominator;
  return Math.round(careerRelevance + careerCoverage + aptitudeCoverage + resumeCoverage + roadmapAlignment + difficultySuitability(project.difficulty, knownRatio));
}

export async function refreshProjectRecommendations(studentProfileId: string) {
  const evidence = await loadEvidence(studentProfileId);
  const projects = await prisma.project.findMany({
    where: evidence.targetCareerId ? { OR: [{ careerRoleId: evidence.targetCareerId }, { careerRoleId: null }] } : {},
    include: { careerRole: { select: { title: true } } },
  });

  const recommendations = await prisma.$transaction(
    projects.map((project) => {
      const relevanceScore = rankProject(project, evidence);
      const reason = buildReason(project, evidence);
      return prisma.projectRecommendation.upsert({
        where: { studentProfileId_projectId: { studentProfileId, projectId: project.id } },
        create: { studentProfileId, projectId: project.id, relevanceScore, reason },
        update: { relevanceScore, reason },
        include: {
          project: { include: { careerRole: { select: { title: true } }, skillRelations: { select: { name: true } } } },
        },
      });
    })
  );

  return recommendations.sort((a, b) => b.relevanceScore - a.relevanceScore);
}

export async function getProjectRecommendations(studentProfileId: string) {
  const existing = await prisma.projectRecommendation.findMany({
    where: { studentProfileId },
    include: { project: { include: { careerRole: { select: { title: true } }, skillRelations: { select: { name: true } } } } },
    orderBy: [{ relevanceScore: "desc" }, { createdAt: "desc" }],
  });
  return existing.length ? existing : refreshProjectRecommendations(studentProfileId);
}

export function isProjectRecommendationStatus(value: unknown): value is ProjectRecommendationStatus {
  return typeof value === "string" && RECOMMENDATION_STATUSES.includes(value as ProjectRecommendationStatus);
}
