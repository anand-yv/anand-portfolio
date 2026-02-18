import * as React from "react";

import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  icon: React.ReactNode;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeader({
  icon,
  title,
  description,
  align = "center",
  className,
}: SectionHeaderProps) {
  const isCenter = align === "center";

  return (
    <div
      className={cn(
        "space-y-2",
        isCenter ? "text-center" : "text-left",
        className
      )}
    >
      <div
        className={cn(
          "inline-flex items-center gap-2",
          isCenter ? "justify-center" : "justify-start"
        )}
      >
        <span className="inline-flex size-9 items-center justify-center rounded-xl border bg-card/60 text-foreground shadow-sm">
          <span className="text-primary [&_svg]:size-4">{icon}</span>
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
          {title}
        </h2>
      </div>
      <div
        className={cn(
          "h-1 w-16 rounded-full bg-primary/80",
          isCenter ? "mx-auto" : ""
        )}
      />
      {description ? (
        <p className="text-muted-foreground max-w-2xl mx-auto pt-2">
          {description}
        </p>
      ) : null}
    </div>
  );
}


