import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user?.studentProfileId) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  const job = await prisma.jobOpportunity.findUnique({
    where: { id: params.id },
    include: {
      recommendations: { where: { studentProfileId: user.studentProfileId } },
      applications: { where: { studentProfileId: user.studentProfileId } },
    },
  });
  if (!job) return NextResponse.json({ error: "Job opportunity not found." }, { status: 404 });
  return NextResponse.json({ job });
}
