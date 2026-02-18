import * as React from "react";
import { cn } from "@/lib/utils";

interface SectionWrapperProps {
  id?: string;
  className?: string;
  children: React.ReactNode;
}

export function SectionWrapper({
  id,
  className,
  children,
}: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative py-20 sm:py-24 lg:py-28 scroll-mt-16",
        className
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        {children}
      </div>
    </section>
  );
}

