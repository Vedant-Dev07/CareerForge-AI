import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-server";
import { calculateReadiness, storeDailyReadinessSnapshot } from "@/lib/readiness";

export async function GET() {
  const user = await getCurrentUser();
  if (!user?.studentProfileId) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  try {
    const readiness = await calculateReadiness(user.studentProfileId);
    await storeDailyReadinessSnapshot(user.studentProfileId, readiness);
    return NextResponse.json({
      overallScore: readiness.overallScore,
      resumeScore: readiness.metrics.resume.score,
      aptitudeScore: readiness.metrics.aptitude.score,
      interviewScore: readiness.metrics.interview.score,
      roadmapProgress: readiness.metrics.learning.score,
      projectScore: readiness.metrics.projects.score,
      skillScore: readiness.metrics.skills.score,
      weakSkillCount: readiness.weakSkillCount,
      recommendations: readiness.recommendations,
      computedAt: readiness.computedAt,
    });
  } catch (error) {
    console.error("Unable to calculate readiness summary:", error);
    return NextResponse.json({ error: "Unable to calculate readiness summary." }, { status: 500 });
  }
}
