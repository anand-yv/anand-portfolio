import { SectionWrapper } from "@/components/layout/section-wrapper";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/sections/section-header";
import { SkillStickerSheet } from "@/components/sections/skill-sticker-sheet";
import { skillLayers, skills } from "@/data/skills";

export function Skills() {
  return (
    <SectionWrapper id="skills" width="wide">
      <Reveal>
        <SectionHeader
          index="04"
          label="skills"
          title="What I build with"
        />
      </Reveal>
      <Reveal delayMs={60} className="mt-8">
        <SkillStickerSheet skills={skills} layers={skillLayers} />
      </Reveal>
    </SectionWrapper>
  );
}
