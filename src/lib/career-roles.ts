import { prisma } from "@/lib/prisma";

export const careerRoleDataset = [
  { title: "Data Analyst", domain: "Data", skills: ["Python", "SQL", "Excel", "Power BI", "Statistics"] },
  { title: "Data Scientist", domain: "Data", skills: ["Python", "SQL", "Statistics", "Machine Learning", "Pandas", "NumPy", "Scikit-learn"] },
  { title: "Data Engineer", domain: "Data", skills: ["Python", "SQL", "ETL", "PostgreSQL", "Cloud"] },
  { title: "Full Stack Developer", domain: "Software Engineering", skills: ["JavaScript", "React", "Node.js", "SQL"] },
  { title: "Backend Developer", domain: "Software Engineering", skills: ["Node.js", "APIs", "SQL", "PostgreSQL"] },
  { title: "Frontend Developer", domain: "Software Engineering", skills: ["HTML", "CSS", "JavaScript", "React"] },
  { title: "ML Engineer", domain: "Data", skills: ["Python", "Machine Learning", "TensorFlow"] },
  { title: "Cloud Engineer", domain: "Cloud and Infrastructure", skills: ["Linux", "Cloud", "Networking", "Docker"] },
  { title: "DevOps Engineer", domain: "Cloud and Infrastructure", skills: ["Linux", "Docker", "CI/CD", "Cloud"] },
  { title: "Cybersecurity Analyst", domain: "Security", skills: ["Networking", "Linux", "Security"] },
];

export async function ensureCareerRoles() {
  for (const role of careerRoleDataset) {
    const skills = [];
    for (const name of role.skills) {
      skills.push(await prisma.skill.upsert({
        where: { name: name.toLowerCase() },
        create: { name: name.toLowerCase(), category: "CAREER" },
        update: {},
      }));
    }

    const id = `seed-${role.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
    await prisma.careerRole.upsert({
      where: { id },
      create: {
        id,
        title: role.title,
        domain: role.domain,
        description: `Required skills for a ${role.title} career path.`,
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
