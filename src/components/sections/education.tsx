import { SectionWrapper } from "@/components/layout/section-wrapper";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/sections/section-header";
import { education } from "@/data/education";
import { Timeline } from "@/components/ui/timeline";
import { GraduationCap } from "lucide-react";

export function Education() {
  const timelineItems = education.map((edu) => ({
    id: edu.id,
    title: edu.degree,
    subtitle: `${edu.field} - ${edu.institution}`,
    period: `${edu.startDate} - ${edu.endDate}`,
    description: edu.description || [],
  }));

  return (
    <SectionWrapper id="education">
      <div className="max-w-4xl mx-auto space-y-8">
        <Reveal>
          <SectionHeader icon={<GraduationCap />} title="Education" />
        </Reveal>
        <Reveal delayMs={80}>
          <Timeline items={timelineItems} />
        </Reveal>
      </div>
    </SectionWrapper>
  );
}

