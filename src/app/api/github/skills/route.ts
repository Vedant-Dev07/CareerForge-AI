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
        skillEvidence: {
          include: {
            skill: true,
          },
          orderBy: {
            evidenceCount: "desc",
          },
        },
      },
    });

    if (!connection) {
      return NextResponse.json({ error: "GitHub not connected" }, { status: 404 });
    }

    // Get student's target career for alignment
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

    const skills = connection.skillEvidence.map(evidence => ({
      id: evidence.skill.id,
      name: evidence.skill.name,
      category: evidence.skill.category,
      confidence: evidence.confidence,
      evidenceCount: evidence.evidenceCount,
      repositoryIds: evidence.repositoryIds,
      isCareerRelevant: requiredSkills.includes(evidence.skill.name.toLowerCase()),
    }));

    // Group by confidence
    const byConfidence = {
      high: skills.filter(s => s.confidence === "HIGH"),
      medium: skills.filter(s => s.confidence === "MEDIUM"),
      low: skills.filter(s => s.confidence === "LOW"),
    };

    // Career alignment
    const careerAlignment = {
      relevant: skills.filter(s => s.isCareerRelevant),
      missing: requiredSkills.filter(
        skill => !skills.some(s => s.name.toLowerCase() === skill)
      ),
      stronglyDemonstrated: skills.filter(s => s.isCareerRelevant && s.confidence === "HIGH"),
    };

    return NextResponse.json({
      skills,
      byConfidence,
      careerAlignment,
      totalSkills: skills.length,
      careerRelevantSkills: careerAlignment.relevant.length,
      stronglyDemonstratedSkills: careerAlignment.stronglyDemonstrated.length,
    });
  } catch (error) {
    console.error("GitHub skills error:", error);
    return NextResponse.json(
      { error: "Failed to fetch GitHub skills" },
      { status: 500 }
    );
  }
}
