import { SectionWrapper } from "@/components/layout/section-wrapper";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/sections/section-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { personalInfo } from "@/data/personal";
import { User } from "lucide-react";

export function About() {
  return (
    <SectionWrapper id="about">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <SectionHeader
            icon={<User />}
            title="About"
            description="Full-stack engineer with a focus on clean APIs, solid data models, and UX that feels effortless."
          />
        </Reveal>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-10 lg:gap-14 items-start">
          {/* Left: Text */}
          <Reveal delayMs={80}>
            <div className="space-y-5 text-lg text-muted-foreground leading-relaxed">
              <p>
                I'm a full-stack software engineer based in Mumbai, India, with a
                focus on building scalable systems. I enjoy designing RESTful APIs,
                working with relational and NoSQL databases, and shipping frontends
                that stay fast and maintainable as they grow.
              </p>
              <p>
                In production work, I build with Spring Boot and React, and I care
                about performance, security, and operational simplicity. I like
                making systems observable, predictable under load, and easy for other
                developers to extend.
              </p>
              <p>
                Outside of work, I keep learning — exploring new tools, reading
                engineering deep-dives, and improving my craft through consistent
                practice.
              </p>
            </div>
          </Reveal>

          {/* Right: Highlight Card */}
          <Reveal delayMs={140}>
            <div className="relative">
              <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-br from-primary/15 via-transparent to-transparent blur-2xl opacity-60 dark:opacity-40" />
              <Card className="rounded-3xl border bg-card/50 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl">Focus Areas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-foreground">APIs</h4>
                    <p className="text-sm text-muted-foreground">
                      RESTful design, clear contracts, predictable responses
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-foreground">Systems</h4>
                    <p className="text-sm text-muted-foreground">
                      Scalable architecture, resilient services, clean data models
                    </p>
                  </div>
                  <div className="space-y-2 pt-4">
                    <h4 className="text-sm font-semibold text-foreground">Location</h4>
                    <p className="text-sm text-muted-foreground">
                      {personalInfo.location}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </Reveal>
        </div>
      </div>
    </SectionWrapper>
  );
}
