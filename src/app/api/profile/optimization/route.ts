import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-server";
import { calculateProfileOptimization } from "@/lib/profile-optimization";

export async function GET() {
  const user = await getCurrentUser();
  if (!user?.studentProfileId) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  try {
    return NextResponse.json(await calculateProfileOptimization(user.studentProfileId));
  } catch (error) {
    console.error("Unable to calculate profile optimization:", error);
    return NextResponse.json({ error: "Unable to calculate profile optimization." }, { status: 500 });
  }
}
