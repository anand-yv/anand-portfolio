import { SectionWrapper } from "@/components/layout/section-wrapper";
import { HeroTagline } from "@/components/sections/hero-tagline";
import { HeroCta } from "@/components/sections/hero-cta";
import { HeroCard } from "@/components/sections/hero-card";

/**
 * Hero is a Server Component. The h1 and LCP paragraph (p.mt-3.text-xl...)
 * are rendered on the server with no client boundary above them, so they
 * paint immediately without waiting for hydration or main-thread JS.
 */
export function Hero() {
  return (
    <SectionWrapper
      id="hero"
      className="min-h-screen flex items-center pt-16 relative overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 inset-x-0 h-96 bg-gradient-to-b from-transparent via-transparent to-oklch(0.65_0.18_264_/_0.08) dark:to-oklch(0.65_0.18_264_/_0.12)" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_800px_600px_at_50%_-20%,oklch(0.65_0.18_264_/_0.12),transparent_60%)] dark:bg-[radial-gradient(ellipse_800px_600px_at_50%_-20%,oklch(0.65_0.18_264_/_0.15),transparent_60%)]" />
        <div className="absolute -top-24 left-[-10rem] h-72 w-[44rem] rounded-full bg-gradient-to-r from-primary/20 via-primary/10 to-transparent blur-3xl opacity-60 dark:opacity-30" />
        <div className="absolute -bottom-28 right-[-14rem] h-80 w-[46rem] rounded-full bg-gradient-to-l from-primary/20 via-transparent to-transparent blur-3xl opacity-50 dark:opacity-25" />
      </div>

      <div className="mx-auto w-full max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-14 items-center">
          <div className="text-left">
            {/* Server-rendered; no Reveal wrapper so no client boundary or transition delay */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]">
              <span className="text-foreground">Anand </span>
              <span className="bg-gradient-to-r from-primary via-primary to-foreground bg-clip-text text-transparent">
                Yadav
              </span>
            </h1>

            <HeroTagline />

            {/* LCP element: server-rendered so it paints without waiting for hydration */}
            <p className="mt-3 text-xl sm:text-2xl text-foreground/90 max-w-xl">
              I design scalable{" "}
              <span className="font-semibold text-foreground">APIs</span>, robust{" "}
              <span className="font-semibold text-foreground">systems</span>, and
              clean user experiences.
            </p>

            <HeroCta />
          </div>

          <HeroCard />
        </div>
      </div>
    </SectionWrapper>
  );
}
