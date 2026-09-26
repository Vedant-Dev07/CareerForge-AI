import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function verifySeed() {
  console.log("=== PHASE 4.1 SEED VERIFICATION ===\n");

  // Total questions
  const totalQuestions = await prisma.question.count();
  console.log(`1. Total questions: ${totalQuestions}`);

  // Questions by category
  const categories = await prisma.question.groupBy({
    by: ['category'],
    _count: true,
  });
  console.log("\n2. Questions by category:");
  categories.forEach(c => {
    console.log(`   ${c.category}: ${c._count}`);
  });

  // Questions by difficulty
  const difficulties = await prisma.question.groupBy({
    by: ['difficulty'],
    _count: true,
  });
  console.log("\n3. Questions by difficulty:");
  difficulties.forEach(d => {
    console.log(`   ${d.difficulty}: ${d._count}`);
  });

  // Questions with valid correct answers
  const questionsWithAnswers = await prisma.question.findMany({
    where: {
      correctAnswer: {
        in: ['A', 'B', 'C', 'D']
      }
    }
  });
  console.log(`\n4. Questions with valid correct answers: ${questionsWithAnswers.length}`);

  // Questions with explanations
  const questionsWithExplanations = await prisma.question.count({
    where: {
      explanation: {
        not: null
      }
    }
  });
  console.log(`5. Questions with explanations: ${questionsWithExplanations}`);

  // Skill relationships
  const questionsWithSkills = await prisma.question.count({
    where: {
      skillId: {
        not: null
      }
    }
  });
  console.log(`6. Questions with skill mappings: ${questionsWithSkills}`);

  // Sample questions
  console.log("\n7. Sample questions:");
  const sampleQuestions = await prisma.question.findMany({
    take: 3,
    include: {
      skill: true
    }
  });
  sampleQuestions.forEach((q, i) => {
    console.log(`   ${i + 1}. [${q.category}] ${q.question.substring(0, 50)}...`);
    console.log(`      Skill: ${q.skill?.name || 'None'}`);
  });

  console.log("\n=== VERIFICATION COMPLETE ===");
}

verifySeed()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());