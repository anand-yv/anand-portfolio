"use client";

import { Circle } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TerminalAi } from "@/components/ai/terminal-ai";

export function HeroCard() {
  return (
    <Reveal delayMs={180}>
      <div className="relative">
        <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-b from-primary/15 via-transparent to-transparent blur-2xl opacity-60 dark:opacity-35" />
        <Card className="rounded-3xl border border-primary/20 bg-card/55 shadow-[0_0_0_1px_rgba(99,102,241,0.08),0_0_40px_rgba(99,102,241,0.15)]">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-red-500/70" />
                <span className="size-2.5 rounded-full bg-yellow-500/70" />
                <span className="size-2.5 rounded-full bg-green-500/70" />
              </div>
              <div
                className="text-xs text-muted-foreground font-mono inline-flex items-center gap-1.5"
                title="Assistant status"
              >
                <span>anand.dev</span>
                <Circle className="size-2.5 fill-emerald-400 text-emerald-400 animate-pulse" />
                <span className="text-emerald-400">online</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <TerminalAi />
          </CardContent>
        </Card>
      </div>
    </Reveal>
  );
}
