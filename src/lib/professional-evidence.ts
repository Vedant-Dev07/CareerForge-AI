import "server-only";

import { prisma } from "@/lib/prisma";

export type EvidenceSource = "RESUME" | "GITHUB" | "LINKEDIN" | "PROJECT" | "APTITUDE" | "INTERVIEW";
export type EvidenceType = "DIRECT" | "INDIRECT" | "INFERRED";
export type EvidenceConfidence = "HIGH" | "MEDIUM" | "LOW";

export interface SkillEvidence {
  skillId: string;
  skillName: string;
  sources: EvidenceSource[];
  evidenceCount: number;
  confidence: EvidenceConfidence;
  details: {
    resume?: boolean;
    github?: boolean;
    linkedin?: boolean;
    project?: boolean;
    aptitude?: boolean;
    interview?: boolean;
  };
}

export interface ProfessionalEvidenceProfile {
  studentProfileId: string;
  totalSkills: number;
  skillEvidence: SkillEvidence[];
  evidenceStrength: {
    high: number;
    medium: number;
    low: number;
  };
  sourceCoverage: {
    resume: number;
    github: number;
    linkedin: number;
    project: number;
    aptitude: number;
    interview: number;
  };
  computedAt: string;
}

export async function generateProfessionalEvidence(
  studentProfileId: string
): Promise<ProfessionalEvidenceProfile> {
  // Fetch all data sources in parallel
  const [
    studentSkills,
    resumeAnalysis,
    githubConnection,
    linkedinProfile,
    projectRecommendations,
    skillPerformances,
    interviewSessions,
  ] = await Promise.all([
    prisma.studentSkill.findMany({
      where: { studentProfileId },
      include: { skill: true },
    }),
    prisma.resume.findFirst({
      where: { studentProfileId },
      orderBy: { createdAt: "desc" },
      include: { analysis: true },
    }),
    prisma.gitHubConnection.findUnique({
      where: { studentProfileId },
      include: { skillEvidence: { include: { skill: true } } },
    }),
    prisma.linkedInProfile.findUnique({
      where: { studentProfileId },
      include: { skills: { include: { skill: true } } },
    }),
    prisma.projectRecommendation.findMany({
      where: { studentProfileId, status: "COMPLETED" },
      select: { skillsDemonstrated: true },
    }),
    prisma.skillPerformance.findMany({
      where: { studentProfileId },
      include: { skill: true },
    }),
    prisma.interviewSession.findMany({
      where: { studentProfileId, status: "COMPLETED" },
      take: 5,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  // Build skill evidence map
  const skillEvidenceMap = new Map<string, SkillEvidence>();

  // Initialize with student's declared skills
  for (const studentSkill of studentSkills) {
    skillEvidenceMap.set(studentSkill.skillId, {
      skillId: studentSkill.skillId,
      skillName: studentSkill.skill.name,
      sources: [],
      evidenceCount: 0,
      confidence: "LOW",
      details: {},
    });
  }

  // Add resume evidence
  if (resumeAnalysis?.analysis) {
    const resumeSkills = resumeAnalysis.analysis.detectedSkills || [];
    for (const skillName of resumeSkills) {
      const skill = await prisma.skill.findFirst({
        where: { name: skillName.toLowerCase() },
      });
      if (skill) {
        const evidence = skillEvidenceMap.get(skill.id) || {
          skillId: skill.id,
          skillName: skill.name,
          sources: [],
          evidenceCount: 0,
          confidence: "LOW",
          details: {},
        };
        evidence.sources.push("RESUME");
        evidence.details.resume = true;
        evidence.evidenceCount++;
        skillEvidenceMap.set(skill.id, evidence);
      }
    }
  }

  // Add GitHub evidence
  if (githubConnection) {
    for (const githubSkill of githubConnection.skillEvidence) {
      const evidence = skillEvidenceMap.get(githubSkill.skillId) || {
        skillId: githubSkill.skillId,
        skillName: githubSkill.skill.name,
        sources: [],
        evidenceCount: 0,
        confidence: "LOW",
        details: {},
      };
      evidence.sources.push("GITHUB");
      evidence.details.github = true;
      evidence.evidenceCount += githubSkill.evidenceCount;
      skillEvidenceMap.set(githubSkill.skillId, evidence);
    }
  }

  // Add LinkedIn evidence
  if (linkedinProfile) {
    for (const linkedinSkill of linkedinProfile.skills) {
      const evidence = skillEvidenceMap.get(linkedinSkill.skillId) || {
        skillId: linkedinSkill.skillId,
        skillName: linkedinSkill.skill.name,
        sources: [],
        evidenceCount: 0,
        confidence: "LOW",
        details: {},
      };
      evidence.sources.push("LINKEDIN");
      evidence.details.linkedin = true;
      evidence.evidenceCount++;
      skillEvidenceMap.set(linkedinSkill.skillId, evidence);
    }
  }

  // Add project evidence
  for (const project of projectRecommendations) {
    for (const skillName of project.skillsDemonstrated) {
      const skill = await prisma.skill.findFirst({
        where: { name: skillName.toLowerCase() },
      });
      if (skill) {
        const evidence = skillEvidenceMap.get(skill.id) || {
          skillId: skill.id,
          skillName: skill.name,
          sources: [],
          evidenceCount: 0,
          confidence: "LOW",
          details: {},
        };
        evidence.sources.push("PROJECT");
        evidence.details.project = true;
        evidence.evidenceCount++;
        skillEvidenceMap.set(skill.id, evidence);
      }
    }
  }

  // Add aptitude evidence
  for (const performance of skillPerformances) {
    const evidence = skillEvidenceMap.get(performance.skillId) || {
      skillId: performance.skillId,
      skillName: performance.skill.name,
      sources: [],
      evidenceCount: 0,
      confidence: "LOW",
      details: {},
    };
    evidence.sources.push("APTITUDE");
    evidence.details.aptitude = true;
    evidence.evidenceCount++;
    skillEvidenceMap.set(performance.skillId, evidence);
  }

  // Add interview evidence (simplified - would need to parse interview answers)
  if (interviewSessions.length > 0) {
    // In a full implementation, you'd parse interview answers to extract skill mentions
    // For now, we'll count interview sessions as general evidence
    for (const skill of studentSkills) {
      const evidence = skillEvidenceMap.get(skill.skillId);
      if (evidence) {
        evidence.sources.push("INTERVIEW");
        evidence.details.interview = true;
        evidence.evidenceCount++;
        skillEvidenceMap.set(skill.skillId, evidence);
      }
    }
  }

  // Calculate confidence levels
  const skillEvidenceArray = Array.from(skillEvidenceMap.values()).map(evidence => {
    const sourceCount = evidence.sources.length;
    const evidenceCount = evidence.evidenceCount;

    if (sourceCount >= 4 || (sourceCount >= 3 && evidenceCount >= 5)) {
      evidence.confidence = "HIGH";
    } else if (sourceCount >= 2 || (sourceCount >= 1 && evidenceCount >= 3)) {
      evidence.confidence = "MEDIUM";
    } else {
      evidence.confidence = "LOW";
    }

    return evidence;
  });

  // Calculate evidence strength
  const evidenceStrength = {
    high: skillEvidenceArray.filter(e => e.confidence === "HIGH").length,
    medium: skillEvidenceArray.filter(e => e.confidence === "MEDIUM").length,
    low: skillEvidenceArray.filter(e => e.confidence === "LOW").length,
  };

  // Calculate source coverage
  const sourceCoverage = {
    resume: skillEvidenceArray.filter(e => e.details.resume).length,
    github: skillEvidenceArray.filter(e => e.details.github).length,
    linkedin: skillEvidenceArray.filter(e => e.details.linkedin).length,
    project: skillEvidenceArray.filter(e => e.details.project).length,
    aptitude: skillEvidenceArray.filter(e => e.details.aptitude).length,
    interview: skillEvidenceArray.filter(e => e.details.interview).length,
  };

  // Store professional evidence in database
  await prisma.$transaction(async (tx) => {
    // Delete old evidence
    await tx.professionalEvidence.deleteMany({
      where: { studentProfileId },
    });

    // Create new evidence records
    for (const evidence of skillEvidenceArray) {
      for (const source of evidence.sources) {
        await tx.professionalEvidence.create({
          data: {
            studentProfileId,
            skillId: evidence.skillId,
            source,
            sourceReference: null, // Could store specific reference IDs
            evidenceType: evidence.confidence === "HIGH" ? "DIRECT" : evidence.confidence === "MEDIUM" ? "INDIRECT" : "INFERRED",
            confidence: evidence.confidence,
            metadata: {
              evidenceCount: evidence.evidenceCount,
              allSources: evidence.sources,
            },
          },
        });
      }
    }
  });

  return {
    studentProfileId,
    totalSkills: skillEvidenceArray.length,
    skillEvidence: skillEvidenceArray,
    evidenceStrength,
    sourceCoverage,
    computedAt: new Date().toISOString(),
  };
}

export async function getProfessionalEvidence(
  studentProfileId: string
): Promise<ProfessionalEvidenceProfile | null> {
  const evidence = await prisma.professionalEvidence.findMany({
    where: { studentProfileId },
    include: { skill: true },
  });

  if (evidence.length === 0) {
    return null;
  }

  // Aggregate evidence by skill
  const skillEvidenceMap = new Map<string, SkillEvidence>();

  for (const record of evidence) {
    const existing = skillEvidenceMap.get(record.skillId);
    if (existing) {
      existing.sources.push(record.source as EvidenceSource);
      existing.evidenceCount++;
      if (record.source === "RESUME") existing.details.resume = true;
      if (record.source === "GITHUB") existing.details.github = true;
      if (record.source === "LINKEDIN") existing.details.linkedin = true;
      if (record.source === "PROJECT") existing.details.project = true;
      if (record.source === "APTITUDE") existing.details.aptitude = true;
      if (record.source === "INTERVIEW") existing.details.interview = true;
    } else {
      skillEvidenceMap.set(record.skillId, {
        skillId: record.skillId,
        skillName: record.skill.name,
        sources: [record.source as EvidenceSource],
        evidenceCount: 1,
        confidence: record.confidence as EvidenceConfidence,
        details: {
          resume: record.source === "RESUME",
          github: record.source === "GITHUB",
          linkedin: record.source === "LINKEDIN",
          project: record.source === "PROJECT",
          aptitude: record.source === "APTITUDE",
          interview: record.source === "INTERVIEW",
        },
      });
    }
  }

  const skillEvidenceArray = Array.from(skillEvidenceMap.values());

  const evidenceStrength = {
    high: skillEvidenceArray.filter(e => e.confidence === "HIGH").length,
    medium: skillEvidenceArray.filter(e => e.confidence === "MEDIUM").length,
    low: skillEvidenceArray.filter(e => e.confidence === "LOW").length,
  };

  const sourceCoverage = {
    resume: skillEvidenceArray.filter(e => e.details.resume).length,
    github: skillEvidenceArray.filter(e => e.details.github).length,
    linkedin: skillEvidenceArray.filter(e => e.details.linkedin).length,
    project: skillEvidenceArray.filter(e => e.details.project).length,
    aptitude: skillEvidenceArray.filter(e => e.details.aptitude).length,
    interview: skillEvidenceArray.filter(e => e.details.interview).length,
  };

  return {
    studentProfileId,
    totalSkills: skillEvidenceArray.length,
    skillEvidence: skillEvidenceArray,
    evidenceStrength,
    sourceCoverage,
    computedAt: new Date().toISOString(),
  };
}
