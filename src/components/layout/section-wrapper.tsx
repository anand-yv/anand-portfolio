import * as React from "react";
import { cn } from "@/lib/utils";

interface SectionWrapperProps {
  id?: string;
  className?: string;
  bordered?: boolean;
  width?: "narrow" | "wide";
  /** Full-bleed layers behind the container (e.g. hero gradients). */
  atmosphere?: React.ReactNode;
  children: React.ReactNode;
}

const widthClass = {
  narrow: "max-w-3xl",
  wide: "max-w-5xl xl:max-w-6xl",
} as const;

export function SectionWrapper({
  id,
  className,
  bordered = true,
  width = "narrow",
  atmosphere,
  children,
}: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative isolate scroll-mt-[4.5rem] overflow-hidden py-20 sm:py-24",
        bordered && "border-t border-border/70",
        className
      )}
    >
      {atmosphere}
      <div
        className={cn(
          "container relative z-[1] mx-auto px-4 sm:px-6",
          widthClass[width]
        )}
      >
        {children}
      </div>
    </section>
  );
}
