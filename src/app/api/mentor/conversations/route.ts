import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getCurrentUser();
  if (!user?.studentProfileId) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  const conversations = await prisma.mentorConversation.findMany({
    where: { studentProfileId: user.studentProfileId },
    orderBy: { updatedAt: "desc" },
    include: { messages: { orderBy: { createdAt: "desc" }, take: 1, select: { content: true, createdAt: true } } },
  });
  return NextResponse.json({ conversations: conversations.map(({ messages, ...conversation }) => ({ ...conversation, lastMessage: messages[0] ?? null })) });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user?.studentProfileId) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  const body = await request.json().catch(() => ({})) as Record<string, unknown>;
  if (body.title !== undefined && (typeof body.title !== "string" || body.title.trim().length > 120)) return NextResponse.json({ error: "Conversation title must be 120 characters or fewer." }, { status: 400 });
  const conversation = await prisma.mentorConversation.create({ data: { studentProfileId: user.studentProfileId, title: typeof body.title === "string" ? body.title.trim() || null : null } });
  return NextResponse.json({ conversation }, { status: 201 });
}
