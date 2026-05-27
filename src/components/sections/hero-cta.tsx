"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "motion/react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TechChip } from "@/components/ui/tech-chip";
import { personalInfo } from "@/data/personal";
import { useChat } from "@/lib/chat-context";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const ResumeDialog = dynamic(
  () =>
    import("@/components/resume-dialog").then((m) => ({ default: m.ResumeDialog })),
  { ssr: false }
);

const STACK = ["Java", "Spring Boot", "React", "TypeScript", "PostgreSQL", "MongoDB"];

export function HeroCta() {
  const { openChat } = useChat();
  const reduced = useReducedMotion();

  return (
    <>
      <div className="mt-8 flex flex-wrap gap-2">
        {STACK.map((t) => (
          <TechChip key={t} tech={t} showIcon />
        ))}
      </div>

      <motion.div
        className="mt-8 flex flex-wrap gap-2"
        initial={reduced ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.28 }}
      >
        <Button
          size="default"
          asChild
          className="bg-brand text-brand-foreground shadow-sm hover:bg-brand/90 hover:scale-[1.02] transition-transform"
        >
          <Link href="#projects">View projects</Link>
        </Button>
        <Button
          size="default"
          variant="outline"
          asChild
          className="border-border hover:border-brand/50 hover:bg-brand-muted hover:scale-[1.02] transition-transform"
        >
          <Link href="#contact">Contact</Link>
        </Button>
        {personalInfo.resumeUrl ? (
          <ResumeDialog>
            <Button size="default" variant="ghost">
              Resume
            </Button>
          </ResumeDialog>
        ) : null}
        <Button
          type="button"
          size="default"
          variant="ghost"
          onClick={openChat}
          className="gap-1.5 text-muted-foreground hover:text-brand"
        >
          <MessageCircle className="size-4" aria-hidden />
          Ask a question
        </Button>
      </motion.div>
    </>
  );
}
