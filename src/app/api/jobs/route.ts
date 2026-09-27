import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getCurrentUser();
  if (!user?.studentProfileId) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  const jobs = await prisma.jobOpportunity.findMany({ where: { isActive: true }, orderBy: { createdAt: "desc" } });
  return NextResponse.json({ jobs });
}
