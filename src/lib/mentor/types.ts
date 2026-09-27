export const MENTOR_ACTION_TYPES = [
  "ROADMAP_TASK",
  "PROJECT",
  "READINESS",
  "INTERVIEW",
  "RESUME",
  "APTITUDE",
] as const;

export type MentorActionType = (typeof MENTOR_ACTION_TYPES)[number];

export type MentorAction = {
  type: MentorActionType;
  id: string;
  label: string;
  href: string;
};

export type MentorContext = {
  career: { title: string | null; goal: string | null; matchPercentage: number | null; missingSkills: string[] };
  resume: { atsScore: number | null; missingSkills: string[]; recommendations: string[] };
  aptitude: { latestScore: number | null; weakSkills: { name: string; accuracy: number; classification: string }[] };
  roadmap: { progress: number | null; priorityTasks: { title: string; priority: string; source: string }[] };
  projects: { recommended: string[]; completed: string[] };
  interview: { completedCount: number; averageScore: number | null; weakestDimension: string | null };
  readiness: { overallScore: number; weakSkillCount: number; recommendations: { title: string; detail: string }[] };
  actionCandidates: MentorAction[];
};

export type MentorResponse = { message: string; actions: MentorAction[] };
