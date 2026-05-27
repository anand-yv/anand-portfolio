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
    <SectionWrapper id="education" width="wide">
      <Reveal>
        <SectionHeader
          icon={<GraduationCap />}
          label="05 — Education"
          title="Education"
          description="Academic foundation behind the engineering work."
        />
      </Reveal>
      <Reveal delayMs={50}>
        <div className="mt-8 sm:mt-10">
          <Timeline
            items={timelineItems}
            maxPoints={3}
            variant="education"
          />
        </div>
      </Reveal>
    </SectionWrapper>
  );
}
