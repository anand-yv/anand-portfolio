"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { TechChip } from "@/components/ui/tech-chip";
import { personalInfo } from "@/data/personal";

const ResumeDialog = dynamic(
  () =>
    import("@/components/resume-dialog").then((m) => ({ default: m.ResumeDialog })),
  { ssr: false }
);

export function HeroCta() {
  return (
    <>
      <Reveal delayMs={190}>
        <div className="mt-6 flex flex-wrap gap-2">
          {["Java", "Spring Boot", "Microservices", "React", "TypeScript", "PostgreSQL"].map(
            (t) => (
              <TechChip key={t} tech={t} />
            )
          )}
        </div>
      </Reveal>

      <Reveal delayMs={230}>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 items-start">
          <Button
            size="lg"
            asChild
            className="h-11 px-7 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 ease-out"
          >
            <Link href="#projects">View Projects</Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            asChild
            className="h-11 px-7 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:bg-accent/60 transition-all duration-200 ease-out"
          >
            <Link href="#contact">Contact</Link>
          </Button>
          {personalInfo.resumeUrl ? (
            <ResumeDialog>
              <Button
                size="lg"
                variant="ghost"
                className="h-11 px-7 rounded-xl hover:bg-accent/60 hover:-translate-y-0.5 transition-all duration-200 ease-out"
              >
                Resume
              </Button>
            </ResumeDialog>
          ) : null}
        </div>
      </Reveal>
    </>
  );
}
