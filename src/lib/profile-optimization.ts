import "server-only";

import { prisma } from "@/lib/prisma";
import { generateProfessionalEvidence, getProfessionalEvidence } from "@/lib/professional-evidence";

type GapSeverity = "HIGH" | "MEDIUM" | "LOW";

export type ProfileOptimization = {
  score: number;
  profile: {
    targetRole: string;
    headline: string;
    summary: string;
    skills: string[];
  };
  sources: {
    profile: boolean;
    resume: boolean;
    github: boolean;
    linkedin: boolean;
    evidence: boolean;
  };
  consistencyGaps: {
    id: string;
    severity: GapSeverity;
    title: string;
    detail: string;
    href: string;
  }[];
  recommendations: {
    id: string;
    title: string;
    detail: string;
    href: string;
  }[];
  computedAt: string;
};

const normalize = (value: string | null | undefined) => value?.trim() ?? "";

function clamp(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function hasSkill(text: string, skill: string) {
  return text.toLowerCase().includes(skill.toLowerCase());
}

export async function calculateProfileOptimization(studentProfileId: string): Promise<ProfileOptimization> {
  const profile = await prisma.studentProfile.findUnique({
    where: { id: studentProfileId },
    select: {
      targetDomain: true,
      careerGoal: true,
      preferredDomain: true,
      programmingLanguages: true,
      frameworks: true,
      databases: true,
      tools: true,
      certifications: true,
      projects: true,
      experience: true,
      studentSkills: { select: { skill: { select: { name: true } } } },
      targetCareer: { select: { title: true, skillRelations: { select: { name: true } } } },
      resumes: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { extractedText: true, analysis: { select: { detectedSkills: true, atsScore: true } } },
      },
      githubConnection: {
        select: {
          username: true,
          repositories: { select: { name: true, hasReadme: true, topics: true } },
        },
      },
      linkedinProfile: {
        select: {
          headline: true,
          about: true,
          skills: { select: { skill: { select: { name: true } } } },
          experience: { select: { title: true, description: true } },
        },
      },
    },
  });

  if (!profile) {
    throw new Error("Student profile not found.");
  }

  const resume = profile.resumes[0] ?? null;
  const targetRole = normalize(profile.targetCareer?.title) || normalize(profile.targetDomain);
  const declaredSkills = profile.studentSkills.map(({ skill }) => skill.name);
  const resumeSkills = resume?.analysis?.detectedSkills ?? [];
  const linkedinSkills = profile.linkedinProfile?.skills.map(({ skill }) => skill.name) ?? [];
  const allProfileText = [
    profile.careerGoal,
    profile.preferredDomain,
    profile.programmingLanguages,
    profile.frameworks,
    profile.databases,
    profile.tools,
    profile.certifications,
    profile.projects,
    profile.experience,
  ].map(normalize).join(" ");
  const sourceText = [allProfileText, resume?.extractedText, resumeSkills.join(" "), linkedinSkills.join(" ")]
    .map(normalize)
    .join(" ");

  const gaps: ProfileOptimization["consistencyGaps"] = [];
  const recommendations: ProfileOptimization["recommendations"] = [];
  const requiredSkills = profile.targetCareer?.skillRelations.map((skill) => skill.name) ?? [];
  const missingRoleSkills = requiredSkills.filter((skill) => !hasSkill(sourceText, skill));

  if (!targetRole) {
    gaps.push({
      id: "target-role",
      severity: "HIGH",
      title: "Choose a target role",
      detail: "A target role is required to align your resume, evidence, and professional profiles.",
      href: "/dashboard/career",
    });
  }
  if (!resume) {
    gaps.push({
      id: "resume-missing",
      severity: "HIGH",
      title: "Add a current resume",
      detail: "There is no uploaded resume to compare against your profile and role requirements.",
      href: "/dashboard/resume",
    });
  } else if (!resume.analysis) {
    gaps.push({
      id: "resume-analysis",
      severity: "MEDIUM",
      title: "Analyze your latest resume",
      detail: "Run ATS analysis so recommendations can be grounded in detected skills and keywords.",
      href: "/dashboard/resume",
    });
  }
  if (!profile.githubConnection) {
    gaps.push({
      id: "github-missing",
      severity: "MEDIUM",
      title: "Connect GitHub evidence",
      detail: "Your technical claims are not yet backed by repository evidence.",
      href: "/dashboard/github",
    });
  } else if (profile.githubConnection.repositories.length > 0 && profile.githubConnection.repositories.some((repo) => !repo.hasReadme)) {
    gaps.push({
      id: "github-readmes",
      severity: "LOW",
      title: "Document GitHub repositories",
      detail: "Some connected repositories are missing READMEs, making project impact harder to verify.",
      href: "/dashboard/github",
    });
  }
  if (!profile.linkedinProfile) {
    gaps.push({
      id: "linkedin-missing",
      severity: "MEDIUM",
      title: "Import LinkedIn evidence",
      detail: "Your professional profile is not connected, so role history and public skills cannot be compared.",
      href: "/dashboard/linkedin",
    });
  } else if (!normalize(profile.linkedinProfile.headline) || !normalize(profile.linkedinProfile.about)) {
    gaps.push({
      id: "linkedin-story",
      severity: "LOW",
      title: "Strengthen your LinkedIn story",
      detail: "Add a headline and About section that clearly support your target role.",
      href: "/dashboard/linkedin",
    });
  }
  if (missingRoleSkills.length > 0) {
    gaps.push({
      id: "role-skills",
      severity: "HIGH",
      title: "Close target-role skill gaps",
      detail: `${missingRoleSkills.slice(0, 4).join(", ")}${missingRoleSkills.length > 4 ? ` and ${missingRoleSkills.length - 4} more` : ""} are not visible across your current evidence.`,
      href: "/dashboard/career",
    });
  }

  const profileOnlySkills = declaredSkills.filter((skill) => !hasSkill(sourceText.replace(skill, ""), skill));
  if (profileOnlySkills.length > 0) {
    gaps.push({
      id: "unsupported-skills",
      severity: "MEDIUM",
      title: "Add proof for declared skills",
      detail: `${profileOnlySkills.slice(0, 4).join(", ")}${profileOnlySkills.length > 4 ? ` and ${profileOnlySkills.length - 4} more` : ""} appear in your profile without matching resume, project, GitHub, or LinkedIn evidence.`,
      href: "/dashboard/profile",
    });
  }

  if (targetRole && !hasSkill(sourceText, targetRole)) {
    recommendations.push({
      id: "role-language",
      title: `Use ${targetRole} language consistently`,
      detail: `Mention the target role in your resume summary and LinkedIn headline where it accurately reflects your goals.`,
      href: "/dashboard/resume",
    });
  }
  if (missingRoleSkills.length > 0) {
    recommendations.push({
      id: "skill-keywords",
      title: "Surface high-value role skills",
      detail: `Prioritize evidence and measurable outcomes for ${missingRoleSkills.slice(0, 3).join(", ")}.`,
      href: "/dashboard/career",
    });
  }
  if (profile.githubConnection && profile.githubConnection.repositories.length > 0) {
    recommendations.push({
      id: "project-impact",
      title: "Describe project impact",
      detail: "Add outcomes, technologies, and links for your strongest repositories so they reinforce your resume claims.",
      href: "/dashboard/github",
    });
  }
  if (profile.linkedinProfile) {
    recommendations.push({
      id: "profile-alignment",
      title: "Align public profile keywords",
      detail: "Keep your LinkedIn headline, About section, and skills consistent with your selected target role.",
      href: "/dashboard/linkedin",
    });
  }

  const evidence = (await getProfessionalEvidence(studentProfileId)) ?? await generateProfessionalEvidence(studentProfileId);
  const evidenceSkills = evidence.skillEvidence.filter((skill) => skill.confidence !== "LOW").length;
  const sourceCount = [resume, profile.githubConnection, profile.linkedinProfile, evidence].filter(Boolean).length;
  const score = clamp(100 - gaps.filter((gap) => gap.severity === "HIGH").length * 18 - gaps.filter((gap) => gap.severity === "MEDIUM").length * 10 - gaps.filter((gap) => gap.severity === "LOW").length * 4 + Math.min(12, evidenceSkills * 2));

  return {
    score,
    profile: {
      targetRole: targetRole || "Target role not selected",
      headline: normalize(profile.linkedinProfile?.headline) || (targetRole ? `${targetRole} candidate` : "Career profile"),
      summary: normalize(profile.linkedinProfile?.about) || normalize(profile.careerGoal) || "Add a concise career summary to align your professional story.",
      skills: [...new Set([...declaredSkills, ...resumeSkills, ...linkedinSkills])].slice(0, 18),
    },
    sources: {
      profile: Boolean(profile.targetDomain || declaredSkills.length || allProfileText),
      resume: Boolean(resume),
      github: Boolean(profile.githubConnection),
      linkedin: Boolean(profile.linkedinProfile),
      evidence: sourceCount > 0 && evidence.totalSkills > 0,
    },
    consistencyGaps: gaps.slice(0, 8),
    recommendations: recommendations.slice(0, 6),
    computedAt: new Date().toISOString(),
  };
}
