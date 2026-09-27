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
      select: {
        id: true,
        username: true,
        lastSyncedAt: true,
        isActive: true,
        createdAt: true,
        repositories: {
          select: {
            id: true,
            repositoryId: true,
            name: true,
            fullName: true,
            description: true,
            url: true,
            primaryLanguage: true,
            stars: true,
            forks: true,
            topics: true,
            isPublic: true,
            hasReadme: true,
            readmeLength: true,
            hasLicense: true,
            createdAt: true,
            updatedAt: true,
            pushedAt: true,
          },
          orderBy: { stars: "desc" },
        },
        skillEvidence: {
          select: {
            id: true,
            skill: {
              select: {
                id: true,
                name: true,
                category: true,
              },
            },
            confidence: true,
            evidenceCount: true,
            repositoryIds: true,
          },
        },
      },
    });

    if (!connection) {
      return NextResponse.json({ error: "GitHub not connected" }, { status: 404 });
    }

    // Calculate profile metrics
    const profileMetrics = {
      totalRepositories: connection.repositories.length,
      publicRepositories: connection.repositories.filter(r => r.isPublic).length,
      totalStars: connection.repositories.reduce((sum, r) => sum + r.stars, 0),
      totalForks: connection.repositories.reduce((sum, r) => sum + r.forks, 0),
      repositoriesWithReadme: connection.repositories.filter(r => r.hasReadme).length,
      repositoriesWithLicense: connection.repositories.filter(r => r.hasLicense).length,
      uniqueLanguages: new Set(connection.repositories.map(r => r.primaryLanguage).filter(Boolean)).size,
      totalSkills: connection.skillEvidence.length,
      highConfidenceSkills: connection.skillEvidence.filter(s => s.confidence === "HIGH").length,
    };

    return NextResponse.json({
      connection: {
        id: connection.id,
        username: connection.username,
        lastSyncedAt: connection.lastSyncedAt,
        isActive: connection.isActive,
        connectedAt: connection.createdAt,
      },
      metrics: profileMetrics,
      repositories: connection.repositories,
      skills: connection.skillEvidence,
    });
  } catch (error) {
    console.error("GitHub profile error:", error);
    return NextResponse.json(
      { error: "Failed to fetch GitHub profile" },
      { status: 500 }
    );
  }
}
