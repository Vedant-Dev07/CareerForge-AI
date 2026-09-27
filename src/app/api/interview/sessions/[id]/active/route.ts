import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.studentProfileId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await prisma.interviewSession.findUnique({
      where: { id: params.id },
      include: {
        answers: {
          orderBy: { createdAt: "asc" }
        }
      }
    });

    if (!session || session.studentProfileId !== user.studentProfileId) {
      return NextResponse.json({ error: "Session not found or forbidden" }, { status: 404 });
    }

    return NextResponse.json({ success: true, session });
  } catch (error) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
