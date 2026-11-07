"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { HeroCta } from "@/components/sections/hero-cta";
import { HeroTagline } from "@/components/sections/hero-tagline";
import { HeroShowcase } from "@/components/sections/hero-showcase";
import { personalInfo } from "@/data/personal";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const spring = { type: "spring" as const, stiffness: 100, damping: 20 };

type HeroMotionProps = {
  heading: React.ReactNode;
  lcpParagraph: React.ReactNode;
};

export function HeroMotion({ heading, lcpParagraph }: HeroMotionProps) {
  const reduced = useReducedMotion();

  const item = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { ...spring, delay },
        };

  return (
    <div className="relative w-full">
      <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
        <div className="min-w-0">
          <motion.div {...item(0.05)}>
            {heading}
          </motion.div>

          <motion.div {...item(0.1)}>
            <HeroTagline />
          </motion.div>

          <motion.div
            className="mt-5 max-w-xl text-base leading-relaxed text-foreground/90 sm:text-lg"
            {...item(0.16)}
          >
            {lcpParagraph}
          </motion.div>

          <motion.div {...item(0.22)}>
            <HeroCta />
          </motion.div>

          {personalInfo.availability?.open ? (
            <motion.div className="relative mt-7 inline-block pl-9" {...item(0.3)}>
              {/* hand-drawn arrow curling up toward the buttons */}
              <svg viewBox="0 0 48 44" className="absolute -top-5 left-0 hidden h-11 w-12 text-ink/70 sm:block" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M40 38 C 12 40, 4 24, 14 8" />
                <path d="M6 15 L14 7 L21 15" />
              </svg>
              <div
                className="sketch-box sketch-box--sm relative -rotate-1 px-4 py-2.5 text-[oklch(0.19_0.02_270)]"
                style={{ background: "var(--pop-1)" }}
              >
                <span className="sketch-tape sketch-tape--sm" aria-hidden />
                <p className="font-hand text-2xl leading-[1.15]">
                  psst… <span className="font-bold">{personalInfo.availability.text}</span>
                </p>
              </div>
            </motion.div>
          ) : null}

          <motion.p className="mt-6" {...item(0.34)}>
            <Link
              href="#about"
              className="font-hand text-xl text-muted-foreground underline decoration-dashed underline-offset-4 transition-colors hover:text-link"
            >
              ↓ scroll to explore
            </Link>
          </motion.p>
        </div>

        <div className="min-w-0">
          <HeroShowcase />
        </div>
      </div>
    </div>
  );
}
