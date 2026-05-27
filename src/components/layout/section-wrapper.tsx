import * as React from "react";
import { cn } from "@/lib/utils";

interface SectionWrapperProps {
  id?: string;
  className?: string;
  bordered?: boolean;
  width?: "narrow" | "wide";
  children: React.ReactNode;
}

const widthClass = {
  narrow: "max-w-3xl",
  wide: "max-w-5xl",
} as const;

export function SectionWrapper({
  id,
  className,
  bordered = true,
  width = "narrow",
  children,
}: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative scroll-mt-[4.5rem] py-20 sm:py-24",
        bordered && "border-t border-border/70",
        className
      )}
    >
      <div
        className={cn(
          "container mx-auto px-4 sm:px-6",
          widthClass[width]
        )}
      >
        {children}
      </div>
    </section>
  );
}
