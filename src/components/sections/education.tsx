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
    subtitle: `${edu.institution} · ${edu.field}`,
    period: `${edu.startDate} – ${edu.endDate}`,
    description: edu.description || [],
  }));

  return (
    <SectionWrapper id="education">
      <Reveal>
        <SectionHeader
          icon={<GraduationCap />}
          label="05 — Education"
          title="Education"
        />
      </Reveal>
      <Reveal delayMs={50}>
        <div className="mt-10">
          <Timeline items={timelineItems} />
        </div>
      </Reveal>
    </SectionWrapper>
  );
}
