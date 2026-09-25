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

async function main() {
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
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
