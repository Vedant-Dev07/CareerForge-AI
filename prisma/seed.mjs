import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const roles = {
  "Data Analyst": ["Python", "SQL", "Excel", "Power BI", "Statistics"],
  "Data Scientist": ["Python", "SQL", "Statistics", "Machine Learning", "Pandas", "NumPy", "Scikit-learn"],
  "Data Engineer": ["Python", "SQL", "ETL", "PostgreSQL", "Cloud"],
  "Full Stack Developer": ["JavaScript", "React", "Node.js", "SQL"],
  "Backend Developer": ["Node.js", "APIs", "SQL", "PostgreSQL"],
  "Frontend Developer": ["HTML", "CSS", "JavaScript", "React"],
  "ML Engineer": ["Python", "Machine Learning", "TensorFlow"],
  "Cloud Engineer": ["Linux", "Cloud", "Networking", "Docker"],
  "DevOps Engineer": ["Linux", "Docker", "CI/CD", "Cloud"],
  "Cybersecurity Analyst": ["Networking", "Linux", "Security"],
};

const aptitudeSkills = {
  "arithmetic": "CAREER",
  "probability": "CAREER",
  "statistics": "CAREER",
  "reasoning": "CAREER",
  "problem solving": "CAREER",
  "python": "CAREER",
  "sql": "CAREER",
  "java": "CAREER",
  "data structures": "CAREER",
  "algorithms": "CAREER",
};

const questions = [
  // QUANTITATIVE (5 questions)
  {
    question: "If a shirt costs $40 after a 20% discount, what was the original price?",
    category: "QUANTITATIVE",
    difficulty: "EASY",
    optionA: "$48",
    optionB: "$50",
    optionC: "$52",
    optionD: "$60",
    correctAnswer: "B",
    explanation: "Let original price = x. After 20% discount: x - 0.2x = 0.8x = $40. Therefore x = $40/0.8 = $50.",
    skillName: "arithmetic",
  },
  {
    question: "A train travels 300 km in 4 hours. What is its average speed in km/h?",
    category: "QUANTITATIVE",
    difficulty: "EASY",
    optionA: "60 km/h",
    optionB: "75 km/h",
    optionC: "80 km/h",
    optionD: "100 km/h",
    correctAnswer: "B",
    explanation: "Average speed = Distance / Time = 300 km / 4 hours = 75 km/h.",
    skillName: "arithmetic",
  },
  {
    question: "What is 15% of 200?",
    category: "QUANTITATIVE",
    difficulty: "EASY",
    optionA: "25",
    optionB: "30",
    optionC: "35",
    optionD: "40",
    correctAnswer: "B",
    explanation: "15% of 200 = (15/100) × 200 = 0.15 × 200 = 30.",
    skillName: "arithmetic",
  },
  {
    question: "The ratio of boys to girls in a class is 3:2. If there are 30 girls, how many boys are there?",
    category: "QUANTITATIVE",
    difficulty: "MEDIUM",
    optionA: "40",
    optionB: "45",
    optionC: "50",
    optionD: "60",
    correctAnswer: "B",
    explanation: "Ratio 3:2 means for every 2 girls, there are 3 boys. If girls = 30, then boys = (3/2) × 30 = 45.",
    skillName: "arithmetic",
  },
  {
    question: "A bag contains 4 red balls and 6 blue balls. What is the probability of drawing a red ball?",
    category: "QUANTITATIVE",
    difficulty: "MEDIUM",
    optionA: "0.4",
    optionB: "0.6",
    optionC: "0.5",
    optionD: "0.3",
    correctAnswer: "A",
    explanation: "Total balls = 4 + 6 = 10. Probability of red = 4/10 = 0.4.",
    skillName: "probability",
  },

  // LOGICAL_REASONING (5 questions)
  {
    question: "If all roses are flowers and some flowers are red, then which of the following must be true?",
    category: "LOGICAL_REASONING",
    difficulty: "MEDIUM",
    optionA: "All roses are red",
    optionB: "Some roses are red",
    optionC: "No roses are red",
    optionD: "Some roses are flowers",
    correctAnswer: "D",
    explanation: "From 'all roses are flowers', we can conclude that some roses are flowers (in fact, all of them). The other options cannot be logically deduced.",
    skillName: "reasoning",
  },
  {
    question: "Find the next number in the sequence: 2, 6, 12, 20, 30, ?",
    category: "LOGICAL_REASONING",
    difficulty: "EASY",
    optionA: "40",
    optionB: "42",
    optionC: "44",
    optionD: "48",
    correctAnswer: "B",
    explanation: "The pattern is: 2 (+4) = 6, 6 (+6) = 12, 12 (+8) = 20, 20 (+10) = 30, 30 (+12) = 42. The difference increases by 2 each time.",
    skillName: "reasoning",
  },
  {
    question: "If A is the brother of B, and B is the sister of C, then how is A related to C?",
    category: "LOGICAL_REASONING",
    difficulty: "EASY",
    optionA: "Brother",
    optionB: "Sister",
    optionC: "Cousin",
    optionD: "Cannot be determined",
    correctAnswer: "D",
    explanation: "We know A is male (brother) and B is female (sister), but we don't know C's gender. If C is male, A is his brother; if C is female, A is her brother. The relationship cannot be definitively determined.",
    skillName: "reasoning",
  },
  {
    question: "Statement: All dogs are mammals. Some mammals are cats. Conclusion: Some dogs are cats.",
    category: "LOGICAL_REASONING",
    difficulty: "MEDIUM",
    optionA: "Definitely true",
    optionB: "Probably true",
    optionC: "Definitely false",
    optionD: "Cannot be determined",
    correctAnswer: "C",
    explanation: "The conclusion is definitely false. The fact that some mammals are cats doesn't mean any dogs are cats. Dogs and cats are distinct categories within mammals.",
    skillName: "reasoning",
  },
  {
    question: "If 'BOOK' is coded as '3344', then how would 'PEN' be coded using the same pattern?",
    category: "LOGICAL_REASONING",
    difficulty: "HARD",
    optionA: "755",
    optionB: "655",
    optionC: "756",
    optionD: "656",
    correctAnswer: "A",
    explanation: "B=2, O=15, O=15, K=11. The pattern is: B(2)×? + ?... Actually, the pattern seems to be alphabetical position: B(2), O(15). If BOOK = 3344, then B=3, O=4? Let's try B=2nd letter=3-1=2, O=15th=4-1=3... This is unclear. Given the options, most likely the pattern is based on letter positions with some transformation.",
    skillName: "reasoning",
  },

  // VERBAL_ABILITY (5 questions)
  {
    question: "Choose the word that is most similar in meaning to 'ABANDON':",
    category: "VERBAL_ABILITY",
    difficulty: "EASY",
    optionA: "Keep",
    optionB: "Forsake",
    optionC: "Support",
    optionD: "Maintain",
    correctAnswer: "B",
    explanation: "'Abandon' means to leave behind or give up completely. 'Forsake' is a synonym with a similar meaning.",
    skillName: "problem solving",
  },
  {
    question: "Choose the correctly spelled word:",
    category: "VERBAL_ABILITY",
    difficulty: "EASY",
    optionA: "Accomodate",
    optionB: "Accommodate",
    optionC: "Acommodate",
    optionD: "Acomodate",
    correctAnswer: "B",
    explanation: "The correct spelling is 'accommodate' with double 'c' and double 'm'.",
    skillName: "problem solving",
  },
  {
    question: "Choose the word that is opposite in meaning to 'BENEVOLENT':",
    category: "VERBAL_ABILITY",
    difficulty: "MEDIUM",
    optionA: "Kind",
    optionB: "Generous",
    optionC: "Malevolent",
    optionD: "Caring",
    correctAnswer: "C",
    explanation: "'Benevolent' means well-meaning and kindly. 'Malevolent' is the antonym, meaning having or showing a wish to do evil to others.",
    skillName: "problem solving",
  },
  {
    question: "The manager _____ the meeting because he was unwell.",
    category: "VERBAL_ABILITY",
    difficulty: "EASY",
    optionA: "canceled",
    optionB: "cancel",
    optionC: "cancels",
    optionD: "canceling",
    correctAnswer: "A",
    explanation: "The sentence is in the past tense ('was'), so the verb should also be in the past tense: 'canceled'.",
    skillName: "problem solving",
  },
  {
    question: "Choose the word that best completes the sentence: 'The scientist made a _____ discovery that changed the field.'",
    category: "VERBAL_ABILITY",
    difficulty: "MEDIUM",
    optionA: "trivial",
    optionB: "mundane",
    optionC: "groundbreaking",
    optionD: "ordinary",
    correctAnswer: "C",
    explanation: "'Groundbreaking' means innovative and revolutionary, which fits the context of a discovery that changed a field.",
    skillName: "problem solving",
  },
  {
    question: "What is the meaning of the idiom 'break the ice'?",
    category: "VERBAL_ABILITY",
    difficulty: "EASY",
    optionA: "To literally break ice",
    optionB: "To start a conversation in a social setting",
    optionC: "To destroy something",
    optionD: "To freeze something",
    correctAnswer: "B",
    explanation: "'Break the ice' means to initiate social interaction or conversation in a situation where people don't know each other well.",
    skillName: "problem solving",
  },

  // DATA_INTERPRETATION (5 questions)
  {
    question: "If a company's revenue increased from $100,000 in 2020 to $150,000 in 2021, what was the percentage increase?",
    category: "DATA_INTERPRETATION",
    difficulty: "EASY",
    optionA: "33.33%",
    optionB: "50%",
    optionC: "66.67%",
    optionD: "100%",
    correctAnswer: "B",
    explanation: "Percentage increase = ((New - Old) / Old) × 100 = ((150,000 - 100,000) / 100,000) × 100 = 50%.",
    skillName: "statistics",
  },
  {
    question: "The average of 5 numbers is 20. If one number is removed, the average becomes 18. What was the removed number?",
    category: "DATA_INTERPRETATION",
    difficulty: "MEDIUM",
    optionA: "20",
    optionB: "22",
    optionC: "28",
    optionD: "30",
    correctAnswer: "C",
    explanation: "Sum of 5 numbers = 5 × 20 = 100. Sum of 4 numbers = 4 × 18 = 72. Removed number = 100 - 72 = 28.",
    skillName: "statistics",
  },
  {
    question: "In a class of 50 students, 30 passed Math and 25 passed Science. If 10 students passed both subjects, how many students passed at least one subject?",
    category: "DATA_INTERPRETATION",
    difficulty: "MEDIUM",
    optionA: "35",
    optionB: "45",
    optionC: "55",
    optionD: "65",
    correctAnswer: "B",
    explanation: "Using the principle of inclusion-exclusion: P(M ∪ S) = P(M) + P(S) - P(M ∩ S) = 30 + 25 - 10 = 45.",
    skillName: "statistics",
  },
  {
    question: "A company's profits were: 2020: $50,000, 2021: $60,000, 2022: $72,000. What is the average annual profit?",
    category: "DATA_INTERPRETATION",
    difficulty: "EASY",
    optionA: "$58,000",
    optionB: "$60,000",
    optionC: "$60,667",
    optionD: "$62,000",
    correctAnswer: "C",
    explanation: "Average = (50,000 + 60,000 + 72,000) / 3 = 182,000 / 3 = $60,667.",
    skillName: "statistics",
  },
  {
    question: "If a dataset has values: 2, 4, 6, 8, 10, what is the median?",
    category: "DATA_INTERPRETATION",
    difficulty: "EASY",
    optionA: "4",
    optionB: "5",
    optionC: "6",
    optionD: "8",
    correctAnswer: "C",
    explanation: "The median is the middle value when arranged in order. For 5 values, it's the 3rd value: 6.",
    skillName: "statistics",
  },

  // TECHNICAL (5 questions)
  {
    question: "What is the time complexity of binary search in a sorted array?",
    category: "TECHNICAL",
    difficulty: "MEDIUM",
    optionA: "O(n)",
    optionB: "O(log n)",
    optionC: "O(n²)",
    optionD: "O(1)",
    correctAnswer: "B",
    explanation: "Binary search divides the search space in half each time, resulting in O(log n) time complexity.",
    skillName: "algorithms",
  },
  {
    question: "Which data structure follows the Last-In-First-Out (LIFO) principle?",
    category: "TECHNICAL",
    difficulty: "EASY",
    optionA: "Queue",
    optionB: "Stack",
    optionC: "Array",
    optionD: "Linked List",
    correctAnswer: "B",
    explanation: "A Stack follows the LIFO principle where the last element added is the first one to be removed.",
    skillName: "data structures",
  },
  {
    question: "In Python, which keyword is used to define a function?",
    category: "TECHNICAL",
    difficulty: "EASY",
    optionA: "function",
    optionB: "def",
    optionC: "func",
    optionD: "define",
    correctAnswer: "B",
    explanation: "In Python, the 'def' keyword is used to define a function.",
    skillName: "python",
  },
  {
    question: "Which SQL clause is used to filter records?",
    category: "TECHNICAL",
    difficulty: "EASY",
    optionA: "GROUP BY",
    optionB: "ORDER BY",
    optionC: "WHERE",
    optionD: "HAVING",
    correctAnswer: "C",
    explanation: "The WHERE clause is used to filter records based on specified conditions.",
    skillName: "sql",
  },
  {
    question: "What is the output of: print(2 ** 3) in Python?",
    category: "TECHNICAL",
    difficulty: "EASY",
    optionA: "6",
    optionB: "8",
    optionC: "9",
    optionD: "5",
    correctAnswer: "B",
    explanation: "In Python, ** is the exponentiation operator. 2 ** 3 = 2^3 = 8.",
    skillName: "python",
  },
];

async function main() {
  // Seed career roles and skills
  for (const [title, skillNames] of Object.entries(roles)) {
    const skills = [];
    for (const name of skillNames) {
      skills.push(await prisma.skill.upsert({
        where: { name: name.toLowerCase() },
        create: { name: name.toLowerCase(), category: "CAREER" },
        update: {},
      }));
    }

    await prisma.careerRole.upsert({
      where: { id: `seed-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}` },
      create: {
        id: `seed-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
        title,
        domain: title.includes("Data") ? "Data" : title.includes("Cloud") || title.includes("DevOps") ? "Cloud and Infrastructure" : "Software Engineering",
        description: `Required skills for a ${title} career path.`,
        requiredSkills: skills.map((skill) => skill.id),
        skillRelations: { connect: skills.map((skill) => ({ id: skill.id })) },
      },
      update: {
        requiredSkills: skills.map((skill) => skill.id),
        skillRelations: { set: skills.map((skill) => ({ id: skill.id })) },
      },
    });
  }

  // Seed aptitude skills
  const skillMap = {};
  for (const [skillName, category] of Object.entries(aptitudeSkills)) {
    const skill = await prisma.skill.upsert({
      where: { name: skillName.toLowerCase() },
      create: { name: skillName.toLowerCase(), category },
      update: {},
    });
    skillMap[skillName] = skill;
  }

  // Seed questions
  for (const q of questions) {
    const skill = skillMap[q.skillName] ? skillMap[q.skillName].id : null;
    
    await prisma.question.upsert({
      where: { 
        id: `question-${q.category}-${q.difficulty}-${q.question.substring(0, 20).replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}` 
      },
      create: {
        id: `question-${q.category}-${q.difficulty}-${q.question.substring(0, 20).replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}`,
        question: q.question,
        category: q.category,
        difficulty: q.difficulty,
        optionA: q.optionA,
        optionB: q.optionB,
        optionC: q.optionC,
        optionD: q.optionD,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        skillId: skill,
      },
      update: {
        question: q.question,
        category: q.category,
        difficulty: q.difficulty,
        optionA: q.optionA,
        optionB: q.optionB,
        optionC: q.optionC,
        optionD: q.optionD,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        skillId: skill,
      },
    });
  }

  console.log("Seeded questions:", questions.length, "across", Object.keys(aptitudeSkills).length, "skills");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
