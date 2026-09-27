import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || !user.studentProfileId) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    const profile = await prisma.linkedInProfile.findUnique({
      where: { studentProfileId: user.studentProfileId },
      include: {
        skills: {
          include: {
            skill: true,
          },
        },
        experience: true,
        education: true,
      },
    });

    if (!profile) {
      return NextResponse.json({ error: "LinkedIn profile not found" }, { status: 404 });
    }

    // Profile Completeness
    const profileCompleteness = {
      hasName: !!profile.name,
      hasHeadline: !!profile.headline,
      hasAbout: !!profile.about && profile.about.length > 50,
      hasLocation: !!profile.location,
      hasSkills: profile.skills.length > 0,
      hasExperience: profile.experience.length > 0,
      hasEducation: profile.education.length > 0,
    };

    const profileCompletenessScore = Object.values(profileCompleteness).reduce((sum, val) => sum + (val ? 1 : 0), 0) / Object.keys(profileCompleteness).length * 100;

    // Skills Analysis
    const skillBreakdown = profile.skills.reduce((acc, skill) => {
      const category = skill.skill.category;
      if (!acc[category]) acc[category] = [];
      acc[category].push({
        name: skill.skill.name,
        proficiency: skill.proficiency,
        endorsements: skill.endorsements,
      });
      return acc;
    }, {} as Record<string, Array<{ name: string; proficiency: string | null; endorsements: number }>>);

    const skillsScore = profile.skills.length > 0
      ? Math.min(100, profile.skills.length * 10)
      : 0;

    // Experience Analysis
    const experienceAnalysis = {
      totalRoles: profile.experience.length,
      currentRoles: profile.experience.filter(e => e.isCurrent).length,
      hasDescriptions: profile.experience.filter(e => e.description && e.description.length > 20).length,
      averageRoleLength: profile.experience.length > 0
        ? profile.experience.reduce((sum, e) => {
            if (e.startDate && e.endDate) {
              return sum + (new Date(e.endDate).getTime() - new Date(e.startDate).getTime());
            }
            return sum;
          }, 0) / profile.experience.length / (365 * 24 * 60 * 60 * 1000)
        : 0,
    };

    const experienceScore = profile.experience.length > 0
      ? (experienceAnalysis.currentRoles * 30 +
         (experienceAnalysis.hasDescriptions / profile.experience.length) * 40 +
         Math.min(30, experienceAnalysis.averageRoleLength * 10))
      : 0;

    // Education Analysis
    const educationAnalysis = {
      totalInstitutions: profile.education.length,
      hasDegrees: profile.education.filter(e => e.degree).length,
      hasFields: profile.education.filter(e => e.field).length,
    };

    const educationScore = profile.education.length > 0
      ? ((educationAnalysis.hasDegrees / profile.education.length) * 50 +
         (educationAnalysis.hasFields / profile.education.length) * 50)
      : 0;

    // Career Alignment
    const studentProfile = await prisma.studentProfile.findUnique({
      where: { id: user.studentProfileId },
      include: {
        targetCareer: {
          include: {
            skillRelations: true,
          },
        },
      },
    });

    const requiredSkills = studentProfile?.targetCareer?.skillRelations.map(s => s.name.toLowerCase()) || [];
    const linkedinSkillNames = profile.skills.map(s => s.skill.name.toLowerCase());
    
    const careerAlignment = {
      relevantSkills: profile.skills.filter(s => requiredSkills.includes(s.skill.name.toLowerCase())),
      missingSkills: requiredSkills.filter(skill => !linkedinSkillNames.includes(skill)),
      alignmentPercentage: requiredSkills.length > 0
        ? (profile.skills.filter(s => requiredSkills.includes(s.skill.name.toLowerCase())).length / requiredSkills.length) * 100
        : 0,
    };

    const careerAlignmentScore = careerAlignment.alignmentPercentage;

    // Evidence Coverage
    const evidenceCoverage = {
      totalSkills: profile.skills.length,
      endorsedSkills: profile.skills.filter(s => s.endorsements > 0).length,
      highlyEndorsedSkills: profile.skills.filter(s => s.endorsements >= 5).length,
      skillsWithProficiency: profile.skills.filter(s => s.proficiency).length,
    };

    const evidenceCoverageScore = profile.skills.length > 0
      ? ((evidenceCoverage.endorsedSkills / profile.skills.length) * 50 +
         (evidenceCoverage.skillsWithProficiency / profile.skills.length) * 50)
      : 0;

    const analytics = {
      profileCompleteness: {
        score: Math.round(profileCompletenessScore),
        details: profileCompleteness,
      },
      skills: {
        score: Math.round(skillsScore),
        details: skillBreakdown,
        totalSkills: profile.skills.length,
      },
      experience: {
        score: Math.round(experienceScore),
        details: experienceAnalysis,
      },
      education: {
        score: Math.round(educationScore),
        details: educationAnalysis,
      },
      careerAlignment: {
        score: Math.round(careerAlignmentScore),
        details: careerAlignment,
      },
      evidenceCoverage: {
        score: Math.round(evidenceCoverageScore),
        details: evidenceCoverage,
      },
    };

    // Overall LinkedIn Score
    const overallScore = Math.round(
      (analytics.profileCompleteness.score * 0.15 +
       analytics.skills.score * 0.25 +
       analytics.experience.score * 0.25 +
       analytics.education.score * 0.15 +
       analytics.careerAlignment.score * 0.10 +
       analytics.evidenceCoverage.score * 0.10)
    );

    return NextResponse.json({
      overallScore,
      analytics,
      lastAnalyzedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("LinkedIn analytics error:", error);
    return NextResponse.json(
      { error: "Failed to calculate LinkedIn analytics" },
      { status: 500 }
    );
  }
}
