import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.studentProfileId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { missingSkills } = await req.json();

    if (!missingSkills || !Array.isArray(missingSkills)) {
      return NextResponse.json({ error: "Invalid missing skills provided" }, { status: 400 });
    }

    const roadmap = await prisma.learningRoadmap.findFirst({
      where: { studentProfileId: user.studentProfileId },
      include: { tasks: true },
      orderBy: { createdAt: "desc" }
    });

    if (!roadmap) {
      return NextResponse.json({ error: "Roadmap not found. Generate one first." }, { status: 404 });
    }

    const existingTaskTitles = roadmap.tasks.map(t => t.title.toLowerCase());
    let addedCount = 0;

    for (const skill of missingSkills) {
      const taskTitle = `Master ${skill}`;
      if (!existingTaskTitles.includes(taskTitle.toLowerCase())) {
        await prisma.roadmapTask.create({
          data: {
            roadmapId: roadmap.id,
            title: taskTitle,
            description: `This skill was identified as missing from your resume for your target career. Learn and practice ${skill}.`,
            category: "SKILL",
            difficulty: "MEDIUM",
            estimatedMinutes: 600,
            status: "NOT_STARTED",
          }
        });
        addedCount++;
      }
    }
    
    // Recalculate progress
    const updatedTasks = await prisma.roadmapTask.findMany({ where: { roadmapId: roadmap.id }});
    const completedTasks = updatedTasks.filter(t => t.status === "COMPLETED").length;
    const progress = updatedTasks.length > 0 ? Math.round((completedTasks / updatedTasks.length) * 100) : 0;
    
    await prisma.learningRoadmap.update({
      where: { id: roadmap.id },
      data: { progress }
    });

    return NextResponse.json({ addedCount });
  } catch (error) {
    console.error("Update roadmap error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
