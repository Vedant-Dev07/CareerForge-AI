import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-server";
import { refreshRoadmapWithNewGaps } from "@/lib/roadmap";

/**
 * POST /api/roadmap/refresh
 *
 * Merges new aptitude weak skills and resume gaps into the student's
 * existing roadmap without overwriting already-completed tasks.
 * Creates a roadmap first if one does not yet exist.
 */
export async function POST() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }
    if (!user.studentProfileId) {
      return NextResponse.json(
        { error: "Complete your profile first." },
        { status: 400 }
      );
    }

    const roadmap = await refreshRoadmapWithNewGaps(user.studentProfileId);

    if (!roadmap) {
      return NextResponse.json(
        { error: "Run a career analysis before refreshing your roadmap." },
        { status: 400 }
      );
    }

    return NextResponse.json({ roadmap });
  } catch (err) {
    console.error("[roadmap/refresh] error:", err);
    return NextResponse.json(
      { error: "Unable to refresh your roadmap." },
      { status: 500 }
    );
  }
}
