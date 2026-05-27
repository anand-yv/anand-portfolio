import { SectionWrapper } from "@/components/layout/section-wrapper";
import { HeroAtmosphere } from "@/components/sections/hero-atmosphere";
import { HeroMotion } from "@/components/sections/hero-motion";
import { HERO_ROLE_FALLBACK } from "@/components/sections/hero-tagline";

/**
 * Server Component: heading and LCP paragraph are passed as props so they ship
 * in the initial HTML for fast LCP (rendered by the server, hydrated in place).
 */
export function Hero() {
  return (
    <SectionWrapper
      id="hero"
      bordered={false}
      width="wide"
      atmosphere={<HeroAtmosphere />}
      className="flex min-h-[92vh] items-center pt-14 pb-20 sm:min-h-[90vh]"
    >
      <HeroMotion
        heading={
          <h1 className="text-4xl font-bold tracking-tight leading-[1.05] sm:text-6xl lg:text-7xl">
            <span className="text-foreground">Anand </span>
            <span className="bg-gradient-to-r from-brand via-brand to-foreground bg-clip-text text-transparent">
              Yadav
            </span>
          </h1>
        }
        lcpParagraph={
          <>
            I design scalable{" "}
            <span className="font-semibold text-foreground">APIs</span>, robust{" "}
            <span className="font-semibold text-foreground">systems</span>, and
            clean user experiences.
          </>
        }
      />
      <span className="sr-only">{HERO_ROLE_FALLBACK}</span>
    </SectionWrapper>
  );
}
