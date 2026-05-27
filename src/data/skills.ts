import type { Skill, SkillLayerConfig } from "@/types";

export const skills: Skill[] = [
  { name: "Java", category: "backend", proficiency: "advanced" },
  { name: "Spring Boot", category: "backend", proficiency: "advanced" },
  { name: "Spring Framework", category: "backend", proficiency: "advanced" },
  { name: "REST API", category: "backend", proficiency: "advanced" },
  { name: "Microservices", category: "backend", proficiency: "intermediate" },
  { name: "JWT Authentication", category: "backend", proficiency: "advanced" },
  { name: "React", category: "frontend", proficiency: "advanced" },
  { name: "TypeScript", category: "frontend", proficiency: "advanced" },
  { name: "JavaScript", category: "frontend", proficiency: "advanced" },
  { name: "HTML/CSS", category: "frontend", proficiency: "advanced" },
  { name: "Tailwind CSS", category: "frontend", proficiency: "intermediate" },
  { name: "PostgreSQL", category: "database", proficiency: "advanced" },
  { name: "MongoDB", category: "database", proficiency: "intermediate" },
  { name: "SQL", category: "database", proficiency: "advanced" },
  { name: "Docker", category: "tools", proficiency: "intermediate" },
  { name: "Git", category: "tools", proficiency: "advanced" },
  { name: "Linux", category: "tools", proficiency: "intermediate" },
];

export const skillLayers: SkillLayerConfig[] = [
  {
    id: "frontend",
    title: "Frontend",
    subtitle: "Interfaces and product UI",
    category: "frontend",
    icon: "code",
  },
  {
    id: "backend",
    title: "Backend",
    subtitle: "APIs, services, and auth",
    category: "backend",
    icon: "server",
    emphasized: true,
  },
  {
    id: "data",
    title: "Data",
    subtitle: "Storage, queries, and models",
    category: "database",
    icon: "database",
  },
  {
    id: "tooling",
    title: "Tooling",
    subtitle: "Ship, debug, and operate",
    category: "tools",
    icon: "wrench",
  },
];

export function groupSkillsByCategory(
  items: Skill[]
): Map<Skill["category"], Skill[]> {
  const map = new Map<Skill["category"], Skill[]>();
  for (const skill of items) {
    const list = map.get(skill.category) ?? [];
    list.push(skill);
    map.set(skill.category, list);
  }
  return map;
}
