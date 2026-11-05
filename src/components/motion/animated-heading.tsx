"use client";

import * as React from "react";
import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const word = {
  hidden: { y: "115%", rotate: 4 },
  show: { y: 0, rotate: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
};

/** Headline whose words slide up out of a mask, one after another. */
export function AnimatedHeading({
  text,
  as = "h2",
  className,
}: {
  text: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
}) {
  const reduced = useReducedMotion();
  const Tag = as;
  const MotionTag = motion[as];

  if (reduced) return <Tag className={className}>{text}</Tag>;

  // The viewport trigger lives on the heading itself (not the clipped words),
  // otherwise the observer can't "see" words translated outside their mask.
  return (
    <MotionTag
      aria-label={text}
      className={className}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-12%" }}
    >
      {text.split(" ").map((w, i) => (
        <React.Fragment key={`${w}-${i}`}>
          <span className="inline-block overflow-hidden py-[0.1em] align-bottom" aria-hidden>
            <motion.span className="inline-block" variants={word}>
              {w}
            </motion.span>
          </span>{" "}
        </React.Fragment>
      ))}
    </MotionTag>
  );
}
