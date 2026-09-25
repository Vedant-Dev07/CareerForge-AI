import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

  const roles = await prisma.careerRole.findMany({
    select: {
      id: true,
      title: true,
      domain: true,
      description: true,
      skillRelations: { select: { name: true }, orderBy: { name: "asc" } },
    },
    orderBy: { title: "asc" },
  });

  return NextResponse.json({
    roles: roles.map((role) => ({
      id: role.id,
      title: role.title,
      domain: role.domain,
      description: role.description,
      requiredSkills: role.skillRelations.map((skill) => skill.name),
    })),
  });
}
