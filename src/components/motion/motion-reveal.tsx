"use client";

import * as React from "react";
import { motion } from "motion/react";
import type { HTMLMotionProps } from "motion/react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

type MotionRevealProps = Omit<HTMLMotionProps<"div">, "children"> & {
  children: React.ReactNode;
  delay?: number;
  delayMs?: number;
  visibleByDefault?: boolean;
};

export function MotionReveal({
  className,
  children,
  delay,
  delayMs = 0,
  visibleByDefault = false,
  ...props
}: MotionRevealProps) {
  const delaySeconds = delay ?? delayMs / 1000;
  const reduced = useReducedMotion();

  if (reduced || visibleByDefault) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 20,
        delay: delaySeconds,
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
