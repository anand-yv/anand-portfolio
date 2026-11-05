"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";

const GREETINGS = [
  "Hello",
  "नमस्ते",
  "Hola",
  "Bonjour",
  "こんにちは",
  "Ciao",
  "안녕하세요",
  "Hallo",
];

const STEP_MS = 260;
const FINAL_HOLD_MS = 650;

/**
 * Full-screen multi-language greeting that wipes up into the page.
 * Shows once per tab session; skipped for returning visitors and reduced-motion users
 * (an inline script in <head> sets data-intro="skip" before first paint).
 * Without JS, a CSS animation hides it after a few seconds so content is never blocked.
 */
export function Intro() {
  const [index, setIndex] = React.useState(0);
  const [done, setDone] = React.useState(false);

  const finish = React.useCallback(() => {
    try {
      sessionStorage.setItem("intro-seen", "1");
    } catch {
      // ignore
    }
    setDone(true);
  }, []);

  React.useEffect(() => {
    if (document.documentElement.dataset.intro === "skip") {
      setDone(true);
      return;
    }
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, []);

  React.useEffect(() => {
    if (done) return;
    if (index < GREETINGS.length) {
      const t = setTimeout(() => setIndex((i) => i + 1), STEP_MS);
      return () => clearTimeout(t);
    }
    const t = setTimeout(finish, FINAL_HOLD_MS);
    return () => clearTimeout(t);
  }, [index, done, finish]);

  React.useEffect(() => {
    if (done) document.documentElement.style.overflow = "";
  }, [done]);

  const closing = index >= GREETINGS.length;

  return (
    <AnimatePresence>
      {!done ? (
        <motion.div
          key="intro"
          className="intro-overlay fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[oklch(0.15_0.006_270)] text-[oklch(0.96_0.005_95)]"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          role="status"
          aria-label="Loading"
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <span className="size-2.5 rounded-full bg-[oklch(0.93_0.2_112)] sm:size-3" aria-hidden />
            <AnimatePresence mode="wait">
              <motion.span
                key={closing ? "closing" : GREETINGS[index]}
                className="font-display text-5xl font-extrabold tracking-tight sm:text-7xl"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.14 }}
              >
                {closing ? "I’m Anand" : GREETINGS[index]}
              </motion.span>
            </AnimatePresence>
          </div>

          <p className="absolute bottom-6 left-6 font-mono text-xs uppercase tracking-[0.2em] text-[oklch(0.96_0.005_95)]/60">
            {String(Math.min(index + 1, GREETINGS.length)).padStart(2, "0")} / {String(GREETINGS.length).padStart(2, "0")}
          </p>
          <button
            type="button"
            onClick={finish}
            className="absolute bottom-5 right-6 font-hand text-xl text-[oklch(0.96_0.005_95)]/70 underline decoration-dashed underline-offset-4 transition-colors hover:text-[oklch(0.96_0.005_95)]"
          >
            skip ›
          </button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
