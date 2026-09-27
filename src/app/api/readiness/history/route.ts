import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getCurrentUser();
  if (!user?.studentProfileId) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  try {
    const snapshots = await prisma.readinessScore.findMany({
      where: { studentProfileId: user.studentProfileId },
      orderBy: { createdAt: "asc" },
      select: { createdAt: true, overallScore: true },
    });
    return NextResponse.json({
      history: snapshots.map((snapshot) => ({ date: snapshot.createdAt.toISOString(), readiness: snapshot.overallScore })),
    });
  } catch (error) {
    console.error("Unable to load readiness history:", error);
    return NextResponse.json({ error: "Unable to load readiness history." }, { status: 500 });
  }
}
