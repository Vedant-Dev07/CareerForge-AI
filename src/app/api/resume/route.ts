import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || !user.studentProfileId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resumes = await prisma.resume.findMany({
      where: { studentProfileId: user.studentProfileId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        fileName: true,
        fileType: true,
        status: true,
        createdAt: true,
        targetCareer: {
          select: {
            title: true,
          }
        },
        analysis: {
          select: {
            atsScore: true,
            sectionScore: true,
          }
        }
      }
    });

    return NextResponse.json({ resumes });
  } catch (error) {
    console.error("Fetch resumes error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
