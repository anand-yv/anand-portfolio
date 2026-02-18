import { SectionWrapper } from "@/components/layout/section-wrapper";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/sections/section-header";
import { experience } from "@/data/experience";
import { Timeline } from "@/components/ui/timeline";
import { Briefcase } from "lucide-react";

export function Experience() {
  const timelineItems = experience.map((exp) => ({
    id: exp.id,
    title: exp.position,
    subtitle: exp.company,
    period: `${exp.startDate} - ${exp.endDate}`,
    description: exp.description,
    technologies: exp.technologies,
  }));

  return (
    <SectionWrapper id="experience">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <SectionHeader
            icon={<Briefcase />}
            title="Experience"
            description="Building production systems with Spring Boot, React, and modern backend patterns."
          />
        </Reveal>
        <Reveal delayMs={80}>
          <div className="mt-12">
            <Timeline items={timelineItems} />
          </div>
        </Reveal>
      </div>
    </SectionWrapper>
  );
}

