"use client";

import * as React from "react";
import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/** Highlighter-pen effect that sweeps across the text when scrolled into view. */
export function Marker({ children, delay = 0.2 }: { children: React.ReactNode; delay?: number }) {
  const reduced = useReducedMotion();
  if (reduced) return <span className="marker">{children}</span>;
  return (
    <motion.span
      className="marker"
      initial={{ backgroundSize: "0% 42%" }}
      whileInView={{ backgroundSize: "100% 42%" }}
      viewport={{ once: true, margin: "-15%" }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.span>
  );
}
