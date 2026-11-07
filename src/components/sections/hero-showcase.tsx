"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { MapPin, Play } from "lucide-react";
import { personalInfo } from "@/data/personal";
import { experience } from "@/data/experience";
import { groupSkillsByCategory, skills } from "@/data/skills";
import { Sfx } from "@/components/sections/sfx";
import { TechChip } from "@/components/ui/tech-chip";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

type NodeId = "client" | "api" | "sql" | "ext";

const currentRole = experience[0];
const byCategory = groupSkillsByCategory(skills);

// Descriptions only restate what is already in the portfolio data.
const NODES: Record<NodeId, { tag: string; title: string; blurb: string; chips: string[] }> = {
  client: {
    tag: "client",
    title: "React + TypeScript",
    blurb: "Interfaces that talk to the API: components, forms, and state around real endpoints.",
    chips: (byCategory.get("frontend") ?? []).map((s) => s.name),
  },
  api: {
    tag: "API",
    title: "Java · Spring Boot",
    blurb: "Where I spend most of my time: REST APIs, JWT auth, and Spring Boot microservices.",
    chips: (byCategory.get("backend") ?? []).map((s) => s.name),
  },
  sql: {
    tag: "sql",
    title: "PostgreSQL",
    blurb: "Relational data models designed and optimised for reliability.",
    chips: ["PostgreSQL", "SQL"],
  },
  ext: {
    tag: "external",
    title: "Third-party services",
    blurb: "Outside services the API talks to. In my projects that means payments, cloud storage and AI models.",
    chips: ["Payment gateway", "AWS S3", "AI/ML integration"],
  },
};

type Step = { at: number; phase: Phase; status: string };
type Phase = "idle" | "client" | "down1" | "api" | "down2" | "db" | "up2" | "api2" | "up1" | "done";

// A scripted request: client -> API -> databases -> back to client.
const SCRIPT: Step[] = [
  { at: 0, phase: "client", status: "GET /flights" },
  { at: 350, phase: "down1", status: "→ request" },
  { at: 1000, phase: "api", status: "validating · auth" },
  { at: 1500, phase: "down2", status: "→ query" },
  { at: 2150, phase: "db", status: "reading data" },
  { at: 2650, phase: "up2", status: "← rows" },
  { at: 3300, phase: "api2", status: "building response" },
  { at: 3700, phase: "up1", status: "← response" },
  { at: 4350, phase: "done", status: "200 OK ✓" },
  { at: 5800, phase: "idle", status: "" },
];

/** One arrow lane. Active lanes thicken, change colour, glow and carry a travelling packet. */
function Lane({ dir, active, reduced }: { dir: "down" | "up"; active: boolean; reduced: boolean }) {
  const down = dir === "down";
  const line = down ? "M12 2 C 8 11, 16 20, 12 30" : "M12 31 C 8 22, 16 13, 12 3";
  const head = down ? "M6 24 L12 31 L18 24" : "M6 9 L12 2 L18 9";
  return (
    <svg
      viewBox="0 0 24 34"
      className={cn(
        "h-9 w-6 transition-colors duration-200",
        active ? "text-link drop-shadow-[0_0_5px_var(--brand)]" : "text-ink/40"
      )}
      aria-hidden
    >
      <path d={line} fill="none" stroke="currentColor" strokeWidth={active ? 3.2 : 2} strokeLinecap="round" />
      <path d={head} fill="none" stroke="currentColor" strokeWidth={active ? 3.2 : 2} strokeLinecap="round" strokeLinejoin="round" />
      {active && !reduced ? (
        <motion.circle
          r="4.5"
          cx="12"
          fill="var(--brand)"
          stroke="var(--ink)"
          strokeWidth="1.5"
          initial={{ cy: down ? 3 : 30 }}
          animate={{ cy: down ? 30 : 3 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />
      ) : null}
    </svg>
  );
}

/** Request (down) and response (up) side by side, so the link reads as two-way. */
function Link2({ down, up, reduced }: { down: boolean; up: boolean; reduced: boolean }) {
  return (
    <div className="flex items-center justify-center gap-4" aria-hidden>
      <Lane dir="down" active={down} reduced={reduced} />
      <Lane dir="up" active={up} reduced={reduced} />
    </div>
  );
}

function Node({
  id,
  selected,
  lit,
  onSelect,
}: {
  id: NodeId;
  selected: boolean;
  lit: boolean;
  onSelect: (id: NodeId) => void;
}) {
  const n = NODES[id];
  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      aria-pressed={selected}
      className={cn(
        // Only transform/shadow animate: a colour transition here made the text flip before the
        // background did (dark text on a dark card for ~200ms).
        "sketch-box sketch-box--sm w-full px-3 py-2.5 text-center transition-[transform,box-shadow] duration-200",
        "motion-safe:hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-link",
        selected && "sketch-box--accent",
        // .sketch-box--brand (not bg-brand): the box background is set by .sketch-box and would
        // otherwise win, leaving dark text on a dark card in dark mode.
        lit && "sketch-box--brand scale-[1.03]"
      )}
    >
      <p className={cn("font-hand text-xl leading-none", lit ? "text-brand-foreground" : "text-link")}>{n.tag}</p>
      <p className="mt-1 text-base font-semibold">{n.title}</p>
    </button>
  );
}

/** Interactive system diagram: click a layer to inspect it, or send a request through the stack. */
export function HeroShowcase() {
  const reduced = useReducedMotion();
  const [selected, setSelected] = React.useState<NodeId>("api");
  const [phase, setPhase] = React.useState<Phase>("idle");
  const [status, setStatus] = React.useState("");
  const timers = React.useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = React.useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);
  React.useEffect(() => clearTimers, [clearTimers]);

  const running = phase !== "idle";

  const sendRequest = React.useCallback(() => {
    if (running) return;
    clearTimers();
    SCRIPT.forEach((step) => {
      timers.current.push(
        setTimeout(() => {
          setPhase(step.phase);
          setStatus(step.status);
        }, step.at)
      );
    });
  }, [running, clearTimers]);

  const lit = (id: NodeId) =>
    (id === "client" && (phase === "client" || phase === "done")) ||
    (id === "api" && (phase === "api" || phase === "api2")) ||
    ((id === "sql" || id === "ext") && phase === "db");

  const detail = NODES[selected];

  return (
    <motion.div
      className="sketch-box relative p-4 sm:p-5"
      style={{ rotate: reduced ? 0 : 0.8 }}
      initial={reduced ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 90, damping: 22, delay: 0.35 }}
    >
      <span className="sketch-tape" aria-hidden />
      <Sfx className="-bottom-7 -right-5 size-[5.25rem]">SHIP IT!</Sfx>

      <div className="flex items-center justify-between gap-3">
        <p className="font-hand text-2xl text-foreground">how I build things</p>
        <button
          type="button"
          onClick={sendRequest}
          disabled={running}
          className="sketch-btn sketch-box--brand inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap px-3 py-1.5 text-base font-semibold disabled:opacity-70"
        >
          <Play className="size-3 fill-current" aria-hidden />
          {running ? "sending…" : "send request"}
        </button>
      </div>

      <div className="mt-3">
        <Node id="client" selected={selected === "client"} lit={lit("client")} onSelect={setSelected} />
        <Link2 down={phase === "down1"} up={phase === "up1"} reduced={reduced} />
        <Node id="api" selected={selected === "api"} lit={lit("api")} onSelect={setSelected} />
        <div className="grid grid-cols-2 gap-3">
          {(["sql", "ext"] as const).map((id) => (
            <div key={id}>
              <Link2 down={phase === "down2"} up={phase === "up2"} reduced={reduced} />
              <Node id={id} selected={selected === id} lit={lit(id)} onSelect={setSelected} />
            </div>
          ))}
        </div>
      </div>

      {/* live request status */}
      <div className="mt-3 h-8 text-right font-mono text-sm text-muted-foreground" aria-live="polite">
        <AnimatePresence mode="wait">
          {status ? (
            <motion.span
              key={status}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className={cn("inline-block", phase === "done" && "font-bold text-link")}
            >
              {status}
            </motion.span>
          ) : (
            <span className="font-hand text-lg">click a layer, or send a request ↑</span>
          )}
        </AnimatePresence>
      </div>

      {/* detail for the selected layer */}
      <div className="mt-1 min-h-[6.5rem] border-t-2 border-dashed border-ink/25 pt-3">
        <AnimatePresence mode="wait">
          <motion.div
            key={selected}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
          >
            <p className="text-base leading-relaxed text-muted-foreground">{detail.blurb}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {detail.chips.map((c) => (
                <TechChip key={c} tech={c} showIcon={false} className="px-2.5 py-1 text-[0.98rem]" />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 pr-20 text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="size-3.5 text-link" aria-hidden />
          {personalInfo.location.split(",")[0]}
        </span>
        <span>
          <span className="text-foreground">{currentRole?.position ?? personalInfo.title}</span>
          {currentRole ? ` @ ${currentRole.company.replace(" Private Limited", "")}` : null}
        </span>
      </div>
    </motion.div>
  );
}
