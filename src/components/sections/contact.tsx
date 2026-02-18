import { SectionWrapper } from "@/components/layout/section-wrapper";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/sections/section-header";
import { personalInfo } from "@/data/personal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Github, Linkedin, Send, Mail, MapPin } from "lucide-react";
import Link from "next/link";

export function Contact() {
  return (
    <SectionWrapper id="contact">
      <div className="max-w-2xl mx-auto">
        <Reveal>
          <SectionHeader
            icon={<Send />}
            title="Contact"
            description="Open to full-stack roles — happy to chat about systems design, APIs, and production engineering."
          />
        </Reveal>

        <Reveal delayMs={80}>
          <div className="mt-8 relative">
            <div className="absolute -inset-4 -z-10 rounded-2xl bg-gradient-to-br from-primary/10 via-transparent to-transparent blur-2xl opacity-50 dark:opacity-30" />
            <Card className="rounded-2xl border bg-card/50 shadow-lg p-6">
              <CardContent className="space-y-4">
                {/* Email & Location Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      <Mail className="size-3.5" />
                      Email
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="w-full justify-start rounded-lg"
                    >
                      <Link href={`mailto:${personalInfo.email}`}>
                        {personalInfo.email}
                      </Link>
                    </Button>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      <MapPin className="size-3.5" />
                      Location
                    </div>
                    <p className="text-sm text-foreground">{personalInfo.location}</p>
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex gap-3 pt-2">
                  {personalInfo.github && (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="flex-1 rounded-lg"
                    >
                      <Link
                        href={personalInfo.github}
                        target="_blank"
                        rel="noopener noreferrer"
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
                      className="flex-1 rounded-lg"
                    >
                      <Link
                        href={personalInfo.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Linkedin className="size-4 mr-2" />
                        LinkedIn
                      </Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </Reveal>
      </div>
    </SectionWrapper>
  );
}
