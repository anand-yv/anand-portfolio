"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "motion/react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { personalInfo } from "@/data/personal";
import { useChat } from "@/lib/chat-context";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const ResumeDialog = dynamic(
  () =>
    import("@/components/resume-dialog").then((m) => ({ default: m.ResumeDialog })),
  { ssr: false }
);

export function HeroCta() {
  const { openChat } = useChat();
  const reduced = useReducedMotion();

  return (
    <>
      <motion.div
        className="mt-8 flex flex-wrap gap-2"
        initial={reduced ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.28 }}
      >
        <Button
          size="default"
          asChild
          className="sketch-btn bg-brand text-brand-foreground hover:bg-brand"
        >
          <Link href="#projects">View projects</Link>
        </Button>
        <Button
          size="default"
          variant="outline"
          asChild
          className="sketch-btn bg-card text-foreground hover:bg-card"
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
          className="gap-1.5 text-muted-foreground hover:text-link"
        >
          <MessageCircle className="size-4" aria-hidden />
          Ask a question
        </Button>
      </motion.div>
    </>
  );
}
