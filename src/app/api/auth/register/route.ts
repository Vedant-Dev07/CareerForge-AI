import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession, toClientUser } from "@/lib/auth-server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string;
      email?: string;
      password?: string;
    };

    const name = body.name?.trim() ?? "";
    const email = body.email?.trim().toLowerCase() ?? "";
    const password = body.password ?? "";

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Please complete all fields." }, { status: 400 });
    }

    if (!email.includes("@")) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: {
          name,
          email,
          passwordHash,
        },
      });

      const studentProfile = await tx.studentProfile.create({
        data: {
          userId: createdUser.id,
        },
        select: {
          id: true,
          profileCompletion: true,
        },
      });

      return {
        id: createdUser.id,
        name: createdUser.name,
        email: createdUser.email,
        onboardingComplete: studentProfile.profileCompletion > 0,
        studentProfileId: studentProfile.id,
      };
    });

    createSession(user.id);

    return NextResponse.json({ user: toClientUser(user) }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Unable to create account." }, { status: 500 });
  }
}
