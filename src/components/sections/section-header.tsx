import * as React from "react";
import { AnimatedHeading } from "@/components/motion/animated-heading";
import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  /** Section number, e.g. "01" */
  index: string;
  label: string;
  title: string;
  description?: string;
  className?: string;
};

export function SectionHeader({ index, label, title, description, className }: SectionHeaderProps) {
  return (
    <header className={cn("max-w-2xl space-y-3", className)}>
      <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
        <span className="sketch-box sketch-box--sm sketch-box--brand px-2 py-0.5 text-[0.7rem] font-semibold">
          {index}
        </span>
        <span>{label}</span>
      </p>
      <AnimatedHeading
        text={title}
        className="text-3xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-4xl"
      />
      <svg viewBox="0 0 160 12" className="h-2.5 w-28 text-link" aria-hidden>
        <path
          className="sketch-draw"
          pathLength={1}
          d="M2 7 C 20 1, 34 11, 54 6 S 90 1, 108 7 S 142 10, 158 4"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
      {description ? (
        <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">{description}</p>
      ) : null}
    </header>
  );
}
