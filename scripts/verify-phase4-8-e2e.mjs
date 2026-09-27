import { randomBytes } from "crypto";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const baseUrl = process.env.E2E_BASE_URL ?? "http://localhost:3000";
const emails = ["e2e.mentor.student1@careerforge-test.local", "e2e.mentor.student2@careerforge-test.local"];
const password = randomBytes(24).toString("base64url");

function assert(condition, message) { if (!condition) throw new Error(message); }
async function json(response) { return response.json().catch(() => ({})); }
async function request(cookie, path, options = {}) {
  return fetch(`${baseUrl}${path}`, { ...options, headers: { "Content-Type": "application/json", ...(cookie ? { Cookie: cookie } : {}), ...(options.headers ?? {}) } });
}
async function mentorMessage(cookie, conversationId, content) {
  let response = await request(cookie, `/api/mentor/conversations/${conversationId}/messages`, { method: "POST", body: JSON.stringify({ content }) });
  if (response.status === 502) {
    await new Promise((resolve) => setTimeout(resolve, 1_000));
    response = await request(cookie, `/api/mentor/conversations/${conversationId}/messages`, { method: "POST", body: JSON.stringify({ content }) });
  }
  return response;
}
async function login(email) {
  const response = await request(null, "/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
  const payload = await json(response);
  assert(response.status === 200, `Login failed: ${response.status} ${payload.error ?? ""}`);
  const cookie = response.headers.get("set-cookie")?.split(";")[0];
  assert(cookie, "Login did not return a session cookie.");
  return cookie;
}
async function cleanup() {
  await prisma.user.deleteMany({ where: { email: { in: emails } } });
}
async function fixtures() {
  await cleanup();
  const passwordHash = await bcrypt.hash(password, 12);
  for (const email of emails) {
    const user = await prisma.user.create({ data: { name: "E2E Mentor Student", email, passwordHash } });
    await prisma.studentProfile.create({ data: { userId: user.id, careerGoal: "Improve SQL interview readiness", targetDomain: "Data Analyst", profileCompletion: 100 } });
  }
}
async function verify() {
  await fixtures();
  const [studentOne, studentTwo] = await Promise.all(emails.map(login));
  const unauthenticated = await request(null, "/api/mentor/conversations");
  assert(unauthenticated.status === 401, `Unauthenticated conversations returned ${unauthenticated.status}.`);
  const create = await request(studentOne, "/api/mentor/conversations", { method: "POST", body: JSON.stringify({ title: "E2E mentor chat", studentProfileId: "client-controlled-value", userId: "client-controlled-value" }) });
  const created = await json(create);
  assert(create.status === 201 && created.conversation?.id, "Student 1 could not create a conversation.");
  const conversationId = created.conversation.id;
  const unauthenticatedMessage = await request(null, `/api/mentor/conversations/${conversationId}/messages`, { method: "POST", body: JSON.stringify({ content: "Unauthenticated request" }) });
  assert(unauthenticatedMessage.status === 401, `Unauthenticated message returned ${unauthenticatedMessage.status}.`);
  const foreignRead = await request(studentTwo, `/api/mentor/conversations/${conversationId}`);
  assert(foreignRead.status === 403, `Student 2 conversation access returned ${foreignRead.status}.`);
  const foreignMessage = await request(studentTwo, `/api/mentor/conversations/${conversationId}/messages`, { method: "POST", body: JSON.stringify({ content: "Can I access this?" }) });
  assert(foreignMessage.status === 403, `Student 2 message access returned ${foreignMessage.status}.`);
  const response = await mentorMessage(studentOne, conversationId, "What should I focus on today?");
  const payload = await json(response);
  assert(response.status === 200, `Gemini mentor failed: ${response.status} ${payload.error ?? ""}`);
  assert(payload.userMessage?.content && payload.assistantMessage?.content, "Mentor messages were not returned.");
  const stored = await prisma.mentorConversation.findUnique({ where: { id: conversationId }, include: { messages: { orderBy: { createdAt: "asc" } } } });
  assert(stored?.messages.some((message) => message.role === "USER") && stored.messages.some((message) => message.role === "ASSISTANT"), "User and mentor messages were not persisted.");
  assert(stored.studentProfileId !== "client-controlled-value", "Client-supplied student profile ID was accepted.");
  const reload = await request(studentOne, `/api/mentor/conversations/${conversationId}`);
  const reloaded = await json(reload);
  assert(reload.status === 200 && reloaded.conversation.messages.some((message) => message.role === "ASSISTANT"), "Conversation did not survive reload.");
  const second = await mentorMessage(studentOne, conversationId, "How should I prepare for SQL interviews?");
  assert(second.status === 200, "Student 1 could not continue the conversation.");
  const list = await request(studentOne, "/api/mentor/conversations");
  const listed = await json(list);
  assert(list.status === 200 && listed.conversations.some((conversation) => conversation.id === conversationId), "Conversation was not listed for its owner.");
  const completed = await prisma.mentorConversation.findUnique({ where: { id: conversationId }, include: { messages: true } });
  console.log(JSON.stringify({ conversationId, messageCount: completed?.messages.length ?? 0, actions: payload.actions?.length ?? 0 }));
}

try { await verify(); } finally { await cleanup(); await prisma.$disconnect(); }
