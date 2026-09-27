import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-server";
import { getProjectRecommendations } from "@/lib/projects";

export async function GET() {
  const user = await getCurrentUser();
  if (!user?.studentProfileId) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

  try {
    return NextResponse.json({ recommendations: await getProjectRecommendations(user.studentProfileId) });
  } catch (error) {
    console.error("Unable to load project recommendations:", error);
    return NextResponse.json({ error: "Unable to load project recommendations." }, { status: 500 });
  }
}
