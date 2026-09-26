import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || !user.studentProfileId) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  try {
    const allAttempts = await prisma.assessmentAttempt.findMany({
      where: {
        studentProfileId: user.studentProfileId,
      },
      orderBy: { createdAt: 'desc' },
      include: {
        assessment: true,
        answers: {
          include: {
            question: {
              include: {
                skill: true,
              },
            },
          },
        },
      }
    });

    const totalAssessments = allAttempts.length;
    const completedAttempts = allAttempts.filter(a => a.status === 'COMPLETED');
    const testsCompleted = completedAttempts.length;
    
    if (testsCompleted === 0) {
      return NextResponse.json({
        totalAssessments,
        testsCompleted: 0,
        latestScore: null,
        averageScore: null,
        accuracy: null,
        strongestSkills: [],
        weakestSkills: [],
        latestAssessment: null,
        latestWeakSkills: [],
      });
    }

    const latestAssessment = completedAttempts[0];
    const latestScore = latestAssessment.percentage || 0;
    
    const averageScore = Math.round(
      completedAttempts.reduce((sum, attempt) => sum + (attempt.percentage || 0), 0) / testsCompleted
    );
    
    const totalCorrect = completedAttempts.reduce((sum, attempt) => sum + (attempt.correctAnswers || 0), 0);
    const totalAttempted = completedAttempts.reduce((sum, attempt) => 
      sum + (attempt.correctAnswers || 0) + (attempt.incorrectAnswers || 0), 0);
    const accuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : null;

    // Aggregate skill performance across all completed attempts
    const skillMap = new Map<string, { skillName: string, totalQuestions: number, correctAnswers: number }>();
    
    // Also calculate latest weak skills
    const latestSkillMap = new Map<string, { skillName: string, totalQuestions: number, correctAnswers: number }>();

    completedAttempts.forEach(attempt => {
      const isLatest = attempt.id === latestAssessment.id;
      
      attempt.answers.forEach(answer => {
        const skill = answer.question.skill;
        if (!skill) return;

        // Overall
        let stats = skillMap.get(skill.id) || { skillName: skill.name, totalQuestions: 0, correctAnswers: 0 };
        stats.totalQuestions++;
        if (answer.isCorrect) stats.correctAnswers++;
        skillMap.set(skill.id, stats);

        // Latest
        if (isLatest) {
          let latestStats = latestSkillMap.get(skill.id) || { skillName: skill.name, totalQuestions: 0, correctAnswers: 0 };
          latestStats.totalQuestions++;
          if (answer.isCorrect) latestStats.correctAnswers++;
          latestSkillMap.set(skill.id, latestStats);
        }
      });
    });

    const overallSkills = Array.from(skillMap.values()).map(s => ({
      ...s,
      percentage: s.totalQuestions > 0 ? Math.round((s.correctAnswers / s.totalQuestions) * 100) : 0
    }));

    const strongestSkills = overallSkills
      .filter(s => s.percentage >= 80)
      .sort((a, b) => b.percentage - a.percentage);

    const weakestSkills = overallSkills
      .filter(s => s.percentage < 50)
      .sort((a, b) => a.percentage - b.percentage);

    const latestWeakSkills = Array.from(latestSkillMap.values())
      .map(s => ({
        ...s,
        percentage: s.totalQuestions > 0 ? Math.round((s.correctAnswers / s.totalQuestions) * 100) : 0
      }))
      .filter(s => s.percentage < 50)
      .sort((a, b) => a.percentage - b.percentage);

    return NextResponse.json({
      totalAssessments,
      testsCompleted,
      latestScore,
      averageScore,
      accuracy,
      strongestSkills,
      weakestSkills,
      latestAssessment: {
        id: latestAssessment.id,
        assessmentTitle: latestAssessment.assessment.title,
        percentage: latestAssessment.percentage,
        completedAt: latestAssessment.completedAt,
      },
      latestWeakSkills,
    });
  } catch (error) {
    console.error("Error retrieving summary:", error);
    return NextResponse.json({ error: "Failed to retrieve summary." }, { status: 500 });
  }
}