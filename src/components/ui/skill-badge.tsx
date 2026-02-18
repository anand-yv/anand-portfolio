import { Skill } from "@/types";
import { TechChip } from "@/components/ui/tech-chip";
import { cn } from "@/lib/utils";

interface SkillBadgeProps {
  skill: Skill;
  className?: string;
}

export function SkillBadge({ skill, className }: SkillBadgeProps) {
  return <TechChip tech={skill.name} className={className} />;
}

