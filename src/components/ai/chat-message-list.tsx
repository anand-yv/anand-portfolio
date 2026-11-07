"use client";

import * as React from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import { ArrowUpRight, Check, Copy, FileText, Mail, RotateCcw } from "lucide-react";
import { TechChip } from "@/components/ui/tech-chip";
import { personalInfo } from "@/data/personal";
import { projects } from "@/data/projects";
import type { GotoTarget } from "@/lib/chat-directives";
import { cn } from "@/lib/utils";

export type ChatMessage = {
  id: number;
  role: "user" | "assistant";
  content: string;
  isLoading?: boolean;
  /** Set when the request failed; `retryText` is the question to resend. */
  error?: boolean;
  retryText?: string;
  /** Parsed from assistant directives (validated against portfolio data). */
  projects?: string[];
  goto?: GotoTarget[];
  email?: boolean;
  resume?: boolean;
  suggestions?: string[];
};

const GOTO_LABELS: Record<GotoTarget, string> = {
  about: "About",
  skills: "Skills",
  projects: "Projects",
  experience: "Experience",
  education: "Education",
  contact: "Contact",
};

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-1 py-1" aria-label="Assistant is typing" role="status">
      {[0, 120, 240].map((delay) => (
        <span
          key={delay}
          className="size-1.5 animate-bounce rounded-full bg-muted-foreground/70"
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = React.useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard?.writeText(text).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        });
      }}
      className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
      aria-label="Copy answer"
    >
      {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
      {copied ? "copied" : "copy"}
    </button>
  );
}

function ProjectMiniCard({ id }: { id: string }) {
  const project = projects.find((p) => p.id === id);
  if (!project) return null;
  return (
    <div className="sketch-box sketch-box--sm bg-background p-3">
      <p className="font-hand text-lg leading-none text-link">{project.category}</p>
      <p className="mt-0.5 font-display text-sm font-bold text-foreground">{project.title}</p>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{project.description}</p>
      <div className="mt-2 flex flex-wrap gap-1">
        {project.technologies.slice(0, 3).map((t) => (
          <TechChip key={t} tech={t} showIcon={false} className="px-1.5 py-0.5 text-[0.75rem]" />
        ))}
      </div>
      <div className="mt-2 flex gap-3">
        {project.githubUrl ? (
          <Link
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-0.5 font-hand text-base text-foreground underline decoration-brand decoration-2 underline-offset-2 hover:text-link"
          >
            Code <ArrowUpRight className="size-3" aria-hidden />
          </Link>
        ) : null}
        {project.liveUrl ? (
          <Link
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-0.5 font-hand text-base text-foreground underline decoration-brand decoration-2 underline-offset-2 hover:text-link"
          >
            Live <ArrowUpRight className="size-3" aria-hidden />
          </Link>
        ) : null}
      </div>
    </div>
  );
}

function ActionButtons({ message, onGoto }: { message: ChatMessage; onGoto: (target: GotoTarget) => void }) {
  const hasAny = message.goto?.length || message.email || message.resume;
  if (!hasAny) return null;
  const btn =
    "sketch-chip inline-flex items-center gap-1 bg-card px-2.5 py-1 font-hand text-lg leading-tight text-foreground transition-colors hover:bg-brand-muted";
  return (
    <div className="flex flex-wrap gap-1.5">
      {message.goto?.map((t) => (
        <button key={t} type="button" onClick={() => onGoto(t)} className={btn}>
          ↓ {GOTO_LABELS[t]}
        </button>
      ))}
      {message.email ? (
        <a href={`mailto:${personalInfo.email}`} className={btn}>
          <Mail className="size-3.5" aria-hidden /> Email Anand
        </a>
      ) : null}
      {message.resume && personalInfo.resumeUrl ? (
        <a href={personalInfo.resumeUrl} target="_blank" rel="noopener noreferrer" className={btn}>
          <FileText className="size-3.5" aria-hidden /> Resume
        </a>
      ) : null}
    </div>
  );
}

const markdownClasses =
  "text-sm leading-relaxed [&_a]:underline [&_a]:decoration-brand [&_code]:rounded [&_code]:bg-background/60 [&_code]:px-1 [&_code]:font-mono [&_code]:text-[0.8em] [&_li]:my-0.5 [&_ol]:my-1.5 [&_ol]:list-decimal [&_ol]:pl-4 [&_p]:my-1.5 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0 [&_strong]:font-semibold [&_ul]:my-1.5 [&_ul]:list-disc [&_ul]:pl-4";

function MessageBubble({
  message,
  isLast,
  busy,
  onSend,
  onRetry,
  onGoto,
}: {
  message: ChatMessage;
  isLast: boolean;
  busy: boolean;
  onSend: (text: string) => void;
  onRetry: (id: number) => void;
  onGoto: (target: GotoTarget) => void;
}) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="sketch-box sketch-box--sm sketch-box--brand max-w-[85%] px-3 py-2 text-sm leading-relaxed break-words">
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <div
        className={cn(
          "sketch-box sketch-box--sm max-w-[92%] px-3 py-2 break-words",
          message.error ? "border-destructive" : "sketch-box--muted text-foreground"
        )}
      >
        {message.isLoading ? (
          <TypingIndicator />
        ) : message.error ? (
          <div className="space-y-2 text-sm">
            <p>{message.content}</p>
            <button
              type="button"
              onClick={() => onRetry(message.id)}
              disabled={busy}
              className="inline-flex items-center gap-1 font-hand text-lg leading-none text-link underline underline-offset-2 disabled:opacity-50"
            >
              <RotateCcw className="size-3.5" aria-hidden /> try again
            </button>
          </div>
        ) : (
          <div className={markdownClasses}>
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
              {message.content}
            </ReactMarkdown>
          </div>
        )}
      </div>

      {!message.isLoading && !message.error ? (
        <>
          {message.projects?.map((id) => <ProjectMiniCard key={id} id={id} />)}
          <ActionButtons message={message} onGoto={onGoto} />
          {isLast && !busy && message.suggestions?.length ? (
            <div className="flex flex-wrap gap-1.5">
              {message.suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => onSend(s)}
                  className="sketch-chip bg-background px-2.5 py-0.5 text-left text-xs text-foreground transition-colors hover:bg-brand-muted"
                >
                  {s}
                </button>
              ))}
            </div>
          ) : null}
          {message.content ? <CopyButton text={message.content} /> : null}
        </>
      ) : null}
    </div>
  );
}

type ChatMessageListProps = {
  messages: ChatMessage[];
  showWelcome: boolean;
  starterPrompts: readonly string[];
  busy: boolean;
  scrollRef?: React.RefObject<HTMLDivElement | null>;
  onSend: (text: string) => void;
  onRetry: (id: number) => void;
  onGoto: (target: GotoTarget) => void;
};

export function ChatMessageList({
  messages,
  showWelcome,
  starterPrompts,
  busy,
  scrollRef,
  onSend,
  onRetry,
  onGoto,
}: ChatMessageListProps) {
  return (
    <div
      ref={scrollRef}
      className="resume-modal-scroll min-h-0 flex-1 space-y-3 overflow-x-hidden overflow-y-auto px-4 py-4"
      role="log"
      aria-live="polite"
      aria-relevant="additions"
    >
      {showWelcome ? (
        <div className="space-y-3">
          <div className="sketch-box sketch-box--sm sketch-box--muted max-w-[92%] px-3 py-2 text-sm leading-relaxed text-foreground">
            <p>
              Hi! I&apos;m Anand&apos;s portfolio assistant. Ask me about his projects, skills, experience, or
              how to get in touch.
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {starterPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => onSend(prompt)}
                disabled={busy}
                className="sketch-chip bg-background px-2.5 py-1 text-left text-xs text-foreground transition-colors hover:bg-brand-muted disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {messages.map((message, i) => (
        <MessageBubble
          key={message.id}
          message={message}
          isLast={i === messages.length - 1}
          busy={busy}
          onSend={onSend}
          onRetry={onRetry}
          onGoto={onGoto}
        />
      ))}
    </div>
  );
}
