import {
  siDocker, siGit, siHtml5, siJavascript, siJsonwebtokens, siLinux, siMongodb, siOpenjdk,
  siPostgresql, siReact, siSpring, siSpringboot, siTailwindcss, siTypescript,
} from "simple-icons";
import { Boxes, Database, Globe2, Wrench, type LucideIcon } from "lucide-react";

type Brand = { title: string; path: string };

// Brand marks come from simple-icons (single-colour SVG paths); generic concepts use Lucide.
const BRAND: Record<string, Brand> = {
  Java: siOpenjdk,
  "Spring Boot": siSpringboot,
  "Spring Framework": siSpring,
  "JWT Authentication": siJsonwebtokens,
  React: siReact,
  TypeScript: siTypescript,
  JavaScript: siJavascript,
  "HTML/CSS": siHtml5,
  "Tailwind CSS": siTailwindcss,
  PostgreSQL: siPostgresql,
  MongoDB: siMongodb,
  Docker: siDocker,
  Git: siGit,
  Linux: siLinux,
};
const GENERIC: Record<string, LucideIcon> = {
  "REST API": Globe2,
  Microservices: Boxes,
  SQL: Database,
};

export function SkillIcon({ name, className = "size-[1.15em]" }: { name: string; className?: string }) {
  const brand = BRAND[name];
  if (brand) {
    return (
      <svg viewBox="0 0 24 24" role="img" aria-hidden className={`${className} shrink-0 fill-current`}>
        <path d={brand.path} />
      </svg>
    );
  }
  const Generic = GENERIC[name] ?? Wrench;
  return <Generic aria-hidden strokeWidth={2.2} className={`${className} shrink-0`} />;
}
