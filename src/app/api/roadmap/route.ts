import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-server";
import { generateRoadmap, getStudentRoadmap } from "@/lib/roadmap";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    if (!user.studentProfileId) return NextResponse.json({ roadmap: null });
    const roadmap = await getStudentRoadmap(user.studentProfileId);
    return NextResponse.json({ roadmap });
  } catch {
    return NextResponse.json({ error: "Unable to load your roadmap." }, { status: 500 });
  }
}

export async function POST() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    if (!user.studentProfileId) return NextResponse.json({ error: "Complete your profile first." }, { status: 400 });
    const roadmap = await generateRoadmap(user.studentProfileId);
    if (!roadmap) {
      return NextResponse.json({ error: "Run a career analysis before generating a roadmap." }, { status: 400 });
    }
    return NextResponse.json({ roadmap }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Unable to generate your roadmap." }, { status: 500 });
  }
}
