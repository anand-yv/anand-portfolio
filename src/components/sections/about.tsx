import { SectionWrapper } from "@/components/layout/section-wrapper";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/sections/section-header";
import { personalInfo } from "@/data/personal";
import { User } from "lucide-react";

export function About() {
  return (
    <SectionWrapper id="about">
      <Reveal>
        <SectionHeader
          icon={<User />}
          label="01 — About"
          title="About"
          description="What I do day to day."
        />
      </Reveal>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14 lg:items-start">
        <Reveal delayMs={60}>
          <div className="space-y-4 text-[0.95rem] leading-relaxed text-muted-foreground">
            <p>
              I&apos;m a software engineer in {personalInfo.location.split(",")[0]}.
              Most of my work is Spring Boot on the server and React on the client —
              booking flows, internal tools, and APIs that other teams depend on.
            </p>
            <p>
              I care about clear contracts, sane database design, and code that the
              next person can change without guessing. Before shipping, I like to
              know how something behaves under load and how we&apos;d debug it at 2am.
            </p>
          </div>
        </Reveal>

        <Reveal delayMs={120}>
          <div className="glass-panel rounded-xl p-6 transition-shadow duration-300 hover:shadow-md hover:shadow-brand/10">
            <dl className="grid gap-5">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-brand">
                  Backend
                </dt>
                <dd className="mt-1 text-sm text-foreground/90">
                  REST APIs, auth, service boundaries
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-brand">
                  Data
                </dt>
                <dd className="mt-1 text-sm text-foreground/90">
                  PostgreSQL, MongoDB, migrations
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-brand">
                  Frontend
                </dt>
                <dd className="mt-1 text-sm text-foreground/90">
                  React, TypeScript, product UI
                </dd>
              </div>
            </dl>
          </div>
        </Reveal>
      </div>
    </SectionWrapper>
  );
}
