import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-server";
import { getRecommendedJobs, refreshJobRecommendations } from "@/lib/jobs";

export async function GET() {
  const user = await getCurrentUser();
  if (!user?.studentProfileId) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  try {
    return NextResponse.json({ recommendations: await getRecommendedJobs(user.studentProfileId) });
  } catch (error) {
    console.error("Unable to load recommended jobs:", error);
    return NextResponse.json({ error: "Unable to load recommended jobs." }, { status: 500 });
  }
}

export async function POST() {
  const user = await getCurrentUser();
  if (!user?.studentProfileId) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  try {
    return NextResponse.json({ recommendations: await refreshJobRecommendations(user.studentProfileId) });
  } catch (error) {
    console.error("Unable to refresh recommended jobs:", error);
    return NextResponse.json({ error: "Unable to refresh recommended jobs." }, { status: 500 });
  }
}
