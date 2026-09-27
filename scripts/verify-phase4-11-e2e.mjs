import { randomBytes } from "crypto";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const baseUrl = process.env.E2E_BASE_URL ?? "http://localhost:3020";
const emails = [
  "e2e.jobs.student1@careerforge-test.local",
  "e2e.jobs.student2@careerforge-test.local",
];
const password = randomBytes(24).toString("base64url");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function json(response) {
  return response.json().catch(() => ({}));
}

async function request(cookie, path, options = {}) {
  return fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(cookie ? { Cookie: cookie } : {}),
      ...(options.headers ?? {}),
    },
  });
}

async function login(email) {
  const response = await request(null, "/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
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
    const user = await prisma.user.create({
      data: { name: "E2E Jobs Student", email, passwordHash },
    });
    await prisma.studentProfile.create({
      data: {
        userId: user.id,
        careerGoal: "Become a data analyst",
        targetDomain: "Data Analyst",
        profileCompletion: 100,
      },
    });
  }
}

async function verify() {
  await fixtures();
  const [studentOne, studentTwo] = await Promise.all(emails.map(login));

  const unauthenticated = await request(null, "/api/jobs/recommended");
  assert(unauthenticated.status === 401, `Unauthenticated recommendations returned ${unauthenticated.status}.`);
  const unauthenticatedApplications = await request(null, "/api/applications");
  assert(unauthenticatedApplications.status === 401, `Unauthenticated applications returned ${unauthenticatedApplications.status}.`);

  const firstRecommendations = await request(studentOne, "/api/jobs/recommended");
  const firstPayload = await json(firstRecommendations);
  assert(firstRecommendations.status === 200 && firstPayload.recommendations?.length, "Student 1 received no job recommendations.");
  const job = firstPayload.recommendations[0].job;
  assert(job?.id, "Recommendation did not include a job.");

  const saved = await request(studentOne, `/api/jobs/${job.id}/save`, { method: "POST" });
  const savedPayload = await json(saved);
  assert(saved.status === 200 && savedPayload.application?.status === "SAVED", "Student 1 could not save a job.");

  const applied = await request(studentOne, `/api/jobs/${job.id}/apply`, { method: "POST" });
  const appliedPayload = await json(applied);
  assert(applied.status === 200 && appliedPayload.application?.status === "APPLIED", "Student 1 could not mark a job applied.");
  const applicationId = appliedPayload.application.id;

  const updated = await request(studentOne, `/api/applications/${applicationId}`, {
    method: "PATCH",
    body: JSON.stringify({ status: "INTERVIEW", notes: "Technical screen scheduled." }),
  });
  const updatedPayload = await json(updated);
  assert(updated.status === 200 && updatedPayload.application?.status === "INTERVIEW", "Student 1 could not update application status.");

  const foreignApplications = await request(studentTwo, "/api/applications");
  const foreignApplicationsPayload = await json(foreignApplications);
  assert(foreignApplications.status === 200, `Foreign application listing returned ${foreignApplications.status}.`);
  assert(!foreignApplicationsPayload.applications?.some((item) => item.id === applicationId), "Foreign application appeared in another user's listing.");
  const foreignUpdate = await request(studentTwo, `/api/applications/${applicationId}`, {
    method: "PATCH",
    body: JSON.stringify({ status: "OFFER" }),
  });
  assert(foreignUpdate.status === 403, `Foreign application update returned ${foreignUpdate.status}.`);
  const foreignDelete = await request(studentTwo, `/api/applications/${applicationId}`, { method: "DELETE" });
  assert(foreignDelete.status === 403, `Foreign application delete returned ${foreignDelete.status}.`);

  const refresh = await request(studentOne, "/api/jobs/recommended", { method: "POST" });
  const refreshPayload = await json(refresh);
  assert(refresh.status === 200 && refreshPayload.recommendations?.length, "Recommendation refresh failed.");
  const recommendationCount = await prisma.jobRecommendation.count({
    where: { studentProfile: { user: { email: emails[0] } } },
  });
  assert(recommendationCount === refreshPayload.recommendations.length, "Refresh created duplicate recommendations.");

  const ownApplications = await request(studentOne, "/api/applications");
  const ownPayload = await json(ownApplications);
  assert(ownApplications.status === 200 && ownPayload.applications.some((item) => item.id === applicationId), "Application was not listed for its owner.");

  console.log(JSON.stringify({
    jobId: job.id,
    recommendationCount,
    applicationId,
    finalStatus: updatedPayload.application.status,
  }));
}

try {
  await verify();
} finally {
  await cleanup();
  await prisma.$disconnect();
}
