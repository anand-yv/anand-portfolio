import { SectionWrapper } from "@/components/layout/section-wrapper";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/sections/section-header";
import { StaggerContainer, StaggerItem } from "@/components/motion/stagger";
import { projects } from "@/data/projects";
import { ProjectCard } from "@/components/ui/project-card";
import { Code2 } from "lucide-react";

export function Projects() {
  const [featuredProject, ...otherProjects] = projects;

  return (
    <SectionWrapper id="projects" width="wide">
      <Reveal>
        <SectionHeader
          icon={<Code2 />}
          label="03 — Projects"
          title="Projects"
          description="A few things I've built or contributed to."
        />
      </Reveal>

      <StaggerContainer className="mt-10 grid gap-4 sm:grid-cols-2">
        <StaggerItem className="sm:col-span-2">
          <ProjectCard project={featuredProject} featured />
        </StaggerItem>
        {otherProjects.map((project) => (
          <StaggerItem key={project.id}>
            <ProjectCard project={project} />
          </StaggerItem>
        ))}
      </StaggerContainer>
    </SectionWrapper>
  );
}
