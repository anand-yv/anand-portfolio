import { SectionWrapper } from "@/components/layout/section-wrapper";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/sections/section-header";
import { personalInfo } from "@/data/personal";
import Link from "next/link";
import { ArrowUpRight, Send } from "lucide-react";

export function Contact() {
  return (
    <SectionWrapper id="contact">
      <Reveal>
        <SectionHeader
          icon={<Send />}
          label="06 — Contact"
          title="Contact"
          description="Reach out if you'd like to talk about a role or a project."
        />
      </Reveal>

      <Reveal delayMs={50}>
        <div className="mt-10 space-y-8">
          <Link
            href={`mailto:${personalInfo.email}`}
            className="inline-flex items-center justify-center rounded-lg bg-brand px-6 py-3 text-base font-medium text-brand-foreground shadow-sm transition-[transform,box-shadow] duration-200 hover:scale-[1.02] hover:shadow-md hover:shadow-brand/25"
          >
            {personalInfo.email}
          </Link>

          <p className="text-sm text-muted-foreground">{personalInfo.location}</p>

          <div className="flex flex-wrap gap-5 text-sm">
            {personalInfo.github ? (
              <Link
                href={personalInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-0.5 text-muted-foreground transition-colors hover:text-brand"
              >
                GitHub
                <ArrowUpRight className="size-3.5" aria-hidden />
              </Link>
            ) : null}
            {personalInfo.linkedin ? (
              <Link
                href={personalInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-0.5 text-muted-foreground transition-colors hover:text-brand"
              >
                LinkedIn
                <ArrowUpRight className="size-3.5" aria-hidden />
              </Link>
            ) : null}
          </div>
        </div>
      </Reveal>
    </SectionWrapper>
  );
}
