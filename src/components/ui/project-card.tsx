"use client";

import Link from "next/link";
import { ArrowUpRight, Code2, Layers, Server } from "lucide-react";
import { motion } from "motion/react";
import { TechChip } from "@/components/ui/tech-chip";
import { Project } from "@/types";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface ProjectCardProps {
  project: Project;
  className?: string;
  featured?: boolean;
}

function CategoryIcon({ category }: { category: Project["category"] }) {
  const className = "size-4 text-brand";
  switch (category) {
    case "backend":
      return <Server className={className} aria-hidden />;
    case "fullstack":
      return <Layers className={className} aria-hidden />;
    default:
      return <Code2 className={className} aria-hidden />;
  }
}

export function ProjectCard({
  project,
  className,
  featured = false,
}: ProjectCardProps) {
  const reduced = useReducedMotion();
  const Comp = reduced ? "article" : motion.article;

  return (
    <Comp
      className={cn(
        "group glass-panel relative overflow-hidden rounded-xl p-5 sm:p-6",
        "transition-shadow duration-300 hover:shadow-lg hover:shadow-brand/15",
        featured && "sm:col-span-2",
        !reduced && "hover:-translate-y-1",
        className
      )}
      {...(!reduced
        ? {
            whileHover: { y: -4 },
            transition: { type: "spring", stiffness: 300, damping: 24 },
          }
        : {})}
    >
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand/80 via-brand to-brand/40",
          featured ? "opacity-100" : "opacity-0 transition-opacity group-hover:opacity-100"
        )}
        aria-hidden
      />

      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border/80 bg-brand-muted">
            <CategoryIcon category={project.category} />
          </span>
          <div className="min-w-0 space-y-1">
            <h3
              className={cn(
                "font-semibold tracking-tight text-foreground transition-colors group-hover:text-brand",
                featured ? "text-2xl" : "text-lg"
              )}
            >
              {project.title}
            </h3>
            <p className="text-sm capitalize text-muted-foreground">{project.category}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-3 text-sm">
          {project.githubUrl ? (
            <Link
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-0.5 text-muted-foreground transition-colors hover:text-brand"
            >
              Code
              <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          ) : null}
          {project.liveUrl ? (
            <Link
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-0.5 text-muted-foreground transition-colors hover:text-brand"
            >
              Live
              <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          ) : null}
        </div>
      </div>

      <p
        className={cn(
          "mt-4 leading-relaxed text-muted-foreground",
          featured ? "text-sm sm:text-base" : "text-sm"
        )}
      >
        {featured ? project.longDescription : project.description}
      </p>

      {featured && project.highlights.length > 0 ? (
        <ul className="mt-4 space-y-1.5 text-sm text-muted-foreground">
          {project.highlights.slice(0, 3).map((h, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-brand" aria-hidden>
                —
              </span>
              {h}
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-1.5">
        {project.technologies.slice(0, featured ? 8 : 6).map((tech) => (
          <TechChip key={tech} tech={tech} showIcon={false} />
        ))}
      </div>
    </Comp>
  );
}
