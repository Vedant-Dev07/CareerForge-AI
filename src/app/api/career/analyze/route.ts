import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { ensureCareerRoles } from "@/lib/career-roles";

type AnalyzeInput = {
  careerRoleId?: string;
};

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

    const body = (await request.json()) as AnalyzeInput;
    if (!body.careerRoleId) return NextResponse.json({ error: "Please select a career role." }, { status: 400 });

    const profile = await prisma.studentProfile.findUnique({
      where: { userId: user.id },
      select: {
        id: true,
        studentSkills: { select: { skill: { select: { name: true } } } },
      },
    });
    if (!profile) return NextResponse.json({ error: "Complete your profile before analyzing a career." }, { status: 400 });

    const career = await prisma.careerRole.findUnique({
      where: { id: body.careerRoleId },
      select: { id: true, title: true, skillRelations: { select: { name: true }, orderBy: { name: "asc" } } },
    });
    if (!career) return NextResponse.json({ error: "Career role not found." }, { status: 404 });

    const studentSkills = new Set(profile.studentSkills.map(({ skill }) => skill.name.toLowerCase()));
    const requiredSkills = career.skillRelations.map((skill) => skill.name);
    const matchedSkills = requiredSkills.filter((skill) => studentSkills.has(skill.toLowerCase()));
    const missingSkills = requiredSkills.filter((skill) => !studentSkills.has(skill.toLowerCase()));
    const matchPercentage = requiredSkills.length ? Math.round((matchedSkills.length / requiredSkills.length) * 100) : 0;
    const recommendations = missingSkills.map((skill) => `Learn ${skill}`);

    const analysis = await prisma.$transaction(async (tx) => {
      await tx.studentProfile.update({
        where: { id: profile.id },
        data: { targetCareerId: career.id, targetDomain: career.title },
      });
      return tx.careerAnalysis.create({
        data: {
          studentProfileId: profile.id,
          careerRoleId: career.id,
          matchPercentage,
          matchedSkills,
          missingSkills,
          recommendations,
        },
        select: {
          id: true,
          careerRole: { select: { title: true } },
          matchPercentage: true,
          matchedSkills: true,
          missingSkills: true,
          recommendations: true,
          createdAt: true,
        },
      });
    }, { timeout: 30000 });

    return NextResponse.json({
      analysis: {
        id: analysis.id,
        career: analysis.careerRole.title,
        matchPercentage: analysis.matchPercentage,
        matchedSkills: analysis.matchedSkills,
        missingSkills: analysis.missingSkills,
        recommendations: analysis.recommendations,
        createdAt: analysis.createdAt,
      },
    });
  } catch {
    return NextResponse.json({ error: "Unable to analyze this career." }, { status: 500 });
  }
}
