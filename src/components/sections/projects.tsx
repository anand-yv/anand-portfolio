import { SectionWrapper } from "@/components/layout/section-wrapper";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/sections/section-header";
import { ProjectsFan } from "@/components/sections/projects-fan";
import { projects } from "@/data/projects";

export function Projects() {
  return (
    <SectionWrapper id="projects" width="wide">
      <Reveal>
        <SectionHeader
          index="03"
          label="projects"
          title="Things I've built"
          description="A hand of cards: swipe through them, then flip one to read the details."
        />
      </Reveal>
      <div className="mt-10">
        <ProjectsFan projects={projects} />
      </div>
    </SectionWrapper>
  );
}
