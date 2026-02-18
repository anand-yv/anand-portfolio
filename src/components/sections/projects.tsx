import { SectionWrapper } from "@/components/layout/section-wrapper";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/sections/section-header";
import { projects } from "@/data/projects";
import { ProjectCard } from "@/components/ui/project-card";
import { Code2 } from "lucide-react";

export function Projects() {
  const [featuredProject, ...otherProjects] = projects;

  return (
    <SectionWrapper id="projects">
      <div className="max-w-7xl mx-auto">
        <Reveal>
          <SectionHeader
            icon={<Code2 />}
            title="Projects"
            description="Full-stack systems with thoughtful APIs, data design, and clean user experiences."
          />
        </Reveal>

        <div className="mt-12 space-y-10">
          {/* Featured Project (case-study style) */}
          <Reveal delayMs={80}>
            <div className="relative">
              <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-br from-primary/10 via-transparent to-transparent blur-3xl opacity-60 dark:opacity-35" />
              <ProjectCard project={featuredProject} variant="featured" />
            </div>
          </Reveal>

          {/* Compact grid (less text) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {otherProjects.map((project, idx) => (
              <Reveal key={project.id} delayMs={140 + idx * 60}>
                <ProjectCard project={project} variant="compact" />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
