"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TechChip } from "@/components/ui/tech-chip";
import { Project } from "@/types";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: Project;
  className?: string;
  variant?: "featured" | "compact";
}

export function ProjectCard({
  project,
  className,
  variant = "compact",
}: ProjectCardProps) {
  const isFeatured = variant === "featured";

  return (
    <Card
      className={cn(
        "group h-full flex flex-col rounded-3xl border bg-card/40 shadow-sm",
        "transition-all duration-200 ease-out",
        "hover:-translate-y-1 hover:shadow-lg hover:border-primary/30 hover:bg-card/50",
        className
      )}
    >
      <CardHeader className={cn("pb-3", isFeatured && "pb-4")}>
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <CardTitle
              className={cn(
                "font-semibold group-hover:text-primary transition-colors",
                isFeatured ? "text-2xl leading-tight" : "text-xl leading-tight"
              )}
            >
              {project.title}
            </CardTitle>
            <CardDescription className="text-base leading-relaxed">
              {project.description}
            </CardDescription>
          </div>
          <Badge
            variant={
              project.category === "backend"
                ? "default"
                : project.category === "fullstack"
                ? "secondary"
                : "outline"
            }
            className="shrink-0 rounded-full text-xs"
          >
            {project.category}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className={cn("flex-1", isFeatured ? "pt-0" : "pt-0")}>
        <div
          className={cn(
            "grid gap-6",
            isFeatured ? "lg:grid-cols-[1.2fr_0.8fr]" : "grid-cols-1"
          )}
        >
          {/* Left: minimal copy + chips */}
          <div className={cn("space-y-4", !isFeatured && "space-y-3")}>
            {isFeatured ? (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {project.longDescription}
              </p>
            ) : null}

            <div className="flex flex-wrap gap-2">
              {project.technologies.slice(0, isFeatured ? 8 : 6).map((tech) => (
                <TechChip key={tech} tech={tech} />
              ))}
              {project.technologies.length > (isFeatured ? 8 : 6) && (
                <Badge
                  variant="outline"
                  className="rounded-full bg-card/40 px-3 py-1 text-xs"
                >
                  +{project.technologies.length - (isFeatured ? 8 : 6)}
                </Badge>
              )}
            </div>
          </div>

          {/* Right: highlights + actions (featured only) */}
          {isFeatured ? (
            <div className="space-y-4">
              <div className="rounded-2xl border bg-background/30 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Key Highlights
                </p>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  {project.highlights.slice(0, 4).map((highlight, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary/70 mt-[0.35rem] shrink-0 leading-none">
                        •
                      </span>
                      <span className="leading-relaxed">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-2">
                {project.githubUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="flex-1 rounded-xl"
                  >
                    <Link
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2"
                    >
                      <ExternalLink className="size-4 shrink-0" aria-hidden />
                      Code
                    </Link>
                  </Button>
                )}
                {project.liveUrl && (
                  <Button
                    variant="default"
                    size="sm"
                    asChild
                    className="flex-1 rounded-xl"
                  >
                    <Link
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2"
                    >
                      <ExternalLink className="size-4 shrink-0" aria-hidden />
                      Live
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          ) : null}
        </div>

        {/* Compact: optional tiny highlights row (keeps it light) */}
        {!isFeatured && project.highlights.length > 0 ? (
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {project.highlights.slice(0, 2).map((highlight, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-primary/70 mt-[0.35rem] shrink-0 leading-none">
                  •
                </span>
                <span className="leading-relaxed">{highlight}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </CardContent>

      {!isFeatured ? (
        <CardFooter className="flex gap-2 pt-4 mt-auto">
          {project.githubUrl && (
            <Button
              variant="outline"
              size="sm"
              asChild
              className="flex-1 rounded-xl"
            >
              <Link
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2"
              >
                <ExternalLink className="size-4 shrink-0" aria-hidden />
                Code
              </Link>
            </Button>
          )}
          {project.liveUrl && (
            <Button
              variant="default"
              size="sm"
              asChild
              className="flex-1 rounded-xl"
            >
              <Link
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2"
              >
                <ExternalLink className="size-4 shrink-0" aria-hidden />
                Live
              </Link>
            </Button>
          )}
        </CardFooter>
      ) : null}
    </Card>
  );
}
