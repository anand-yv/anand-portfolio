import Link from "next/link";

import { SectionWrapper } from "@/components/layout/section-wrapper";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TechChip } from "@/components/ui/tech-chip";
import { personalInfo } from "@/data/personal";

export function Hero() {
  return (
    <SectionWrapper
      id="hero"
      className="min-h-screen flex items-center pt-16 relative overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        {/* Smooth top fade - starts above viewport to prevent line */}
        <div className="absolute -top-32 inset-x-0 h-96 bg-gradient-to-b from-transparent via-transparent to-oklch(0.65_0.18_264_/_0.08) dark:to-oklch(0.65_0.18_264_/_0.12)" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_800px_600px_at_50%_-20%,oklch(0.65_0.18_264_/_0.12),transparent_60%)] dark:bg-[radial-gradient(ellipse_800px_600px_at_50%_-20%,oklch(0.65_0.18_264_/_0.15),transparent_60%)]" />
        <div className="absolute -top-24 left-[-10rem] h-72 w-[44rem] rounded-full bg-gradient-to-r from-primary/20 via-primary/10 to-transparent blur-3xl opacity-60 dark:opacity-30" />
        <div className="absolute -bottom-28 right-[-14rem] h-80 w-[46rem] rounded-full bg-gradient-to-l from-primary/20 via-transparent to-transparent blur-3xl opacity-50 dark:opacity-25" />
      </div>

      <div className="mx-auto w-full max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-14 items-center">
          {/* Left */}
          <div className="text-left">
            <Reveal delayMs={0}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]">
                <span className="text-foreground">Anand </span>
                <span className="bg-gradient-to-r from-primary via-primary to-foreground bg-clip-text text-transparent">
                  Yadav
                </span>
              </h1>
            </Reveal>

            <Reveal delayMs={90}>
              <p className="mt-4 text-lg sm:text-xl text-muted-foreground">
                Full-Stack Software Engineer
              </p>
            </Reveal>

            <Reveal delayMs={140}>
              <p className="mt-3 text-xl sm:text-2xl text-foreground/90 max-w-xl">
                I design scalable{" "}
                <span className="font-semibold text-foreground">APIs</span>, robust{" "}
                <span className="font-semibold text-foreground">systems</span>, and
                clean user experiences.
              </p>
            </Reveal>

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
                  <Button
                    size="lg"
                    variant="ghost"
                    asChild
                    className="h-11 px-7 rounded-xl hover:bg-accent/60 hover:-translate-y-0.5 transition-all duration-200 ease-out"
                  >
                    <Link
                      href={personalInfo.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Resume
                    </Link>
                  </Button>
                ) : null}
              </div>
            </Reveal>
          </div>

          {/* Right */}
          <Reveal delayMs={180}>
            <div className="relative">
              <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-b from-primary/15 via-transparent to-transparent blur-2xl opacity-60 dark:opacity-35" />
              <Card className="rounded-3xl border bg-card/40 shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="size-2.5 rounded-full bg-red-500/70" />
                      <span className="size-2.5 rounded-full bg-yellow-500/70" />
                      <span className="size-2.5 rounded-full bg-green-500/70" />
                    </div>
                    <span className="text-xs text-muted-foreground font-mono">
                      system.log
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="animate-floaty motion-reduce:animate-none">
                    <pre className="overflow-hidden rounded-2xl border bg-background/60 p-4 text-[12px] leading-5 text-muted-foreground">
{`$ curl -X POST /api/bookings \\
  -H "Authorization: Bearer <token>" \\
  -d '{ "flightId": "AI-203", "seats": 2 }'

✓ 201 Created
{
  "bookingId": "BK-7F3A",
  "status": "CONFIRMED",
  "payment": "CAPTURED",
  "latencyMs": 84
}

trace: gateway → auth → booking → payments → notifications`}
                    </pre>
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">
                    Clean contracts, resilient services, and predictable performance.
                  </p>
                </CardContent>
              </Card>
            </div>
          </Reveal>
        </div>
      </div>
    </SectionWrapper>
  );
}

