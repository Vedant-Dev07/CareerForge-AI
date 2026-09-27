import { prisma } from "@/lib/prisma";

// ─── Constants ────────────────────────────────────────────────────────────────

export const ROADMAP_STATUSES = ["NOT_STARTED", "IN_PROGRESS", "COMPLETED"] as const;
export type RoadmapStatus = (typeof ROADMAP_STATUSES)[number];

export type TaskSource = "CAREER_GAP" | "APTITUDE_WEAK" | "RESUME_GAP";
export type TaskPriority = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

// ─── Types ────────────────────────────────────────────────────────────────────

interface GapEntry {
  skillName: string;      // normalised lowercase
  source: TaskSource;
  priority: TaskPriority;
  accuracy?: number;      // only for aptitude entries
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function aptitudePriority(accuracy: number): TaskPriority {
  if (accuracy < 40) return "CRITICAL";
  if (accuracy < 60) return "HIGH";
  if (accuracy < 70) return "MEDIUM";
  return "LOW";
}

/**
 * Merge gap entries by skill name, keeping the highest-priority source.
 * If a skill appears in both APTITUDE_WEAK and CAREER_GAP, the task gets
 * the higher of the two priorities and the source stays APTITUDE_WEAK
 * (more specific evidence wins).
 */
function mergeGaps(entries: GapEntry[]): GapEntry[] {
  const priorityRank: Record<TaskPriority, number> = {
    CRITICAL: 4,
    HIGH: 3,
    MEDIUM: 2,
    LOW: 1,
  };

  const sourceRank: Record<TaskSource, number> = {
    APTITUDE_WEAK: 3,
    CAREER_GAP: 2,
    RESUME_GAP: 1,
  };

  const map = new Map<string, GapEntry>();

  for (const entry of entries) {
    const existing = map.get(entry.skillName);
    if (!existing) {
      map.set(entry.skillName, { ...entry });
      continue;
    }
    // Keep the higher-ranked source; keep the higher priority
    const betterSource =
      sourceRank[entry.source] > sourceRank[existing.source] ? entry.source : existing.source;
    const betterPriority =
      priorityRank[entry.priority] > priorityRank[existing.priority]
        ? entry.priority
        : existing.priority;
    map.set(entry.skillName, {
      ...existing,
      source: betterSource,
      priority: betterPriority,
    });
  }

  // Sort: CRITICAL first, then HIGH, MEDIUM, LOW
  return [...map.values()].sort(
    (a, b) => priorityRank[b.priority] - priorityRank[a.priority]
  );
}

function tasksForGap(
  gap: GapEntry,
  careerTitle: string,
): Array<{
  title: string;
  description: string;
  category: string;
  difficulty: string;
  estimatedMinutes: number;
  source: TaskSource;
  priority: TaskPriority;
  skillId: string | undefined;
}> {
  const skill = gap.skillName;

  // For CRITICAL/HIGH aptitude weaknesses, lead with targeted practice
  if (gap.source === "APTITUDE_WEAK" && (gap.priority === "CRITICAL" || gap.priority === "HIGH")) {
    return [
      {
        title: `Learn the fundamentals: ${skill}`,
        description: `Your aptitude assessment showed a gap in ${skill}. Start with the core concepts.`,
        category: "SKILL",
        difficulty: "EASY",
        estimatedMinutes: 90,
        source: gap.source,
        priority: gap.priority,
        skillId: undefined,
      },
      {
        title: `Practice exercises: ${skill}`,
        description: `Reinforce your understanding of ${skill} with focused problem-solving practice.`,
        category: "PRACTICE",
        difficulty: "MEDIUM",
        estimatedMinutes: 120,
        source: gap.source,
        priority: gap.priority,
        skillId: undefined,
      },
    ];
  }

  // Default: learn → practice → project
  return [
    {
      title: `Learn the fundamentals: ${skill}`,
      description: `Work on ${skill} to improve your readiness for ${careerTitle}.`,
      category: "SKILL",
      difficulty: "EASY",
      estimatedMinutes: 90,
      source: gap.source,
      priority: gap.priority,
      skillId: undefined,
    },
    {
      title: `Practice with a guided exercise: ${skill}`,
      description: `Apply your ${skill} knowledge through structured exercises.`,
      category: "PRACTICE",
      difficulty: "MEDIUM",
      estimatedMinutes: 120,
      source: gap.source,
      priority: gap.priority,
      skillId: undefined,
    },
    {
      title: `Build a portfolio example: ${skill}`,
      description: `Create a small project showcasing your ${skill} ability for ${careerTitle} roles.`,
      category: "PROJECT",
      difficulty: "HARD",
      estimatedMinutes: 180,
      source: gap.source,
      priority: gap.priority,
      skillId: undefined,
    },
  ];
}

// ─── Public: recalculate progress ────────────────────────────────────────────

export async function recalculateRoadmap(roadmapId: string) {
  const tasks = await prisma.roadmapTask.findMany({
    where: { roadmapId },
    select: { status: true },
  });
  const completed = tasks.filter((t) => t.status === "COMPLETED").length;
  const progress = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;
  const status: RoadmapStatus =
    progress === 100 ? "COMPLETED" : progress > 0 ? "IN_PROGRESS" : "NOT_STARTED";

  return prisma.learningRoadmap.update({
    where: { id: roadmapId },
    data: { progress, status },
  });
}

// ─── Public: get roadmap ──────────────────────────────────────────────────────

export async function getStudentRoadmap(studentProfileId: string) {
  return prisma.learningRoadmap.findFirst({
    where: { studentProfileId },
    orderBy: { updatedAt: "desc" },
    include: {
      careerRole: { select: { id: true, title: true } },
      tasks: { orderBy: [{ priority: "desc" }, { createdAt: "asc" }] },
    },
  });
}

// ─── Public: collect unified gaps ────────────────────────────────────────────

export async function collectUnifiedGaps(studentProfileId: string): Promise<GapEntry[]> {
  const entries: GapEntry[] = [];

  // 1. Career analysis gaps
  const profile = await prisma.studentProfile.findUnique({
    where: { id: studentProfileId },
    select: {
      targetCareer: { select: { id: true } },
      careerAnalyses: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { missingSkills: true },
      },
    },
  });

  const careerMissing = profile?.careerAnalyses[0]?.missingSkills ?? [];
  for (const skill of careerMissing) {
    const name = normalize(skill);
    if (name) entries.push({ skillName: name, source: "CAREER_GAP", priority: "MEDIUM" });
  }

  // 2. Aptitude weak skills (CRITICAL + WEAK + DEVELOPING)
  const skillPerformances = await prisma.skillPerformance.findMany({
    where: {
      studentProfileId,
      classification: { in: ["CRITICAL", "WEAK", "DEVELOPING"] },
    },
    include: { skill: { select: { name: true } } },
    orderBy: { accuracy: "asc" },
  });

  for (const sp of skillPerformances) {
    const name = normalize(sp.skill.name);
    if (name) {
      entries.push({
        skillName: name,
        source: "APTITUDE_WEAK",
        priority: aptitudePriority(sp.accuracy),
        accuracy: sp.accuracy,
      });
    }
  }

  // 3. Resume gaps (from latest resume analysis)
  const latestResume = await prisma.resume.findFirst({
    where: { studentProfileId, status: "ANALYZED" },
    orderBy: { createdAt: "desc" },
    include: { analysis: { select: { missingSkills: true } } },
  });

  const resumeMissing = latestResume?.analysis?.missingSkills ?? [];
  for (const skill of resumeMissing) {
    const name = normalize(skill);
    if (name) entries.push({ skillName: name, source: "RESUME_GAP", priority: "LOW" });
  }

  return mergeGaps(entries);
}

// ─── Public: generate / refresh roadmap ──────────────────────────────────────

export async function generateRoadmap(studentProfileId: string) {
  const profile = await prisma.studentProfile.findUnique({
    where: { id: studentProfileId },
    select: {
      targetCareer: { select: { id: true, title: true } },
      careerAnalyses: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { careerRoleId: true },
      },
    },
  });

  const career = profile?.targetCareer;
  const analysis = profile?.careerAnalyses[0];
  if (!profile || !career || !analysis || analysis.careerRoleId !== career.id) {
    return null;
  }

  const gaps = await collectUnifiedGaps(studentProfileId);

  // If there are no gaps at all, create a "ready" roadmap
  if (gaps.length === 0) {
    const existing = await prisma.learningRoadmap.findFirst({
      where: { studentProfileId, careerRoleId: career.id },
      orderBy: { updatedAt: "desc" },
    });
    if (existing) return getStudentRoadmap(studentProfileId);
    return prisma.learningRoadmap.create({
      data: {
        studentProfileId,
        careerRoleId: career.id,
        title: `${career.title} readiness roadmap`,
        description:
          "Your current skills cover the requirements for this role. Keep practising through projects and interviews.",
        progress: 100,
        status: "COMPLETED",
      },
      include: {
        careerRole: { select: { id: true, title: true } },
        tasks: true,
      },
    });
  }

  const existing = await prisma.learningRoadmap.findFirst({
    where: { studentProfileId, careerRoleId: career.id },
    orderBy: { updatedAt: "desc" },
    select: { id: true },
  });

  if (existing) {
    // Roadmap already exists — return it without overwriting completed tasks
    return getStudentRoadmap(studentProfileId);
  }

  // Create a brand-new roadmap with tasks from all gap sources
  const taskData = gaps.flatMap((gap) => tasksForGap(gap, career.title));

  const roadmap = await prisma.learningRoadmap.create({
    data: {
      studentProfileId,
      careerRoleId: career.id,
      title: `${career.title} personalised roadmap`,
      description:
        "A prioritised learning plan built from your career analysis, aptitude performance, and resume gaps.",
      tasks: { create: taskData },
    },
    include: {
      careerRole: { select: { id: true, title: true } },
      tasks: { orderBy: [{ priority: "desc" }, { createdAt: "asc" }] },
    },
  });
  return roadmap;
}

/**
 * Refresh an existing roadmap: inject new tasks from aptitude weak skills
 * and resume gaps that do not already have a corresponding NOT_STARTED task.
 * Completed tasks are left untouched.
 */
export async function refreshRoadmapWithNewGaps(studentProfileId: string) {
  const roadmap = await prisma.learningRoadmap.findFirst({
    where: { studentProfileId },
    orderBy: { updatedAt: "desc" },
    include: {
      careerRole: { select: { id: true, title: true } },
      tasks: { select: { title: true, status: true, source: true } },
    },
  });
  if (!roadmap) return null;

  const gaps = await collectUnifiedGaps(studentProfileId);

  // Build a set of skill names that already have a SKILL-category task
  // (normalise titles to avoid case mismatches)
  const existingTitles = new Set(
    roadmap.tasks.map((t) => normalize(t.title))
  );

  const newTaskData = [];
  for (const gap of gaps) {
    const candidateTasks = tasksForGap(gap, roadmap.careerRole.title);
    for (const task of candidateTasks) {
      if (!existingTitles.has(normalize(task.title))) {
        newTaskData.push({ ...task, roadmapId: roadmap.id });
      }
    }
  }

  if (newTaskData.length === 0) {
    // Nothing new to add — still recalculate progress in case statuses changed
    await recalculateRoadmap(roadmap.id);
    return getStudentRoadmap(studentProfileId);
  }

  await prisma.roadmapTask.createMany({ data: newTaskData });
  await recalculateRoadmap(roadmap.id);
  return getStudentRoadmap(studentProfileId);
}
