"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { HeroCta } from "@/components/sections/hero-cta";
import { HeroTagline } from "@/components/sections/hero-tagline";
import { HeroShowcase } from "@/components/sections/hero-showcase";
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
      <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
        <div className="min-w-0">
          <motion.div
            className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm"
            {...item(0)}
          >
            <span
              className="size-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
              aria-hidden
            />
            Open to opportunities
          </motion.div>

          <motion.div className="mt-5" {...item(0.05)}>
            {heading}
          </motion.div>

          <motion.div {...item(0.1)}>
            <HeroTagline />
          </motion.div>

          <motion.div
            className="mt-5 max-w-xl text-lg leading-relaxed text-foreground/90 sm:text-xl"
            {...item(0.16)}
          >
            {lcpParagraph}
          </motion.div>

          <motion.div {...item(0.22)}>
            <HeroCta />
          </motion.div>

          <motion.p className="mt-6 text-sm" {...item(0.3)}>
            <Link
              href="#about"
              className="text-muted-foreground underline-offset-4 transition-colors hover:text-brand hover:underline"
            >
              Explore my work
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
