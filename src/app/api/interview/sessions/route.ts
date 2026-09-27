import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.studentProfileId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { interviewType, difficulty, numQuestions = 5 } = await req.json();

    const profile = await prisma.studentProfile.findUnique({
      where: { id: user.studentProfileId },
      include: {
        targetCareer: true,
        skillPerformances: {
          orderBy: { accuracy: "asc" }
        },
        resumes: {
          orderBy: { createdAt: "desc" },
          take: 1,
          include: { analysis: true }
        }
      }
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Prepare questions array
    const selectedQuestions: { questionText: string, interviewQuestionId?: string }[] = [];

    // Base difficulty query
    let diffFilter = difficulty || "MEDIUM";

    // 1. Fetch available questions based on type
    if (interviewType === "TECHNICAL" || interviewType === "MIXED") {
      // Prioritize weak skills
      const weakSkillIds = profile.skillPerformances
        .filter(sp => sp.classification === "CRITICAL" || sp.classification === "WEAK")
        .map(sp => sp.skillId);

      const techQs = await prisma.interviewQuestion.findMany({
        where: {
          category: "TECHNICAL",
          difficulty: diffFilter,
          isActive: true,
          OR: [
            { careerRoleId: profile.targetCareerId },
            { skillId: { in: weakSkillIds } },
            { careerRoleId: null } // Generic tech questions
          ]
        },
        take: interviewType === "MIXED" ? Math.floor(numQuestions / 2) : numQuestions
      });

      techQs.forEach(q => selectedQuestions.push({ questionText: q.question, interviewQuestionId: q.id }));
    }

    if (interviewType === "HR" || interviewType === "MIXED") {
      const remaining = numQuestions - selectedQuestions.length;
      if (remaining > 0) {
        const hrQs = await prisma.interviewQuestion.findMany({
          where: {
            category: { in: ["HR", "BEHAVIORAL"] },
            difficulty: diffFilter,
            isActive: true
          },
          take: remaining
        });
        hrQs.forEach(q => selectedQuestions.push({ questionText: q.question, interviewQuestionId: q.id }));
      }
    }

    if (interviewType === "RESUME_BASED") {
      const resume = profile.resumes[0];
      if (resume && resume.analysis) {
        // Generate dynamic questions based on resume
        const matchedSkills = resume.analysis.matchedSkills || [];
        const missingSkills = resume.analysis.missingSkills || [];
        
        matchedSkills.slice(0, 2).forEach((skill: string) => {
          selectedQuestions.push({ questionText: `Your resume mentions experience with ${skill}. Can you describe a challenging problem you solved using this technology?` });
        });
        
        selectedQuestions.push({ questionText: "Can you walk me through the architecture of the main project listed on your resume?" });
        selectedQuestions.push({ questionText: `I noticed you don't have ${missingSkills[0] || 'certain skills'} explicitly listed. How do you plan to handle tasks requiring this?` });
        selectedQuestions.push({ questionText: "What was your biggest professional or academic achievement highlighted in this resume?" });
      } else {
        selectedQuestions.push({ questionText: "Can you walk me through your resume and highlight your key experiences?" });
      }
    }

    // Fill remaining with generic questions if needed
    while (selectedQuestions.length < numQuestions) {
      selectedQuestions.push({ questionText: "Can you tell me a little bit about yourself?" });
    }

    // Truncate if we over-fetched
    const finalQuestions = selectedQuestions.slice(0, numQuestions);

    // Create session
    const session = await prisma.interviewSession.create({
      data: {
        studentProfileId: profile.id,
        interviewType,
        difficulty: diffFilter,
        numQuestions: finalQuestions.length,
        targetRole: profile.targetCareer?.title || "General",
        answers: {
          create: finalQuestions.map(q => ({
            questionText: q.questionText,
            interviewQuestionId: q.interviewQuestionId
          }))
        }
      },
      include: {
        answers: true
      }
    });

    return NextResponse.json({ success: true, session });
  } catch (error) {
    console.error("Interview session creation error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || !user.studentProfileId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sessions = await prisma.interviewSession.findMany({
      where: { studentProfileId: user.studentProfileId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, sessions });
  } catch (error) {
    console.error("Interview sessions fetch error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
