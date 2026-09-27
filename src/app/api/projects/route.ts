import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getCurrentUser();
  if (!user?.studentProfileId) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

  const profile = await prisma.studentProfile.findUnique({ where: { id: user.studentProfileId }, select: { targetCareerId: true } });
  const projects = await prisma.project.findMany({
    where: profile?.targetCareerId ? { OR: [{ careerRoleId: profile.targetCareerId }, { careerRoleId: null }] } : {},
    include: { careerRole: { select: { title: true } }, skillRelations: { select: { name: true } } },
    orderBy: [{ difficulty: "asc" }, { title: "asc" }],
  });
  return NextResponse.json({ projects });
}
