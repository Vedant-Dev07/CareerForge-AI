import "server-only";

import { prisma } from "@/lib/prisma";

export const JOB_STATUSES = ["DISCOVERED", "SAVED", "APPLIED", "INTERVIEW", "OFFER", "REJECTED"] as const;
export type JobStatus = (typeof JOB_STATUSES)[number];

type StudentSignals = {
  targetRole: string;
  careerSkills: string[];
  profileSkills: string[];
  sourceText: string;
  evidenceSkills: Set<string>;
  projectSkills: Set<string>;
  aptitudeScore: number;
  interviewScore: number;
};

const normalize = (value: string | null | undefined) => value?.trim().toLowerCase() ?? "";
const clamp = (value: number) => Math.max(0, Math.min(100, Math.round(value)));
const includesSkill = (skills: string[], target: string) => skills.some((skill) => normalize(skill) === normalize(target) || normalize(skill).includes(normalize(target)) || normalize(target).includes(normalize(skill)));

async function getStudentSignals(studentProfileId: string): Promise<StudentSignals> {
  const [profile, resume, github, linkedin, evidence, projects, aptitude, interviews] = await Promise.all([
    prisma.studentProfile.findUnique({
      where: { id: studentProfileId },
      select: {
        targetDomain: true,
        studentSkills: { select: { skill: { select: { name: true } } } },
        targetCareer: { select: { title: true, skillRelations: { select: { name: true } } } },
      },
    }),
    prisma.resume.findFirst({
      where: { studentProfileId },
      orderBy: { createdAt: "desc" },
      select: { extractedText: true, analysis: { select: { detectedSkills: true } } },
    }),
    prisma.gitHubConnection.findUnique({
      where: { studentProfileId },
      select: { repositories: { select: { name: true, description: true, topics: true, primaryLanguage: true } }, skillEvidence: { select: { skill: { select: { name: true } } } } },
    }),
    prisma.linkedInProfile.findUnique({
      where: { studentProfileId },
      select: { headline: true, about: true, skills: { select: { skill: { select: { name: true } } } } },
    }),
    prisma.professionalEvidence.findMany({
      where: { studentProfileId, confidence: { in: ["HIGH", "MEDIUM"] } },
      select: { skill: { select: { name: true } } },
    }),
    prisma.projectRecommendation.findMany({
      where: { studentProfileId, status: "COMPLETED" },
      select: { skillsDemonstrated: true },
    }),
    prisma.assessmentAttempt.findFirst({
      where: { studentProfileId, status: "COMPLETED" },
      orderBy: { completedAt: "desc" },
      select: { percentage: true },
    }),
    prisma.interviewSession.findMany({
      where: { studentProfileId, status: "COMPLETED", score: { not: null } },
      select: { score: true },
    }),
  ]);

  const profileSkills = profile?.studentSkills.map(({ skill }) => skill.name) ?? [];
  const resumeSkills = resume?.analysis?.detectedSkills ?? [];
  const githubSkills = github?.skillEvidence.map(({ skill }) => skill.name) ?? [];
  const linkedinSkills = linkedin?.skills.map(({ skill }) => skill.name) ?? [];
  const sourceText = [
    profile?.targetDomain,
    resume?.extractedText,
    resumeSkills.join(" "),
    github?.repositories.map((repo) => [repo.name, repo.description, repo.topics.join(" "), repo.primaryLanguage].join(" ")).join(" "),
    linkedin?.headline,
    linkedin?.about,
    linkedinSkills.join(" "),
  ].join(" ");
  const projectSkills = new Set(projects.flatMap((project) => project.skillsDemonstrated));
  const evidenceSkills = new Set([...evidence.map(({ skill }) => skill.name), ...githubSkills, ...linkedinSkills]);
  const interviewScores = interviews.map((session) => session.score).filter((score): score is number => score !== null);

  return {
    targetRole: profile?.targetCareer?.title ?? profile?.targetDomain ?? "",
    careerSkills: profile?.targetCareer?.skillRelations.map((skill) => skill.name) ?? [],
    profileSkills: [...new Set([...profileSkills, ...resumeSkills, ...githubSkills, ...linkedinSkills])],
    sourceText,
    evidenceSkills,
    projectSkills,
    aptitudeScore: aptitude?.percentage ?? 0,
    interviewScore: interviewScores.length ? interviewScores.reduce((sum, score) => sum + score, 0) / interviewScores.length : 0,
  };
}

export async function scoreJob(studentProfileId: string, job: { title: string; description: string | null; requiredSkills: string[]; preferredSkills: string[] }) {
  const signals = await getStudentSignals(studentProfileId);
  const required = job.requiredSkills;
  const matchedRequired = required.filter((skill) => includesSkill(signals.profileSkills, skill) || signals.projectSkills.has(skill) || signals.evidenceSkills.has(skill));
  const missingSkills = required.filter((skill) => !matchedRequired.includes(skill));
  const skillCoverage = required.length ? clamp((matchedRequired.length / required.length) * 100) : 100;
  const careerAlignment = signals.targetRole && normalize(`${job.title} ${job.description}`).includes(normalize(signals.targetRole)) ? 100 : signals.careerSkills.some((skill) => required.some((requiredSkill) => includesSkill([skill], requiredSkill))) ? 70 : 35;
  const evidenceScore = required.length ? clamp((required.filter((skill) => signals.evidenceSkills.has(skill)).length / required.length) * 100) : 0;
  const resumeAlignment = required.length ? clamp((required.filter((skill) => hasText(job, skill, signals.sourceText)).length / required.length) * 100) : 0;
  const projectRelevance = required.length ? clamp((required.filter((skill) => signals.projectSkills.has(skill)).length / required.length) * 100) : 0;
  const aptitudeReadiness = signals.aptitudeScore;
  const interviewReadiness = signals.interviewScore;
  const matchScore = clamp(
    careerAlignment * 0.2 +
    skillCoverage * 0.3 +
    evidenceScore * 0.15 +
    resumeAlignment * 0.15 +
    projectRelevance * 0.1 +
    aptitudeReadiness * 0.05 +
    interviewReadiness * 0.05,
  );
  const explanation = missingSkills.length
    ? `This ${matchScore}% match aligns with ${matchedRequired.slice(0, 3).join(", ") || "your current profile"}; strengthen ${missingSkills.slice(0, 3).join(", ")} before applying.`
    : `This ${matchScore}% match aligns with your target role and all required skills are represented in your current evidence.`;
  return { matchScore, careerAlignment, skillCoverage, evidenceScore, resumeAlignment, projectRelevance, aptitudeReadiness, interviewReadiness, missingSkills, explanation };
}

function hasText(job: { title: string; description: string | null }, skill: string, sourceText: string) {
  return normalize(sourceText).includes(normalize(skill));
}

export async function refreshJobRecommendations(studentProfileId: string) {
  const jobs = await prisma.jobOpportunity.findMany({ where: { isActive: true }, orderBy: { createdAt: "desc" } });
  const recommendations = [];
  for (const job of jobs) {
    const score = await scoreJob(studentProfileId, job);
    recommendations.push(await prisma.jobRecommendation.upsert({
      where: { studentProfileId_jobId: { studentProfileId, jobId: job.id } },
      create: { studentProfileId, jobId: job.id, ...score },
      update: score,
      include: { job: true },
    }));
  }
  return recommendations.sort((a, b) => b.matchScore - a.matchScore);
}

export async function getRecommendedJobs(studentProfileId: string) {
  const existing = await prisma.jobRecommendation.findMany({ where: { studentProfileId }, include: { job: true }, orderBy: { matchScore: "desc" } });
  return existing.length ? existing : refreshJobRecommendations(studentProfileId);
}
