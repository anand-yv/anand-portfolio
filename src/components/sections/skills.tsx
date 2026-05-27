import { SectionWrapper } from "@/components/layout/section-wrapper";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/sections/section-header";
import { StaggerContainer, StaggerItem } from "@/components/motion/stagger";
import { skills } from "@/data/skills";
import { TechChip } from "@/components/ui/tech-chip";
import { Wrench } from "lucide-react";

const categoryLabels = {
  backend: "Backend",
  frontend: "Frontend",
  database: "Database",
  tools: "Tools",
  other: "Other",
} as const;

export function Skills() {
  const skillsByCategory = skills.reduce(
    (acc, skill) => {
      if (!acc[skill.category]) acc[skill.category] = [];
      acc[skill.category].push(skill);
      return acc;
    },
    {} as Record<string, typeof skills>
  );

  return (
    <SectionWrapper id="skills">
      <Reveal>
        <SectionHeader icon={<Wrench />} label="02 — Skills" title="Skills" />
      </Reveal>

      <Reveal delayMs={50}>
        <div className="mt-10 divide-y divide-border/70">
          {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
            <div key={category} className="py-6 first:pt-0 last:pb-0">
              <h3 className="text-sm font-medium text-foreground">
                {categoryLabels[category as keyof typeof categoryLabels] || category}
              </h3>
              <StaggerContainer className="mt-3 flex flex-wrap gap-1.5">
                {categorySkills.map((skill) => (
                  <StaggerItem key={skill.name}>
                    <TechChip tech={skill.name} showIcon={false} />
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          ))}
        </div>
      </Reveal>
    </SectionWrapper>
  );
}
