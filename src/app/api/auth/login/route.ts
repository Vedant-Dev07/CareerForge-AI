import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession, toClientUser } from "@/lib/auth-server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: string;
      password?: string;
    };

    const email = body.email?.trim().toLowerCase() ?? "";
    const password = body.password ?? "";

    if (!email || !password) {
      return NextResponse.json({ error: "Please enter your email and password." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        passwordHash: true,
        studentProfile: {
          select: {
            id: true,
            profileCompletion: true,
          },
        },
      },
    });

    const passwordValid = user ? await bcrypt.compare(password, user.passwordHash) : false;

    if (!user || !passwordValid) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    createSession(user.id);

    return NextResponse.json({
      user: toClientUser({
        id: user.id,
        name: user.name,
        email: user.email,
        onboardingComplete: (user.studentProfile?.profileCompletion ?? 0) > 0,
        studentProfileId: user.studentProfile?.id ?? null,
      }),
    });
  } catch {
    return NextResponse.json({ error: "Unable to log in." }, { status: 500 });
  }
}
