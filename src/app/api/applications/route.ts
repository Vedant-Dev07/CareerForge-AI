import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getCurrentUser();
  if (!user?.studentProfileId) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  const applications = await prisma.jobApplication.findMany({ where: { studentProfileId: user.studentProfileId }, include: { job: true }, orderBy: { updatedAt: "desc" } });
  return NextResponse.json({ applications });
}
