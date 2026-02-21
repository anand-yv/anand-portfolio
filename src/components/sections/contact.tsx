import { SectionWrapper } from "@/components/layout/section-wrapper";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/sections/section-header";
import { personalInfo } from "@/data/personal";
import { Button } from "@/components/ui/button";
import { Send, Mail, MapPin, Github, Linkedin } from "lucide-react";
import Link from "next/link";

export function Contact() {
  return (
    <SectionWrapper id="contact">
      <div className="max-w-2xl mx-auto">
        <Reveal>
          <SectionHeader
            icon={<Send />}
            title="Get in touch"
            description="Open to full-stack roles — happy to chat about systems design, APIs, and production engineering."
          />
        </Reveal>

        <Reveal delayMs={80}>
          <div className="mt-10 sm:mt-12 space-y-8">
            {/* Primary CTA block */}
            <div className="relative">
              <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-br from-primary/12 via-primary/5 to-transparent dark:from-primary/20 dark:via-primary/8 blur-2xl opacity-80" />
              <div className="rounded-2xl border bg-card/60 dark:bg-card/40 shadow-sm p-8 sm:p-10 text-center">
                <p className="text-lg sm:text-xl text-muted-foreground mb-6">
                  Have a role in mind or want to talk tech? Drop a line.
                </p>
                <Button
                  size="lg"
                  asChild
                  className="h-12 px-8 rounded-xl text-base font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                >
                  <Link
                    href={`mailto:${personalInfo.email}`}
                    className="inline-flex items-center gap-2"
                  >
                    <Mail className="size-5" aria-hidden />
                    {personalInfo.email}
                  </Link>
                </Button>
              </div>
            </div>

            {/* Location + social row */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="size-4 shrink-0 text-primary/80" aria-hidden />
                <span className="text-sm">{personalInfo.location}</span>
              </div>
              <div className="flex items-center gap-2">
                {personalInfo.github && (
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="rounded-full h-9 px-4 border-muted-foreground/30 hover:border-foreground/40 hover:text-foreground hover:bg-accent/50 transition-colors"
                  >
                    <Link
                      href={personalInfo.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="GitHub profile"
                    >
                      <Github className="size-4 mr-2" />
                      GitHub
                    </Link>
                  </Button>
                )}
                {personalInfo.linkedin && (
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="rounded-full h-9 px-4 border-muted-foreground/30 hover:border-foreground/40 hover:text-foreground hover:bg-accent/50 transition-colors"
                  >
                    <Link
                      href={personalInfo.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn profile"
                    >
                      <Linkedin className="size-4 mr-2" />
                      LinkedIn
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </SectionWrapper>
  );
}
