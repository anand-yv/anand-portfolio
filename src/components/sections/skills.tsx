import { SectionWrapper } from "@/components/layout/section-wrapper";
import { Reveal } from "@/components/motion/reveal";
import { StaggerContainer, StaggerItem } from "@/components/motion/stagger";
import { SkillLayerCard } from "@/components/sections/skill-layer-card";
import { SectionHeader } from "@/components/sections/section-header";
import { groupSkillsByCategory, skillLayers, skills } from "@/data/skills";

const ACCENTS: Record<string, 1 | 2 | 3 | 4> = { frontend: 4, backend: 1, database: 3, tools: 2 };

const skillsByCategory = groupSkillsByCategory(skills);

export function Skills() {
  return (
    <SectionWrapper id="skills" width="wide">
      <Reveal>
        <SectionHeader
          index="04"
          label="skills"
          title="The stack, layer by layer"
          description="From the interface down to the database, and the tools that keep it all shipping."
        />
      </Reveal>

      <StaggerContainer className="mt-8 grid gap-5 lg:grid-cols-2">
        {skillLayers.map((layer, i) => {
          const isFullWidth = layer.category === "frontend" || layer.category === "backend";
          return (
            <StaggerItem key={layer.id} className={isFullWidth ? "min-w-0 lg:col-span-2" : "min-w-0"}>
              <SkillLayerCard
                index={i + 1}
                title={layer.title}
                subtitle={layer.subtitle}
                icon={layer.icon}
                skills={skillsByCategory.get(layer.category) ?? []}
                emphasized={layer.emphasized}
                accent={ACCENTS[layer.category] ?? 1}
                className="h-full"
              />
            </StaggerItem>
          );
        })}
      </StaggerContainer>
    </SectionWrapper>
  );
}
