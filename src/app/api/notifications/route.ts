import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || !user.studentProfileId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if we generated a daily suggestion today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const dailyNotification = await prisma.notification.findFirst({
      where: {
        studentProfileId: user.studentProfileId,
        type: "INFO",
        createdAt: { gte: startOfDay },
        title: { contains: "Daily" }
      }
    });

    if (!dailyNotification) {
      // Auto-generate daily suggestions based on gaps
      const roadmap = await prisma.learningRoadmap.findFirst({
        where: { studentProfileId: user.studentProfileId, status: "IN_PROGRESS" },
        include: { tasks: { where: { status: "NOT_STARTED" }, take: 1 } }
      });

      let suggestionMsg = "Keep up the great work! Make sure to review your skills today.";
      if (roadmap && roadmap.tasks.length > 0) {
        suggestionMsg = `Suggestion: Focus on your task "${roadmap.tasks[0].title}" today. Check the roadmap for guidelines.`;
      }

      await prisma.notification.create({
        data: {
          studentProfileId: user.studentProfileId,
          title: "Daily Guideline & Suggestion",
          message: suggestionMsg,
          type: "INFO"
        }
      });
    }

    const notifications = await prisma.notification.findMany({
      where: { studentProfileId: user.studentProfileId },
      orderBy: { createdAt: "desc" },
      take: 20
    });

    return NextResponse.json({ notifications });
  } catch (error) {
    console.error("Notifications GET error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
