import { SectionWrapper } from "@/components/layout/section-wrapper";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/sections/section-header";
import { Timeline } from "@/components/ui/timeline";
import { education } from "@/data/education";
import { experience } from "@/data/experience";

/** Experience and education side by side (one section, one scroll-spy target). */
export function Journey() {
  const work = experience.map((exp) => ({
    id: exp.id,
    title: exp.position,
    subtitle: `${exp.company.replace(" Private Limited", "")} · ${exp.location}`,
    period: `${exp.startDate} – ${exp.endDate}`,
    description: exp.description,
    technologies: exp.technologies,
  }));

  const school = education.map((edu) => ({
    id: edu.id,
    title: edu.degree,
    subtitle: `${edu.institution} · ${edu.field}`,
    period: `${edu.startDate} – ${edu.endDate}`,
    description: edu.description || [],
  }));

  return (
    <SectionWrapper id="experience" width="wide">
      <Reveal>
        <SectionHeader
          index="02"
          label="experience & education"
          title="Where I've worked and studied"
          description="Roles, impact, and the foundation behind the engineering work."
        />
      </Reveal>

      <div className="mt-8 grid gap-10 lg:grid-cols-5 lg:gap-8">
        <Reveal delayMs={60} className="lg:col-span-3">
          <p className="mb-4 font-hand text-2xl text-link">work</p>
          <Timeline items={work} maxPoints={4} variant="experience" />
        </Reveal>
        <div id="education" className="scroll-mt-24 lg:col-span-2">
          <Reveal delayMs={120}>
            <p className="mb-4 font-hand text-2xl text-link">school</p>
            <Timeline items={school} maxPoints={3} variant="education" />
          </Reveal>
        </div>
      </div>
    </SectionWrapper>
  );
}
