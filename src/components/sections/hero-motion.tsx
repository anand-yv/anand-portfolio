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
          {personalInfo.availability?.open ? (
            <motion.div
              className="sketch-box sketch-box--sm inline-flex items-center gap-2 px-3 py-1 font-hand text-lg leading-tight text-foreground"
              {...item(0)}
            >
              <span className="relative flex size-2.5" aria-hidden>
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-60 motion-reduce:hidden" />
                <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" />
              </span>
              {personalInfo.availability.text}
            </motion.div>
          ) : null}

          <motion.div className="mt-5" {...item(0.05)}>
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

          <motion.p className="mt-6" {...item(0.3)}>
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
