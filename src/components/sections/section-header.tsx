import * as React from "react";
import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  label: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
};

export function SectionHeader({
  label,
  title,
  description,
  icon,
  className,
}: SectionHeaderProps) {
  return (
    <header className={cn("space-y-3 max-w-2xl", className)}>
      <div className="flex items-center gap-3">
        {icon ? (
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border/80 bg-brand-muted text-brand [&_svg]:size-[1.125rem]">
            {icon}
          </span>
        ) : null}
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">
          {label}
        </p>
      </div>
      <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="text-base leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}
    </header>
  );
}
