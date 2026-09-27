import { randomBytes } from "crypto";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const baseUrl = process.env.E2E_BASE_URL ?? "http://localhost:3020";
const emails = ["e2e.action.student1@careerforge-test.local", "e2e.action.student2@careerforge-test.local"];
const password = randomBytes(24).toString("base64url");

function assert(condition, message) { if (!condition) throw new Error(message); }
async function json(response) { return response.json().catch(() => ({})); }
async function request(cookie, path, options = {}) {
  return fetch(`${baseUrl}${path}`, { ...options, headers: { "Content-Type": "application/json", ...(cookie ? { Cookie: cookie } : {}), ...(options.headers ?? {}) } });
}
async function cleanup() { await prisma.user.deleteMany({ where: { email: { in: emails } } }); }
async function login(email) {
  const response = await request(null, "/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
  const payload = await json(response);
  assert(response.status === 200, `Login failed: ${response.status} ${payload.error ?? ""}`);
  const cookie = response.headers.get("set-cookie")?.split(";")[0];
  assert(cookie, "Login did not return a session cookie.");
  return cookie;
}

async function fixtures() {
  await cleanup();
  const passwordHash = await bcrypt.hash(password, 12);
  const job = await prisma.jobOpportunity.findFirst({ where: { isActive: true } });
  assert(job, "No active job fixture exists.");
  for (const email of emails) {
    const user = await prisma.user.create({ data: { name: "E2E Action Student", email, passwordHash } });
    const profile = await prisma.studentProfile.create({ data: { userId: user.id, targetDomain: "Software Engineering", profileCompletion: 100 } });
    await prisma.jobRecommendation.create({ data: { studentProfileId: profile.id, jobId: job.id, matchScore: 95, careerAlignment: 95, skillCoverage: 95, evidenceScore: 90, resumeAlignment: 90, projectRelevance: 90, aptitudeReadiness: 80, interviewReadiness: 80, explanation: "E2E strong match" } });
  }
}

try {
  await fixtures();
  const [studentOne, studentTwo] = await Promise.all(emails.map(login));
  const unauthenticated = await request(null, "/api/action-center");
  assert(unauthenticated.status === 401, `Unauthenticated action center returned ${unauthenticated.status}.`);

  const generated = await request(studentOne, "/api/action-center/generate", { method: "POST" });
  const generatedPayload = await json(generated);
  assert(generated.status === 200 && generatedPayload.actions?.length, `Action generation returned no actions: ${generated.status} ${generatedPayload.error ?? ""}`);
  const action = generatedPayload.actions.find((item) => item.source.startsWith("JOB:"));
  assert(action?.id, "Generated actions did not include the evidence-backed job action.");

  const generatedAgain = await request(studentOne, "/api/action-center/generate", { method: "POST" });
  const generatedAgainPayload = await json(generatedAgain);
  assert(generatedAgain.status === 200, "Second action generation failed.");
  const count = await prisma.careerAction.count({ where: { studentProfile: { user: { email: emails[0] } } } });
  assert(count === generatedAgainPayload.actions.length, "Repeated generation created duplicate actions.");

  const persisted = await request(studentOne, "/api/action-center");
  const persistedPayload = await json(persisted);
  assert(persisted.status === 200 && persistedPayload.actions.some((item) => item.id === action.id), "Generated action did not persist.");

  const foreignList = await request(studentTwo, "/api/action-center");
  const foreignPayload = await json(foreignList);
  assert(foreignList.status === 200 && !foreignPayload.actions.some((item) => item.id === action.id), "User B can see User A action.");
  const foreignComplete = await request(studentTwo, `/api/action-center/${action.id}/complete`, { method: "POST" });
  assert(foreignComplete.status === 403, `Foreign completion returned ${foreignComplete.status}.`);

  const completed = await request(studentOne, `/api/action-center/${action.id}/complete`, { method: "POST" });
  const completedPayload = await json(completed);
  assert(completed.status === 200 && completedPayload.action.completed === true, "Action completion failed.");
  const reopened = await request(studentOne, `/api/action-center/${action.id}/reopen`, { method: "POST" });
  const reopenedPayload = await json(reopened);
  assert(reopened.status === 200 && reopenedPayload.action.completed === false, "Action reopen failed.");
  const deleted = await request(studentOne, `/api/action-center/${action.id}`, { method: "DELETE" });
  assert(deleted.status === 200, "Action deletion failed.");

  console.log(JSON.stringify({ actionId: action.id, generatedCount: generatedAgainPayload.actions.length, duplicateCount: count, isolation: true, completed: true, reopened: true, deleted: true }));
} finally {
  await cleanup();
  const remaining = await prisma.user.count({ where: { email: { in: emails } } });
  assert(remaining === 0, `Synthetic users remain after cleanup: ${remaining}`);
  await prisma.$disconnect();
}
