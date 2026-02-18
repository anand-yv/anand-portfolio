import * as React from "react";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { TechChip } from "@/components/ui/tech-chip";
import { cn } from "@/lib/utils";

interface TimelineItem {
  id: string;
  title: string;
  subtitle: string;
  period: string;
  description: string | string[];
  technologies?: string[];
}

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

export function Timeline({ items, className }: TimelineProps) {
  return (
    <div className={cn("relative", className)}>
      {/* Vertical Spine with Glow */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-primary/40 to-transparent" />
        <div className="absolute inset-0 bg-border blur-sm" />
      </div>

      {items.map((item, index) => (
        <div key={item.id} className="relative pb-10 last:pb-0">
          {/* Node with Glow */}
          <div className="absolute left-4 top-0 -translate-x-1/2">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-primary/30 blur-md" />
              <div className="relative size-8 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center shrink-0">
                <div className="size-3 rounded-full bg-primary" />
              </div>
            </div>
          </div>

          {/* Content Card */}
          <div className="ml-12">
            <Card className="rounded-2xl border bg-card/50 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {item.subtitle}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground font-medium shrink-0">
                    {item.period}
                  </p>
                </div>

                {typeof item.description === "string" ? (
                  <p className="text-sm text-muted-foreground mb-4">
                    {item.description}
                  </p>
                ) : (
                  <ul className="space-y-2 mb-4">
                    {item.description.map((desc, idx) => (
                      <li
                        key={idx}
                        className="text-sm text-muted-foreground flex items-start gap-2"
                      >
                        <span className="text-primary mt-1.5 shrink-0">•</span>
                        <span>{desc}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {item.technologies && item.technologies.length > 0 && (
                  <>
                    <Separator className="my-4" />
                    <div className="flex flex-wrap gap-2">
                      {item.technologies.map((tech) => (
                        <TechChip key={tech} tech={tech} />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </Card>
          </div>
        </div>
      ))}
    </div>
  );
}
