import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.studentProfileId) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    const body = await request.json();
    const { profileUrl, name, headline, about, location, skills, experience, education } = body;

    if (!profileUrl) {
      return NextResponse.json({ error: "Profile URL is required." }, { status: 400 });
    }

    const result = await prisma.$transaction(async (tx) => {
      // Upsert LinkedIn profile
      const profile = await tx.linkedInProfile.upsert({
        where: { studentProfileId: user.studentProfileId! },
        create: {
          studentProfileId: user.studentProfileId!,
          profileUrl,
          name: name || null,
          headline: headline || null,
          about: about || null,
          location: location || null,
          lastSyncedAt: new Date(),
        },
        update: {
          profileUrl,
          name: name || null,
          headline: headline || null,
          about: about || null,
          location: location || null,
          lastSyncedAt: new Date(),
        },
      });

      // Delete old skills, experience, education
      await tx.linkedInSkill.deleteMany({ where: { profileId: profile.id } });
      await tx.linkedInExperience.deleteMany({ where: { profileId: profile.id } });
      await tx.linkedInEducation.deleteMany({ where: { profileId: profile.id } });

      // Create skills
      if (skills && Array.isArray(skills)) {
        for (const skillData of skills) {
          const skill = await tx.skill.upsert({
            where: { name: skillData.name.toLowerCase() },
            create: { name: skillData.name.toLowerCase(), category: "PROFESSIONAL" },
            update: {},
          });

          await tx.linkedInSkill.create({
            data: {
              profileId: profile.id,
              skillId: skill.id,
              proficiency: skillData.proficiency || null,
              endorsements: skillData.endorsements || 0,
            },
          });
        }
      }

      // Create experience
      if (experience && Array.isArray(experience)) {
        for (const exp of experience) {
          await tx.linkedInExperience.create({
            data: {
              profileId: profile.id,
              company: exp.company,
              title: exp.title,
              description: exp.description || null,
              location: exp.location || null,
              startDate: exp.startDate ? new Date(exp.startDate) : null,
              endDate: exp.endDate ? new Date(exp.endDate) : null,
              isCurrent: exp.isCurrent || false,
            },
          });
        }
      }

      // Create education
      if (education && Array.isArray(education)) {
        for (const edu of education) {
          await tx.linkedInEducation.create({
            data: {
              profileId: profile.id,
              institution: edu.institution,
              degree: edu.degree || null,
              field: edu.field || null,
              startDate: edu.startDate ? new Date(edu.startDate) : null,
              endDate: edu.endDate ? new Date(edu.endDate) : null,
            },
          });
        }
      }

      return {
        profile: {
          id: profile.id,
          name: profile.name,
          headline: profile.headline,
          location: profile.location,
        },
        skillsCreated: skills?.length || 0,
        experienceCreated: experience?.length || 0,
        educationCreated: education?.length || 0,
      };
    });

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error("LinkedIn import error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to import LinkedIn profile" },
      { status: 500 }
    );
  }
}
