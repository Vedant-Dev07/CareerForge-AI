import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-server";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || !user.studentProfileId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const weakSkills = await prisma.skillPerformance.findMany({
      where: {
        studentProfileId: user.studentProfileId,
        classification: { in: ["CRITICAL", "WEAK", "DEVELOPING"] },
      },
      include: { skill: true },
      orderBy: { accuracy: "asc" },
    });

    const formattedSkills = weakSkills.map((sp) => ({
      skill: sp.skill.name,
      skillId: sp.skillId,
      accuracy: sp.accuracy,
      classification: sp.classification,
      priority: sp.priority,
      correct: sp.correctAnswers,
      incorrect: sp.incorrectAnswers,
    }));

    return NextResponse.json({ skills: formattedSkills });
  } catch (error) {
    console.error("Error fetching weak skills:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
