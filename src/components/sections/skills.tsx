import { SectionWrapper } from "@/components/layout/section-wrapper";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/sections/section-header";
import { skills } from "@/data/skills";
import { SkillBadge } from "@/components/ui/skill-badge";
import { Separator } from "@/components/ui/separator";
import { Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

const categoryLabels = {
  backend: "Backend",
  frontend: "Frontend",
  database: "Database",
  tools: "Tools & DevOps",
  other: "Other",
} as const;

export function Skills() {
  const skillsByCategory = skills.reduce(
    (acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    },
    {} as Record<string, typeof skills>
  );

  return (
    <SectionWrapper id="skills">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <SectionHeader
            icon={<Wrench />}
            title="Skills"
            description="A practical toolkit focused on backend architecture, APIs, and shipping production-ready full-stack features."
          />
        </Reveal>

        <Reveal delayMs={80}>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(skillsByCategory).map(([category, categorySkills], idx) => (
              <div
                key={category}
                className={cn(
                  "group relative rounded-3xl border bg-card/50 p-6 shadow-sm",
                  "transition-all duration-200 ease-out",
                  "hover:-translate-y-1 hover:shadow-lg hover:border-primary/30",
                  "before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-primary/5 before:via-transparent before:to-transparent before:opacity-0 before:transition-opacity before:duration-200",
                  "hover:before:opacity-100"
                )}
              >
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  {categoryLabels[category as keyof typeof categoryLabels] || category}
                </h3>
                <Separator className="mb-4" />
                <div className="flex flex-wrap gap-2">
                  {categorySkills.map((skill) => (
                    <SkillBadge key={skill.name} skill={skill} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </SectionWrapper>
  );
}
