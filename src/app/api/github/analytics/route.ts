import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || !user.studentProfileId) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    const connection = await prisma.gitHubConnection.findUnique({
      where: { studentProfileId: user.studentProfileId },
      include: {
        repositories: true,
        skillEvidence: {
          include: {
            skill: true,
          },
        },
      },
    });

    if (!connection) {
      return NextResponse.json({ error: "GitHub not connected" }, { status: 404 });
    }

    const repos = connection.repositories;
    const skills = connection.skillEvidence;

    // Profile Completeness
    const profileCompleteness = {
      hasBio: false, // Would need to store bio from GitHub API
      hasAvatar: false, // Would need to store avatar
      hasRepositories: repos.length > 0,
      hasActivity: repos.some(r => r.pushedAt && new Date(r.pushedAt) > new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)),
      hasReadmes: repos.filter(r => r.hasReadme).length / Math.max(1, repos.length),
      hasLicenses: repos.filter(r => r.hasLicense).length / Math.max(1, repos.length),
    };

    const profileCompletenessValues = Object.values(profileCompleteness);
    let completenessSum = 0;
    for (const val of profileCompletenessValues) {
      if (typeof val === "boolean") {
        completenessSum += val ? 1 : 0;
      } else {
        completenessSum += val;
      }
    }
    const profileCompletenessScore = (completenessSum / profileCompletenessValues.length) * 100;

    // Repository Activity
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);

    const recentActivity = repos.filter(r => r.pushedAt && new Date(r.pushedAt) > thirtyDaysAgo).length;
    const moderateActivity = repos.filter(r => r.pushedAt && new Date(r.pushedAt) > ninetyDaysAgo).length;
    const yearlyActivity = repos.filter(r => r.pushedAt && new Date(r.pushedAt) > oneYearAgo).length;

    const activityScore = repos.length > 0 
      ? (recentActivity * 100 + moderateActivity * 50 + yearlyActivity * 25) / (repos.length * 100) * 100
      : 0;

    // Technical Skills
    const skillBreakdown = skills.reduce((acc, skill) => {
      const category = skill.skill.category;
      if (!acc[category]) acc[category] = [];
      acc[category].push({
        name: skill.skill.name,
        confidence: skill.confidence,
        evidenceCount: skill.evidenceCount,
      });
      return acc;
    }, {} as Record<string, Array<{ name: string; confidence: string; evidenceCount: number }>>);

    const technicalSkillsScore = skills.length > 0
      ? (skills.filter(s => s.confidence === "HIGH").length * 100 +
         skills.filter(s => s.confidence === "MEDIUM").length * 50) / skills.length
      : 0;

    // Project Quality
    const qualityMetrics = {
      readmeCoverage: repos.length > 0 ? repos.filter(r => r.hasReadme).length / repos.length : 0,
      licenseCoverage: repos.length > 0 ? repos.filter(r => r.hasLicense).length / repos.length : 0,
      averageReadmeLength: repos.length > 0 
        ? repos.reduce((sum, r) => sum + (r.readmeLength || 0), 0) / repos.length 
        : 0,
      starredRepos: repos.filter(r => r.stars > 0).length,
      forkedRepos: repos.filter(r => r.forks > 0).length,
    };

    const projectQualityScore = (
      qualityMetrics.readmeCoverage * 40 +
      qualityMetrics.licenseCoverage * 20 +
      (qualityMetrics.starredRepos / Math.max(1, repos.length)) * 20 +
      (qualityMetrics.forkedRepos / Math.max(1, repos.length)) * 20
    );

    // Consistency
    const repoCreationDates = repos.map(r => new Date(r.createdAt)).sort((a, b) => a.getTime() - b.getTime());
    const consistencyScore = repoCreationDates.length > 1
      ? Math.min(100, (repoCreationDates.length / Math.max(1, 
          (repoCreationDates[repoCreationDates.length - 1].getTime() - repoCreationDates[0].getTime()) / (30 * 24 * 60 * 60 * 1000)
        )) * 100)
      : repos.length > 0 ? 50 : 0;

    // Documentation
    const documentationScore = repos.length > 0
      ? (repos.filter(r => r.hasReadme && r.readmeLength && r.readmeLength > 500).length / repos.length) * 100
      : 0;

    // Collaboration
    const collaborationScore = repos.length > 0
      ? (repos.filter(r => r.forks > 0 || r.stars > 0).length / repos.length) * 100
      : 0;

    // Technology Diversity
    const uniqueLanguages = new Set(repos.map(r => r.primaryLanguage).filter(Boolean)).size;
    const technologyDiversityScore = Math.min(100, uniqueLanguages * 20);

    // Career Alignment (simplified - would need target career)
    const careerAlignmentScore = 50; // Placeholder

    const analytics = {
      profileCompleteness: {
        score: Math.round(profileCompletenessScore),
        details: profileCompleteness,
      },
      repositoryActivity: {
        score: Math.round(activityScore),
        details: {
          recentActivity,
          moderateActivity,
          yearlyActivity,
          totalRepositories: repos.length,
        },
      },
      technicalSkills: {
        score: Math.round(technicalSkillsScore),
        details: skillBreakdown,
        totalSkills: skills.length,
      },
      projectQuality: {
        score: Math.round(projectQualityScore),
        details: qualityMetrics,
      },
      consistency: {
        score: Math.round(consistencyScore),
      },
      documentation: {
        score: Math.round(documentationScore),
      },
      collaboration: {
        score: Math.round(collaborationScore),
      },
      technologyDiversity: {
        score: Math.round(technologyDiversityScore),
        details: {
          uniqueLanguages,
          totalRepositories: repos.length,
        },
      },
      careerAlignment: {
        score: careerAlignmentScore,
      },
    };

    // Overall GitHub Score
    const overallScore = Math.round(
      (analytics.profileCompleteness.score * 0.1 +
       analytics.repositoryActivity.score * 0.15 +
       analytics.technicalSkills.score * 0.25 +
       analytics.projectQuality.score * 0.15 +
       analytics.consistency.score * 0.1 +
       analytics.documentation.score * 0.1 +
       analytics.collaboration.score * 0.05 +
       analytics.technologyDiversity.score * 0.1)
    );

    return NextResponse.json({
      overallScore,
      analytics,
      lastAnalyzedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("GitHub analytics error:", error);
    return NextResponse.json(
      { error: "Failed to calculate GitHub analytics" },
      { status: 500 }
    );
  }
}
