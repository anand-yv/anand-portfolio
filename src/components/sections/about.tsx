import * as React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SectionWrapper } from "@/components/layout/section-wrapper";
import { Reveal } from "@/components/motion/reveal";
import { Marker } from "@/components/motion/marker";
import { SectionHeader } from "@/components/sections/section-header";
import { aboutNarrative } from "@/data/about";
import { education } from "@/data/education";
import { experience } from "@/data/experience";
import { personalInfo } from "@/data/personal";

const currentRole = experience[0];
const latestEdu = education[0];

const HIGHLIGHTS = ["Spring Boot", "React", "clear contracts", "sane database design"];

/** Wraps known phrases in an animated marker highlight. */
function withMarkers(text: string) {
  const pattern = new RegExp(`(${HIGHLIGHTS.map((h) => h.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "g");
  return text.split(pattern).map((part, i) =>
    HIGHLIGHTS.includes(part) ? (
      <Marker key={i} delay={0.2 + i * 0.05}>
        {part}
      </Marker>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    )
  );
}

export function About() {
  const [lead, ...rest] = aboutNarrative;
  const facts: { label: string; value: string }[] = [
    { label: "based in", value: personalInfo.location.split(",")[0] },
    { label: "role", value: currentRole ? currentRole.position : personalInfo.title },
    { label: "at", value: currentRole ? currentRole.company.replace(" Private Limited", "") : "—" },
    { label: "focus", value: "Spring Boot · React" },
    ...(latestEdu ? [{ label: "studied", value: `${latestEdu.institution}, ${latestEdu.endDate}` }] : []),
  ];

  return (
    <SectionWrapper id="about" width="wide">
      <Reveal>
        <SectionHeader index="01" label="about" title="A bit about me" description="What I do day to day." />
      </Reveal>

      <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:gap-10">
        <Reveal delayMs={60} className="lg:col-span-7">
          <p className="font-display text-xl font-medium leading-snug tracking-tight text-foreground sm:text-2xl sm:leading-snug">
            {withMarkers(lead)}
          </p>
          {rest.length > 0 ? (
            <div className="mt-4 max-w-xl space-y-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              {rest.map((paragraph, i) => (
                <p key={i}>{withMarkers(paragraph)}</p>
              ))}
            </div>
          ) : null}
        </Reveal>

        <Reveal delayMs={140} className="lg:col-span-5">
          <div className="sketch-box sketch-tilt relative p-5" style={{ "--tilt": "1.2deg" } as React.CSSProperties}>
            <span className="sketch-tape" aria-hidden />
            <p className="font-hand text-2xl text-link">quick facts</p>
            <dl className="mt-3 divide-y-2 divide-dashed divide-ink/20">
              {facts.map((f) => (
                <div key={f.label} className="flex items-baseline justify-between gap-4 py-2.5">
                  <dt className="font-mono text-xs uppercase tracking-wider text-muted-foreground">{f.label}</dt>
                  <dd className="text-right text-sm font-medium text-foreground">{f.value}</dd>
                </div>
              ))}
            </dl>
            <Link
              href="#experience"
              className="mt-4 inline-flex items-center gap-1 font-hand text-xl text-foreground underline decoration-brand decoration-2 underline-offset-4 transition-colors hover:text-link"
            >
              see my experience <ArrowUpRight className="size-4" aria-hidden />
            </Link>
          </div>
        </Reveal>
      </div>
    </SectionWrapper>
  );
}
