import { randomBytes } from "crypto";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const baseUrl = process.env.E2E_BASE_URL ?? "http://localhost:3000";
const testEmails = [
  "e2e.interview.student1@careerforge-test.local",
  "e2e.interview.student2@careerforge-test.local",
];
const runToken = randomBytes(8).toString("hex");
const password = randomBytes(24).toString("base64url");
const roleTitle = `E2E Interview Role ${runToken}`;
const skillName = `e2e-interview-skill-${runToken}`;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function readJson(response) {
  return response.json().catch(() => ({}));
}

async function login(email) {
  const response = await fetch(`${baseUrl}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const payload = await readJson(response);
  assert(response.status === 200, `Login failed: ${response.status} ${payload.error ?? ""}`);
  const cookie = response.headers.get("set-cookie")?.split(";")[0];
  assert(cookie, "Login did not return a session cookie.");
  return cookie;
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

async function cleanup() {
  await prisma.interviewQuestion.deleteMany({ where: { question: { startsWith: "E2E interview verification question" } } });
  await prisma.user.deleteMany({ where: { email: { in: testEmails } } });
  await prisma.careerRole.deleteMany({ where: { title: { startsWith: "E2E Interview Role " } } });
  await prisma.skill.deleteMany({ where: { name: { startsWith: "e2e-interview-skill-" } } });
}

async function createFixtures() {
  await cleanup();

  const [role, skill] = await Promise.all([
    prisma.careerRole.create({
      data: { title: roleTitle, domain: "E2E_TEST", description: "Synthetic interview verification role", requiredSkills: [] },
    }),
    prisma.skill.create({ data: { name: skillName, category: "E2E_TEST" } }),
  ]);
  await prisma.interviewQuestion.create({
    data: {
      question: `E2E interview verification question ${runToken}: explain how you would validate a secure API endpoint.`,
      category: "TECHNICAL",
      difficulty: "MEDIUM",
      expectedPoints: "Authentication, authorization, input validation, and error handling.",
      skillId: skill.id,
      careerRoleId: role.id,
    },
  });

  const passwordHash = await bcrypt.hash(password, 12);
  for (const email of testEmails) {
    const user = await prisma.user.create({ data: { name: "E2E Interview Student", email, passwordHash } });
    const profile = await prisma.studentProfile.create({
      data: {
        userId: user.id,
        targetCareerId: role.id,
        targetDomain: role.title,
        profileCompletion: 100,
      },
    });
    await Promise.all([
      prisma.studentSkill.create({ data: { studentProfileId: profile.id, skillId: skill.id, level: "BEGINNER" } }),
      prisma.skillPerformance.create({
        data: {
          studentProfileId: profile.id,
          skillId: skill.id,
          totalQuestions: 4,
          attemptedQuestions: 4,
          correctAnswers: 2,
          incorrectAnswers: 2,
          accuracy: 50,
          classification: "WEAK",
          priority: "HIGH",
        },
      }),
    ]);
    const resume = await prisma.resume.create({
      data: { studentProfileId: profile.id, fileName: "e2e-resume.pdf", fileType: "PDF", status: "ANALYZED" },
    });
    await prisma.resumeAnalysis.create({
      data: {
        resumeId: resume.id,
        atsScore: 72,
        matchedSkills: [skillName],
        missingSkills: [],
        detectedSkills: [skillName],
        keywords: ["API", "authentication"],
        recommendations: [],
        sectionScore: 72,
      },
    });
  }
}

async function verify() {
  const legacyBefore = await prisma.legacyInterviewEvaluation.count();
  await createFixtures();

  const [studentOneCookie, studentTwoCookie] = await Promise.all(testEmails.map(login));
  const createOne = await request(studentOneCookie, "/api/interview/sessions", {
    method: "POST",
    body: JSON.stringify({ interviewType: "TECHNICAL", difficulty: "MEDIUM", numQuestions: 1 }),
  });
  const createdOne = await readJson(createOne);
  assert(createOne.status === 200 && createdOne.session?.id, "Student 1 could not create an interview session.");
  assert(createdOne.session.answers.length === 1, "Student 1 session did not include one generated question.");
  assert(createdOne.session.answers[0].questionText.includes("E2E interview verification question"), "Session did not use the targeted synthetic interview context.");

  const sessionId = createdOne.session.id;
  const answerId = createdOne.session.answers[0].id;
  const answerResponse = await request(studentOneCookie, `/api/interview/sessions/${sessionId}/answers`, {
    method: "POST",
    body: JSON.stringify({
      answerId,
      answerText: "I would require authenticated requests, enforce authorization for each resource, validate all input, return safe errors, and test both allowed and denied requests.",
    }),
  });
  const answerPayload = await readJson(answerResponse);
  assert(answerResponse.status === 200, `Gemini evaluator failed: ${answerResponse.status} ${answerPayload.error ?? ""}`);

  const persistedAnswer = await prisma.interviewAnswer.findUnique({
    where: { id: answerId },
    include: { evaluation: true },
  });
  assert(persistedAnswer?.answerText, "Answer was not persisted in Neon.");
  const evaluation = persistedAnswer.evaluation;
  assert(evaluation, "InterviewEvaluation was not persisted in Neon.");
  assert(
    [evaluation.relevance, evaluation.technicalAccuracy, evaluation.completeness, evaluation.clarity, evaluation.professionalism].every((score) => Number.isFinite(score)),
    "Persisted evaluation is missing structured dimension scores."
  );
  assert(evaluation.feedback.trim().length > 0 && evaluation.improvements.length > 0, "Feedback or improvements were not persisted.");

  const active = await request(studentOneCookie, `/api/interview/sessions/${sessionId}/active`);
  const activePayload = await readJson(active);
  assert(active.status === 200 && activePayload.session.answers[0].answerText, "Reload did not preserve the active interview answer.");

  const submit = await request(studentOneCookie, `/api/interview/sessions/${sessionId}/submit`, { method: "POST" });
  const submitted = await readJson(submit);
  assert(submit.status === 200 && submitted.session.status === "COMPLETED", "Interview did not complete successfully.");

  const result = await request(studentOneCookie, `/api/interview/sessions/${sessionId}/result`);
  const resultPayload = await readJson(result);
  assert(result.status === 200 && resultPayload.result.status === "COMPLETED", "Student 1 could not retrieve the completed result.");
  assert(resultPayload.result.answers[0].evaluation?.feedback, "Result did not include the persisted evaluation.");

  const foreignResult = await request(studentTwoCookie, `/api/interview/sessions/${sessionId}/result`);
  assert(foreignResult.status === 403, `Student 2 result access returned ${foreignResult.status}, expected 403.`);
  const foreignActive = await request(studentTwoCookie, `/api/interview/sessions/${sessionId}/active`);
  assert(foreignActive.status === 403, `Student 2 active-session access returned ${foreignActive.status}, expected 403.`);

  const createTwo = await request(studentTwoCookie, "/api/interview/sessions", {
    method: "POST",
    body: JSON.stringify({ interviewType: "TECHNICAL", difficulty: "MEDIUM", numQuestions: 1 }),
  });
  const createdTwo = await readJson(createTwo);
  assert(createTwo.status === 200 && createdTwo.session?.id, "Student 2 could not create an interview session.");
  const ownActive = await request(studentTwoCookie, `/api/interview/sessions/${createdTwo.session.id}/active`);
  assert(ownActive.status === 200, "Student 2 could not access their own session.");

  const unauthenticated = await request(null, "/api/interview/sessions", {
    method: "POST",
    body: JSON.stringify({ interviewType: "TECHNICAL", difficulty: "MEDIUM", numQuestions: 1 }),
  });
  assert(unauthenticated.status === 401, `Unauthenticated session creation returned ${unauthenticated.status}.`);
  const legacyAfter = await prisma.legacyInterviewEvaluation.count();
  assert(legacyAfter === legacyBefore, "Verification created legacy interview evaluation records.");

  console.log(JSON.stringify({
    sessionStatus: resultPayload.result.status,
    overallScore: resultPayload.result.score,
    dimensions: {
      relevance: evaluation.relevance,
      technicalAccuracy: evaluation.technicalAccuracy,
      completeness: evaluation.completeness,
      clarity: evaluation.clarity,
      professionalism: evaluation.professionalism,
    },
    legacyEvaluations: legacyAfter,
  }));
}

try {
  await verify();
} finally {
  await cleanup();
  await prisma.$disconnect();
}
