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
    subtitle: `${exp.company.replace(" Private Limited", "")} · ${exp.location}`,
    period: `${exp.startDate} – ${exp.endDate}`,
    description: exp.description,
    technologies: exp.technologies,
  }));

  return (
    <SectionWrapper id="experience" width="wide">
      <Reveal>
        <SectionHeader
          icon={<Briefcase />}
          label="04 — Experience"
          title="Experience"
          description="Roles, impact, and the systems I've helped build."
        />
      </Reveal>
      <Reveal delayMs={50}>
        <div className="mt-8 sm:mt-10">
          <Timeline
            items={timelineItems}
            maxPoints={4}
            variant="experience"
          />
        </div>
      </Reveal>
    </SectionWrapper>
  );
}
