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
    return NextResponse.json(readiness);
  } catch (error) {
    console.error("Unable to calculate readiness:", error);
    return NextResponse.json({ error: "Unable to calculate readiness." }, { status: 500 });
  }
}
