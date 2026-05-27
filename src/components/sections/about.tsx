import Link from "next/link";
import { ArrowUpRight, MapPin, User } from "lucide-react";
import { SectionWrapper } from "@/components/layout/section-wrapper";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/sections/section-header";
import { aboutNarrative } from "@/data/about";
import { experience } from "@/data/experience";
import { personalInfo } from "@/data/personal";

const currentRole = experience[0];

function formatCompany(name: string) {
  return name.replace(" Private Limited", "");
}

export function About() {
  const [lead, ...rest] = aboutNarrative;

  return (
    <SectionWrapper id="about" width="wide">
      <Reveal>
        <SectionHeader
          icon={<User />}
          label="01 — About"
          title="About"
          description="What I do day to day."
        />
      </Reveal>

      <div className="mt-8 grid gap-4 sm:mt-10 lg:grid-cols-12 lg:items-stretch lg:gap-5">
        <Reveal delayMs={50} className="lg:col-span-7">
          <div className="relative h-full overflow-hidden rounded-xl border border-border/80 bg-card/50 p-6 sm:p-8">
            <div
              className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-brand/80 via-brand/40 to-transparent"
              aria-hidden
            />
            <p className="pl-4 text-lg font-medium leading-snug tracking-tight text-foreground sm:text-xl sm:leading-snug">
              {lead}
            </p>
            {rest.length > 0 ? (
              <div className="mt-5 space-y-4 pl-4 text-[0.95rem] leading-relaxed text-muted-foreground">
                {rest.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            ) : null}
          </div>
        </Reveal>

        <Reveal delayMs={100} className="lg:col-span-5">
          <div className="group relative flex h-full flex-col justify-between overflow-hidden rounded-xl border border-border/80 bg-gradient-to-br from-card/80 via-card/60 to-brand-muted/25 p-6 transition-shadow duration-300 hover:border-brand/30 hover:shadow-lg hover:shadow-brand/10">
            <div
              className="pointer-events-none absolute -right-10 -top-10 size-36 rounded-full bg-brand/15 blur-2xl"
              aria-hidden
            />
            <div>
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-brand">
                  Currently
                </p>
                {currentRole?.endDate === "Present" ? (
                  <span className="rounded-full border border-brand/30 bg-brand-muted px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-brand">
                    Present
                  </span>
                ) : null}
              </div>
              {currentRole ? (
                <div className="mt-4 space-y-1">
                  <p className="text-lg font-semibold tracking-tight text-foreground">
                    {currentRole.position}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatCompany(currentRole.company)}
                  </p>
                  <p className="text-xs text-muted-foreground/80">
                    {currentRole.startDate} — {currentRole.endDate}
                  </p>
                </div>
              ) : (
                <p className="mt-4 text-lg font-semibold text-foreground">
                  {personalInfo.title}
                </p>
              )}
              <div className="mt-4 flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin
                  className="mt-0.5 size-4 shrink-0 text-brand"
                  aria-hidden
                />
                <span>{personalInfo.location}</span>
              </div>
            </div>
            <Link
              href="#experience"
              className="relative mt-6 inline-flex w-fit items-center gap-1.5 rounded-lg border border-border/80 bg-background/60 px-3.5 py-2 text-sm font-medium text-foreground transition-colors hover:border-brand/40 hover:bg-brand-muted hover:text-brand"
            >
              View experience
              <ArrowUpRight className="size-4 text-brand" aria-hidden />
            </Link>
          </div>
        </Reveal>
      </div>
    </SectionWrapper>
  );
}
