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
      className="py-0 pt-10 pb-16 sm:pb-20 min-h-[clamp(26rem,calc(68dvh-3.5rem),40rem)]"
    >
      <HeroMotion
        heading={
          <>
          <p className="mb-1 -rotate-2 font-hand text-2xl text-link">hello, I&apos;m</p>
          <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            <span className="text-foreground">Anand </span>
            <span className="hero-marker relative inline-block text-foreground dark:text-brand">Yadav</span>
          </h1>
          </>
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
