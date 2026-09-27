import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-server";
import { refreshProjectRecommendations } from "@/lib/projects";

export async function POST() {
  const user = await getCurrentUser();
  if (!user?.studentProfileId) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

  try {
    return NextResponse.json({ recommendations: await refreshProjectRecommendations(user.studentProfileId) });
  } catch (error) {
    console.error("Unable to refresh project recommendations:", error);
    return NextResponse.json({ error: "Unable to refresh project recommendations." }, { status: 500 });
  }
}
