import { prisma } from "@/lib/prisma";

export const ROADMAP_STATUSES = ["NOT_STARTED", "IN_PROGRESS", "COMPLETED"] as const;
export type RoadmapStatus = (typeof ROADMAP_STATUSES)[number];

const taskTemplates = [
  { title: "Learn the fundamentals", category: "SKILL", difficulty: "EASY", estimatedMinutes: 90 },
  { title: "Practice with a guided exercise", category: "PRACTICE", difficulty: "MEDIUM", estimatedMinutes: 120 },
  { title: "Build a small portfolio example", category: "PROJECT", difficulty: "HARD", estimatedMinutes: 180 },
] as const;

function normalize(value: string) {
  return value.trim().toLowerCase();
}

export async function recalculateRoadmap(roadmapId: string) {
  const tasks = await prisma.roadmapTask.findMany({
    where: { roadmapId },
    select: { status: true },
  });
  const completed = tasks.filter((task) => task.status === "COMPLETED").length;
  const progress = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;
  const status: RoadmapStatus =
    progress === 100 ? "COMPLETED" : progress > 0 ? "IN_PROGRESS" : "NOT_STARTED";

  return prisma.learningRoadmap.update({
    where: { id: roadmapId },
    data: { progress, status },
  });
}

export async function getStudentRoadmap(studentProfileId: string) {
  return prisma.learningRoadmap.findFirst({
    where: { studentProfileId },
    orderBy: { updatedAt: "desc" },
    include: {
      careerRole: { select: { id: true, title: true } },
      tasks: { orderBy: { createdAt: "asc" } },
    },
  });
}

export async function generateRoadmap(studentProfileId: string) {
  const profile = await prisma.studentProfile.findUnique({
    where: { id: studentProfileId },
    select: {
      targetCareer: { select: { id: true, title: true } },
      careerAnalyses: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { careerRoleId: true, missingSkills: true },
      },
    },
  });

  const analysis = profile?.careerAnalyses[0];
  const career = profile?.targetCareer;
  if (!profile || !analysis || !career || analysis.careerRoleId !== career.id) {
    return null;
  }

  const missingSkills = [...new Set(analysis.missingSkills.map(normalize).filter(Boolean))];
  if (!missingSkills.length) {
    const existing = await prisma.learningRoadmap.findFirst({
      where: { studentProfileId, careerRoleId: career.id },
      orderBy: { updatedAt: "desc" },
    });
    if (existing) return existing;
    return prisma.learningRoadmap.create({
      data: {
        studentProfileId,
        careerRoleId: career.id,
        title: `${career.title} readiness roadmap`,
        description: "Your current skills cover the requirements for this role. Keep practicing through projects and interviews.",
        progress: 100,
        status: "COMPLETED",
      },
      include: { careerRole: { select: { id: true, title: true } }, tasks: true },
    });
  }

  const existing = await prisma.learningRoadmap.findFirst({
    where: { studentProfileId, careerRoleId: career.id },
    orderBy: { updatedAt: "desc" },
    select: { id: true },
  });
  if (existing) {
    return getStudentRoadmap(studentProfileId);
  }

  const roadmap = await prisma.learningRoadmap.create({
    data: {
      studentProfileId,
      careerRoleId: career.id,
      title: `${career.title} skill-gap roadmap`,
      description: "A transparent learning plan generated from your latest career analysis.",
      tasks: {
        create: missingSkills.flatMap((skill) =>
          taskTemplates.map((template) => ({
            ...template,
            title: `${template.title}: ${skill}`,
            description: `Work on ${skill} to improve your readiness for ${career.title}.`,
          })),
        ),
      },
    },
    include: {
      careerRole: { select: { id: true, title: true } },
      tasks: { orderBy: { createdAt: "asc" } },
    },
  });
  return roadmap;
}
