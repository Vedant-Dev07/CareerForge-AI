import "server-only";

import { createHmac, randomBytes, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const SESSION_COOKIE = "careerforge-session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export type SafeUser = {
  id: string;
  name: string;
  email: string;
  onboardingComplete: boolean;
  studentProfileId: string | null;
};

function getSessionSecret() {
  const secret = process.env.SESSION_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error("SESSION_SECRET must be set to at least 32 characters.");
  }

  return secret;
}

function sign(value: string) {
  return createHmac("sha256", getSessionSecret()).update(value).digest("base64url");
}

function encodeSession(userId: string) {
  const payload = JSON.stringify({
    userId,
    nonce: randomBytes(16).toString("base64url"),
    exp: Date.now() + SESSION_MAX_AGE_SECONDS * 1000,
  });
  const body = Buffer.from(payload).toString("base64url");
  return `${body}.${sign(body)}`;
}

function decodeSession(token?: string): { userId: string } | null {
  if (!token) return null;

  const [body, signature] = token.split(".");
  if (!body || !signature) return null;

  const expected = sign(body);
  const expectedBuffer = Buffer.from(expected);
  const signatureBuffer = Buffer.from(signature);

  if (
    expectedBuffer.length !== signatureBuffer.length ||
    !timingSafeEqual(expectedBuffer, signatureBuffer)
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as {
      userId?: string;
      exp?: number;
    };

    if (!payload.userId || !payload.exp || payload.exp < Date.now()) return null;
    return { userId: payload.userId };
  } catch {
    return null;
  }
}

export function createSession(userId: string) {
  cookies().set(SESSION_COOKIE, encodeSession(userId), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export function destroySession() {
  cookies().set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function getCurrentUser(): Promise<SafeUser | null> {
  const session = decodeSession(cookies().get(SESSION_COOKIE)?.value);
  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      name: true,
      email: true,
      studentProfile: {
        select: {
          id: true,
          profileCompletion: true,
        },
      },
    },
  });

  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    onboardingComplete: (user.studentProfile?.profileCompletion ?? 0) > 0,
    studentProfileId: user.studentProfile?.id ?? null,
  };
}

export function toClientUser(user: SafeUser) {
  return {
    name: user.name,
    email: user.email,
    onboardingComplete: user.onboardingComplete,
  };
}
