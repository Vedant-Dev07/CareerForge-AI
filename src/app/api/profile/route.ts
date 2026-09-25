import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";

type ProfileInput = {
  phone?: string;
  location?: string;
  college?: string;
  degree?: string;
  branch?: string;
  year?: string;
  cgpa?: string;
  skills?: string;
  targetRole?: string;
  interests?: string;
  preferredDomain?: string;
  preferredJobType?: string;
  programmingLanguages?: string;
  frameworks?: string;
  databases?: string;
  tools?: string;
  certifications?: string;
  projects?: string;
  experience?: string;
  github?: string;
  linkedin?: string;
  portfolio?: string;
};

function parseSkills(value: string) {
  return [...new Set(value.split(",").map((skill) => skill.trim()).filter(Boolean))];
}

function validateInput(body: ProfileInput) {
  const profile = {
    phone: body.phone?.trim() ?? "",
    location: body.location?.trim() ?? "",
    college: body.college?.trim() ?? "",
    degree: body.degree?.trim() ?? "",
    branch: body.branch?.trim() ?? "",
    year: body.year?.trim() ?? "",
    cgpa: body.cgpa?.trim() ?? "",
    skills: body.skills?.trim() ?? "",
    targetRole: body.targetRole?.trim() ?? "",
    interests: body.interests?.trim() ?? "",
    preferredDomain: body.preferredDomain?.trim() ?? "",
    preferredJobType: body.preferredJobType?.trim() ?? "",
    programmingLanguages: body.programmingLanguages?.trim() ?? "",
    frameworks: body.frameworks?.trim() ?? "",
    databases: body.databases?.trim() ?? "",
    tools: body.tools?.trim() ?? "",
    certifications: body.certifications?.trim() ?? "",
    projects: body.projects?.trim() ?? "",
    experience: body.experience?.trim() ?? "",
    github: body.github?.trim() ?? "",
    linkedin: body.linkedin?.trim() ?? "",
    portfolio: body.portfolio?.trim() ?? "",
  };
  const skills = parseSkills(profile.skills);
  const graduationYear = Number.parseInt(profile.year, 10);

  if (!profile.college || !profile.degree || !profile.year || !skills.length || !profile.targetRole) {
    return { error: "Please fill in your college, degree, year, skills, and target role." };
  }

  if (!/^\d{4}$/.test(profile.year) || !Number.isInteger(graduationYear) || graduationYear < 1900 || graduationYear > 2100) {
    return { error: "Please enter a valid graduation year." };
  }

  const cgpa = profile.cgpa ? Number.parseFloat(profile.cgpa) : null;
  if (cgpa !== null && (!Number.isFinite(cgpa) || cgpa < 0 || cgpa > 10)) {
    return { error: "CGPA must be a number between 0 and 10." };
  }

  return { profile, skills, graduationYear, cgpa };
}

async function getUser() {
  const user = await getCurrentUser();
  return user;
}

export async function GET() {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

    const profile = await prisma.studentProfile.findUnique({
      where: { userId: user.id },
      select: {
        college: true,
        phone: true,
        location: true,
        degree: true,
        branch: true,
        graduationYear: true,
        cgpa: true,
        careerGoal: true,
        targetDomain: true,
        preferredDomain: true,
        preferredJobType: true,
        programmingLanguages: true,
        frameworks: true,
        databases: true,
        tools: true,
        certifications: true,
        projects: true,
        experience: true,
        github: true,
        linkedin: true,
        portfolio: true,
        profileCompletion: true,
        targetCareer: { select: { id: true, title: true } },
        careerAnalyses: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: {
            matchPercentage: true,
            matchedSkills: true,
            missingSkills: true,
            recommendations: true,
            careerRole: { select: { title: true } },
          },
        },
        resumes: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: {
            analysis: {
              select: {
                atsScore: true,
              }
            }
          }
        },
        studentSkills: { select: { skill: { select: { name: true } } }, orderBy: { createdAt: "asc" } },
      },
    });

    const skills = profile?.studentSkills.map(({ skill }) => skill.name) ?? [];
    const targetRole = profile?.targetDomain ?? "";
    const latestAnalysis = profile?.careerAnalyses[0] ?? null;
    const latestResumeAnalysis = profile?.resumes[0]?.analysis ?? null;
    const fit = latestAnalysis?.matchPercentage ?? (targetRole ? Math.min(95, Math.max(35, (skills.length * 10) + 35)) : 0);
    const recommendations = targetRole
      ? [
          { role: targetRole, fit, proof: `Your profile is aligned with your target role and ${skills.length} recorded skill${skills.length === 1 ? "" : "s"}.` },
          { role: "Software Engineer", fit: Math.max(35, fit - 5), proof: "A broad engineering path based on your profile and technical skills." },
          { role: "Frontend Developer", fit: Math.max(30, fit - 10), proof: "A strong option when your interests include product interfaces and web development." },
        ].filter((item, index, items) => items.findIndex((candidate) => candidate.role.toLowerCase() === item.role.toLowerCase()) === index)
      : [];

    return NextResponse.json({
      profile: {
        phone: profile?.phone ?? "",
        location: profile?.location ?? "",
        college: profile?.college ?? "",
        degree: profile?.degree ?? "",
        branch: profile?.branch ?? "",
        year: profile?.graduationYear?.toString() ?? "",
        cgpa: profile?.cgpa?.toString() ?? "",
        skills: skills.join(", "),
        targetRole,
        interests: profile?.careerGoal ?? "",
        preferredDomain: profile?.preferredDomain ?? "",
        preferredJobType: profile?.preferredJobType ?? "",
        programmingLanguages: profile?.programmingLanguages ?? "",
        frameworks: profile?.frameworks ?? "",
        databases: profile?.databases ?? "",
        tools: profile?.tools ?? "",
        certifications: profile?.certifications ?? "",
        projects: profile?.projects ?? "",
        experience: profile?.experience ?? "",
        github: profile?.github ?? "",
        linkedin: profile?.linkedin ?? "",
        portfolio: profile?.portfolio ?? "",
        targetCareerId: profile?.targetCareer?.id ?? "",
      },
      summary: {
        skills,
        skillCount: skills.length,
        careerFit: fit,
        profileComplete: (profile?.profileCompletion ?? 0) > 0,
        recommendations,
        resumeScore: latestResumeAnalysis?.atsScore ?? null,
        analysis: latestAnalysis
          ? {
              career: latestAnalysis.careerRole.title,
              matchPercentage: latestAnalysis.matchPercentage,
              matchedSkills: latestAnalysis.matchedSkills,
              missingSkills: latestAnalysis.missingSkills,
              recommendations: latestAnalysis.recommendations,
            }
          : null,
      },
    });
  } catch {
    return NextResponse.json({ error: "Unable to load your profile." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

    const body = (await request.json()) as ProfileInput;
    const validated = validateInput(body);
    if ("error" in validated) return NextResponse.json({ error: validated.error }, { status: 400 });

    const { profile, skills, graduationYear, cgpa } = validated;
    const targetCareer = profile.targetRole
      ? await prisma.careerRole.findFirst({ where: { title: { equals: profile.targetRole, mode: "insensitive" } }, select: { id: true } })
      : null;
    await prisma.$transaction(async (tx) => {
      const studentProfile = await tx.studentProfile.upsert({
        where: { userId: user.id },
        create: {
          userId: user.id,
          phone: profile.phone || null,
          location: profile.location || null,
          college: profile.college,
          degree: profile.degree,
          branch: profile.branch || null,
          graduationYear,
          cgpa,
          careerGoal: profile.interests || null,
          targetDomain: profile.targetRole,
          preferredDomain: profile.preferredDomain || null,
          preferredJobType: profile.preferredJobType || null,
          programmingLanguages: profile.programmingLanguages || null,
          frameworks: profile.frameworks || null,
          databases: profile.databases || null,
          tools: profile.tools || null,
          certifications: profile.certifications || null,
          projects: profile.projects || null,
          experience: profile.experience || null,
          github: profile.github || null,
          linkedin: profile.linkedin || null,
          portfolio: profile.portfolio || null,
          targetCareerId: targetCareer?.id ?? null,
          profileCompletion: 100,
        },
        update: {
          phone: profile.phone || null,
          location: profile.location || null,
          college: profile.college,
          degree: profile.degree,
          branch: profile.branch || null,
          graduationYear,
          cgpa,
          careerGoal: profile.interests || null,
          targetDomain: profile.targetRole,
          preferredDomain: profile.preferredDomain || null,
          preferredJobType: profile.preferredJobType || null,
          programmingLanguages: profile.programmingLanguages || null,
          frameworks: profile.frameworks || null,
          databases: profile.databases || null,
          tools: profile.tools || null,
          certifications: profile.certifications || null,
          projects: profile.projects || null,
          experience: profile.experience || null,
          github: profile.github || null,
          linkedin: profile.linkedin || null,
          portfolio: profile.portfolio || null,
          targetCareerId: targetCareer?.id ?? null,
          profileCompletion: 100,
        },
      });

      await tx.studentSkill.deleteMany({ where: { studentProfileId: studentProfile.id } });
      for (const name of skills) {
        const skill = await tx.skill.upsert({
          where: { name: name.toLowerCase() },
          create: { name: name.toLowerCase(), category: "GENERAL" },
          update: {},
        });
        await tx.studentSkill.create({
          data: { studentProfileId: studentProfile.id, skillId: skill.id, level: "BEGINNER" },
        });
      }
    }, { timeout: 30000 });

    return NextResponse.json({ message: "Profile saved successfully." });
  } catch {
    return NextResponse.json({ error: "Unable to save your profile." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  return PUT(request);
}
