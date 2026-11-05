"use client";

import * as React from "react";
import { motion } from "motion/react";
import { Check, Copy, Github, Linkedin, MessageCircle, Send } from "lucide-react";
import { Marker } from "@/components/motion/marker";
import { personalInfo } from "@/data/personal";
import { useChat } from "@/lib/chat-context";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

/** Builds the mailto: link the form opens. No backend: it hands off to the visitor's mail app. */
export function buildMailto(email: string, from: { name: string; email: string; message: string }) {
  const name = from.name.trim();
  const subject = name ? `Hello Anand, it's ${name}` : "Hello Anand";
  const body = [from.message.trim(), "", `— ${name || "Sent from your portfolio"}${from.email.trim() ? ` (${from.email.trim()})` : ""}`].join("\n");
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function Stamp({ children, href, label }: { children: React.ReactNode; href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="group block rotate-[2deg] border-2 border-dashed border-ink/60 bg-card p-1.5 transition-transform duration-200 hover:-rotate-3 hover:-translate-y-1"
    >
      <span className="flex size-11 items-center justify-center border-2 border-ink bg-card text-ink transition-colors group-hover:bg-brand">
        {children}
      </span>
    </a>
  );
}

export function Postcard() {
  const reduced = useReducedMotion();
  const { openChat } = useChat();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "sent" | "copied">("idle");

  const canSend = message.trim().length > 0;

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSend) return;
    const a = document.createElement("a");
    a.href = buildMailto(personalInfo.email, { name, email, message });
    document.body.appendChild(a);
    a.click();
    a.remove();
    setStatus("sent");
  };

  const copy = () => {
    navigator.clipboard?.writeText(personalInfo.email).then(() => {
      setStatus("copied");
      setTimeout(() => setStatus("idle"), 1800);
    });
  };

  const field =
    "w-full bg-transparent px-1 py-1 text-sm text-foreground outline-none placeholder:text-muted-foreground/60 focus:bg-brand-muted";

  return (
    <motion.div
      className="relative mx-auto max-w-4xl"
      initial={reduced ? false : { opacity: 0, y: 40, rotate: -3 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ type: "spring", stiffness: 90, damping: 18 }}
    >
      {/* airmail frame */}
      <div
        className="sketch-box p-2.5 sm:p-3"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, var(--pop-2) 0 14px, transparent 14px 28px, var(--pop-4) 28px 42px, transparent 42px 56px)",
        }}
      >
        <div className="relative grid gap-0 bg-card md:grid-cols-[1.05fr_1fr]" style={{ backgroundColor: "var(--card)" }}>
          {/* ---------- message side ---------- */}
          <div className="flex flex-col p-5 sm:p-7">
            <p className="font-hand text-2xl text-link">dear reader,</p>
            <h3 className="mt-1 font-display text-3xl font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-4xl">
              Let&apos;s build something <Marker>solid</Marker>.
            </h3>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Whether it&apos;s a full-time role or a project that needs a reliable full-stack engineer, I&apos;d love
              to hear from you.
            </p>
            {personalInfo.availability?.open ? (
              <p className="mt-4 inline-flex items-center gap-2 font-hand text-xl text-foreground">
                <span className="size-2.5 rounded-full bg-emerald-500" aria-hidden />
                {personalInfo.availability.text}
              </p>
            ) : null}

            <div className="mt-5 flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={copy}
                className="sketch-btn inline-flex items-center gap-2 bg-card px-3 py-2 font-mono text-xs font-semibold text-foreground"
              >
                {status === "copied" ? <Check className="size-3.5" aria-hidden /> : <Copy className="size-3.5" aria-hidden />}
                {status === "copied" ? "copied!" : personalInfo.email}
              </button>
              <button
                type="button"
                onClick={openChat}
                className="sketch-btn inline-flex items-center gap-2 bg-card px-3 py-2 font-hand text-lg leading-none text-foreground"
              >
                <MessageCircle className="size-3.5" aria-hidden />
                ask the assistant
              </button>
            </div>

            <p className="mt-auto pt-8 font-hand text-3xl leading-none text-muted-foreground">— Anand</p>
          </div>

          {/* ---------- address side ---------- */}
          <div className="relative border-t-2 border-dashed border-ink/30 p-5 sm:p-7 md:border-l-2 md:border-t-0">
            {/* stamp + postmark */}
            <div className="absolute right-4 top-4 flex items-start">
              <svg viewBox="0 0 100 100" className="-mr-6 mt-3 size-20 -rotate-12 text-ink/55" aria-hidden>
                <defs>
                  <path id="postmark-ring" d="M50 50 m-36 0 a36 36 0 1 1 72 0 a36 36 0 1 1 -72 0" />
                </defs>
                <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="2" />
                <circle cx="50" cy="50" r="28" fill="none" stroke="currentColor" strokeWidth="1.2" />
                <text fontSize="11" fontFamily="var(--font-geist-mono), monospace" letterSpacing="2.2" fill="currentColor">
                  <textPath href="#postmark-ring">MUMBAI · INDIA · {new Date().getFullYear()} ·</textPath>
                </text>
                <path d="M30 52 H70 M30 60 H70" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <div className="relative z-10 rotate-3 border-2 border-dashed border-ink/60 bg-card p-1.5">
                <div className="flex size-14 flex-col items-center justify-center border-2 border-ink" style={{ background: "var(--pop-1)" }}>
                  <span className="font-display text-xl font-extrabold leading-none text-ink">AY</span>
                  <span className="mt-0.5 font-mono text-[0.5rem] font-bold tracking-widest text-ink">FIRST CLASS</span>
                </div>
              </div>
            </div>

            <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">write back</p>

            <form onSubmit={send} className="mt-12 space-y-0">
              {[
                { id: "pc-name", label: "from", node: (
                  <input id="pc-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="your name" autoComplete="name" className={field} />
                ) },
                { id: "pc-email", label: "reply to", node: (
                  <input id="pc-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" autoComplete="email" className={field} />
                ) },
              ].map((row) => (
                <label key={row.id} htmlFor={row.id} className="flex items-baseline gap-2 border-b-2 border-ink/40 py-1.5">
                  <span className="w-16 shrink-0 font-hand text-lg leading-none text-link">{row.label}</span>
                  {row.node}
                </label>
              ))}

              <label htmlFor="pc-message" className="block border-b-2 border-ink/40 py-1.5">
                <span className="font-hand text-lg leading-none text-link">message</span>
                <textarea
                  id="pc-message"
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    if (status === "sent") setStatus("idle");
                  }}
                  rows={4}
                  placeholder="say hi, share the role, or ask anything…"
                  className={cn(field, "mt-1 resize-none leading-[1.7rem]")}
                  style={{
                    backgroundImage: "repeating-linear-gradient(transparent 0 calc(1.7rem - 2px), color-mix(in oklch, var(--ink) 18%, transparent) calc(1.7rem - 2px) 1.7rem)",
                    backgroundAttachment: "local",
                  }}
                />
              </label>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-4">
                <button
                  type="submit"
                  disabled={!canSend}
                  className="sketch-btn sketch-box--brand inline-flex items-center gap-2 px-4 py-2 font-hand text-xl leading-none disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Send className="size-4" aria-hidden />
                  {status === "sent" ? "opening your mail app…" : "send it"}
                </button>
                <div className="flex gap-2.5">
                  {personalInfo.github ? (
                    <Stamp href={personalInfo.github} label="GitHub">
                      <Github className="size-5" aria-hidden />
                    </Stamp>
                  ) : null}
                  {personalInfo.linkedin ? (
                    <Stamp href={personalInfo.linkedin} label="LinkedIn">
                      <Linkedin className="size-5" aria-hidden />
                    </Stamp>
                  ) : null}
                </div>
              </div>
              <p className="pt-1 text-xs text-muted-foreground">
                This opens a draft in your email app. I&apos;ll never see anything you type until you press send there.
              </p>
            </form>

            <p className="mt-5 font-hand text-xl leading-tight text-muted-foreground">
              to: Anand Yadav
              <br />
              {personalInfo.location}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
