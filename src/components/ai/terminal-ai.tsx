"use client";

import * as React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import { Bot, MessageCircle, RotateCcw, Send, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type ChatTurn = {
  role: "user" | "assistant";
  content: string;
};

type TerminalEntry = {
  id: number;
  input: string;
  output: string;
  isLoading: boolean;
};

const USER_LABEL = "You";
const ASSISTANT_LABEL = "AI Assistant";
const SUGGESTED_TOPICS = ["projects", "skills", "experience", "contact"] as const;

const HELP_OUTPUT = [
  "Available topics:",
  "→ projects",
  "→ skills",
  "→ experience",
  "→ contact",
  "→ education",
  "→ clear (or click reset)",
  "",
  "(Type naturally, no need to use exact commands)",
].join("\n");

function formatTerminalOutput(text: string) {
  return text.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
}

type IconActionButtonProps = {
  tooltip: string;
  tooltipSide?: "top" | "bottom";
  children: React.ReactNode;
} & Omit<React.ComponentProps<typeof Button>, "children">;

function IconActionButton({
  tooltip,
  tooltipSide = "top",
  className,
  children,
  ...props
}: IconActionButtonProps) {
  return (
    <div className="group relative">
      <Button {...props} className={className}>
        {children}
      </Button>
      <div
        className={[
          "pointer-events-none absolute right-0 z-10 whitespace-nowrap rounded-md border bg-popover px-2 py-1 text-[11px] text-popover-foreground opacity-0 shadow-md transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100",
          tooltipSide === "top"
            ? "bottom-[calc(100%+8px)]"
            : "top-[calc(100%+8px)]",
        ].join(" ")}
      >
        {tooltip}
      </div>
    </div>
  );
}

export function TerminalAi() {
  const [input, setInput] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);
  const [chatHistory, setChatHistory] = React.useState<ChatTurn[]>([]);
  const [entries, setEntries] = React.useState<TerminalEntry[]>([]);
  const [inputHistory, setInputHistory] = React.useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = React.useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [entries, isSubmitting]);

  React.useEffect(() => {
    if (!isOpen) return;
    inputRef.current?.focus();
  }, [isOpen]);

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const clearTerminal = React.useCallback(() => {
    setEntries([]);
    setInput("");
    setHistoryIndex(null);
    setChatHistory([]);
    setIsSubmitting(false);
  }, []);

  const runInput = React.useCallback(
    async (rawInput: string) => {
      const message = rawInput.trim();
      if (!message || isSubmitting) return;

      const normalized = message.toLowerCase();
      if (normalized === "clear") {
        clearTerminal();
        return;
      }

      const entryId = Date.now();
      setEntries((prev) => [
        ...prev,
        {
          id: entryId,
          input: message,
          output: "",
          isLoading: true,
        },
      ]);
      setInputHistory((prev) => [...prev, message]);
      setHistoryIndex(null);
      setInput("");

      if (normalized === "help") {
        setEntries((prev) =>
          prev.map((entry) =>
            entry.id === entryId
              ? { ...entry, output: HELP_OUTPUT, isLoading: false }
              : entry
          )
        );
        return;
      }

      setIsSubmitting(true);
      try {
        const response = await fetch("/api/portfolio-chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message,
            history: chatHistory,
          }),
        });

        if (!response.ok) {
          const data = (await response.json().catch(() => null)) as
            | { error?: string }
            | null;
          throw new Error(data?.error || "Something went wrong. Please try again.");
        }

        const data = (await response.json()) as { answer?: string };
        const output = formatTerminalOutput(
          typeof data.answer === "string" ? data.answer : "No response from AI."
        );

        setEntries((prev) =>
          prev.map((entry) =>
            entry.id === entryId ? { ...entry, output, isLoading: false } : entry
          )
        );
        setChatHistory((prev) => [
          ...prev,
          { role: "user", content: message },
          { role: "assistant", content: output },
        ]);
      } catch (error) {
        const output =
          error instanceof Error
            ? [
                "Temporary AI hiccup on this request.",
                "Please retry in a few seconds.",
                `detail: ${error.message}`,
              ].join("\n")
            : "Temporary AI hiccup on this request. Please retry in a few seconds.";
        setEntries((prev) =>
          prev.map((entry) =>
            entry.id === entryId ? { ...entry, output, isLoading: false } : entry
          )
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [chatHistory, clearTerminal, isSubmitting]
  );

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    runInput(input);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!inputHistory.length) return;
      const nextIndex =
        historyIndex === null
          ? inputHistory.length - 1
          : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInput(inputHistory[nextIndex]);
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!inputHistory.length || historyIndex === null) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= inputHistory.length) {
        setHistoryIndex(null);
        setInput("");
      } else {
        setHistoryIndex(nextIndex);
        setInput(inputHistory[nextIndex]);
      }
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
      {isOpen ? (
        <div className="w-[min(92vw,390px)] overflow-hidden rounded-3xl border border-primary/20 bg-background/95 shadow-[0_20px_65px_-20px_rgba(0,0,0,0.55)] backdrop-blur">
          <div className="relative border-b bg-gradient-to-r from-primary/15 via-primary/10 to-transparent px-3 py-2.5">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,oklch(0.65_0.18_264_/_0.18),transparent_45%)] opacity-80" />
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <Bot className="size-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{ASSISTANT_LABEL}</p>
                  <p className="text-[11px] text-muted-foreground">Online now</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <IconActionButton
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={clearTerminal}
                  className="text-muted-foreground hover:text-foreground"
                  tooltip="Reset chat"
                  tooltipSide="bottom"
                >
                  <RotateCcw />
                </IconActionButton>
                <IconActionButton
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => setIsOpen(false)}
                  className="text-muted-foreground hover:text-foreground"
                  tooltip="Close chat"
                  tooltipSide="bottom"
                >
                  <X />
                </IconActionButton>
              </div>
            </div>
          </div>

          <div
            ref={scrollRef}
            className="resume-modal-scroll h-[360px] overflow-x-hidden overflow-y-auto px-3 py-3 text-[13px] leading-6 text-foreground/90"
          >
            {entries.length === 0 ? (
              <div className="max-w-[88%] rounded-2xl rounded-bl-sm border border-primary/20 bg-primary/5 px-3 py-2.5">
                <p className="whitespace-pre-wrap break-words text-[13px]">
                  {"Hey, I'm Anand's portfolio assistant.\nAsk me anything about his work, projects, or experience.\n\nType 'help' to see prompts or 'clear' to reset chat."}
                </p>
              </div>
            ) : (
              entries.map((entry) => (
                <div key={entry.id} className="mb-4 space-y-2">
                  <div className="ml-auto max-w-[88%] rounded-2xl rounded-br-sm border border-primary/25 bg-primary/15 px-3 py-2">
                    <p className="break-words text-foreground">{entry.input}</p>
                  </div>

                  <div className="max-w-[88%] rounded-2xl rounded-bl-sm border border-border/80 bg-card/70 px-3 py-2 break-words">
                    {entry.isLoading ? (
                      <div className="inline-flex items-center gap-2 text-primary/90">
                        <span className="text-[11px] font-medium uppercase tracking-wide text-primary/80">
                          {ASSISTANT_LABEL}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <span className="size-1.5 rounded-full bg-primary animate-pulse" />
                          <span
                            className="size-1.5 rounded-full bg-primary animate-pulse"
                            style={{ animationDelay: "120ms" }}
                          />
                          <span
                            className="size-1.5 rounded-full bg-primary animate-pulse"
                            style={{ animationDelay: "240ms" }}
                          />
                        </span>
                        <span className="text-[12px] text-muted-foreground">typing...</span>
                        <span className="typing-cursor">✦</span>
                      </div>
                    ) : (
                      <div>
                        <div className="prose prose-sm max-w-none prose-p:my-2 prose-ul:my-2 prose-li:my-1 prose-headings:my-2 prose-strong:text-foreground dark:prose-invert">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeSanitize]}
                          >
                            {entry.output}
                          </ReactMarkdown>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="border-t bg-background/80 px-3 py-2">
            <div className="mb-2 flex flex-wrap items-center gap-2 text-[11px]">
              <span className="text-muted-foreground">Try:</span>
              {SUGGESTED_TOPICS.map((topic) => (
                <Button
                  key={topic}
                  type="button"
                  onClick={() => runInput(topic)}
                  disabled={isSubmitting}
                  variant="outline"
                  size="xs"
                  className="rounded-full"
                >
                  {topic}
                </Button>
              ))}
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 rounded-2xl border bg-background/90 px-2.5 py-2 min-w-0"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message Anand's AI assistant..."
                className="flex-1 min-w-0 bg-transparent px-1 text-[13px] outline-none text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-0 focus-visible:ring-0"
                maxLength={800}
                aria-label="Ask Anand portfolio question"
                autoComplete="off"
                spellCheck={false}
              />
              <Button
                type="submit"
                disabled={isSubmitting || !input.trim()}
                size="icon-sm"
                className="rounded-full"
                title="Send message"
              >
                <Send className="size-4" />
              </Button>
            </form>
          </div>
        </div>
      ) : (
        <IconActionButton
          type="button"
          onClick={() => setIsOpen(true)}
          size="icon-lg"
          className="group relative rounded-full border border-primary/35 bg-background/95 text-primary shadow-[0_12px_30px_-12px_rgba(0,0,0,0.55)] backdrop-blur transition-all hover:scale-[1.03] hover:bg-accent"
          tooltip="Open AI chat"
        >
          <MessageCircle className="size-5" />
          <span className="absolute -right-0.5 -top-0.5 inline-flex size-2.5 rounded-full bg-emerald-400 ring-2 ring-background animate-pulse" />
        </IconActionButton>
      )}
    </div>
  );
}

