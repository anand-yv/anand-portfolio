import { SectionWrapper } from "@/components/layout/section-wrapper";
import { Reveal } from "@/components/motion/reveal";
import { StaggerContainer, StaggerItem } from "@/components/motion/stagger";
import { SkillLayerCard } from "@/components/sections/skill-layer-card";
import { SectionHeader } from "@/components/sections/section-header";
import { groupSkillsByCategory, skillLayers, skills } from "@/data/skills";
import { Wrench } from "lucide-react";

const skillsByCategory = groupSkillsByCategory(skills);

export function Skills() {
  return (
    <SectionWrapper id="skills" width="wide">
      <Reveal>
        <SectionHeader
          icon={<Wrench />}
          label="02 — Skills"
          title="Tech stack"
          description="How the stack is organized from UI to data and tooling."
        />
      </Reveal>

      <StaggerContainer className="mt-8 grid gap-4 sm:mt-10 sm:gap-5 lg:grid-cols-2">
        {skillLayers.map((layer) => {
          const isFullWidth =
            layer.category === "frontend" || layer.category === "backend";

          return (
            <StaggerItem
              key={layer.id}
              className={isFullWidth ? "min-w-0 lg:col-span-2" : "min-w-0"}
            >
              <SkillLayerCard
                title={layer.title}
                subtitle={layer.subtitle}
                icon={layer.icon}
                skills={skillsByCategory.get(layer.category) ?? []}
                emphasized={layer.emphasized}
                className="h-full"
              />
            </StaggerItem>
          );
        })}
      </StaggerContainer>
    </SectionWrapper>
  );
}
