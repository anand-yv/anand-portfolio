"use client";

import * as React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";

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

const TERMINAL_PROMPT = "you:~$";
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

export function TerminalAi() {
  const [input, setInput] = React.useState("");
  const [chatHistory, setChatHistory] = React.useState<ChatTurn[]>([]);
  const [entries, setEntries] = React.useState<TerminalEntry[]>([]);
  const [inputHistory, setInputHistory] = React.useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = React.useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [entries, isSubmitting]);

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
    <>
      <div
        ref={scrollRef}
        className="resume-modal-scroll overflow-x-hidden overflow-y-auto rounded-2xl border bg-background/90 px-4 py-3 text-[13px] leading-6 text-foreground/90 h-[260px]"
      >
        {entries.length === 0 ? (
          <div className="font-mono whitespace-pre-wrap break-words">
            {"Hey, I'm Anand's portfolio assistant.\n\nAsk me anything about his work, projects, or experience.\nType 'clear' or use reset to clean the terminal."}
          </div>
        ) : (
          entries.map((entry) => (
            <div key={entry.id} className="mb-4">
              <div className="font-mono whitespace-pre-wrap break-words">
                <span className="text-muted-foreground">{TERMINAL_PROMPT}</span>{" "}
                <span className="text-emerald-400 break-all">{entry.input}</span>
              </div>
              <div className="mt-1 break-words">
                {entry.isLoading ? (
                  <div className="inline-flex items-center gap-2 text-primary/90">
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
                    <span className="text-[12px] text-muted-foreground">thinking</span>
                    <span className="typing-cursor">✦</span>
                  </div>
                ) : (
                  <div className="prose prose-sm max-w-none prose-p:my-2 prose-ul:my-2 prose-li:my-1 prose-headings:my-2 prose-strong:text-foreground dark:prose-invert">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeSanitize]}
                    >
                      {entry.output}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2 text-[12px]">
        <span className="text-muted-foreground">Try:</span>
        {SUGGESTED_TOPICS.map((topic) => (
          <button
            key={topic}
            type="button"
            onClick={() => runInput(topic)}
            disabled={isSubmitting}
            className="rounded-md border border-border px-2 py-1 text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors disabled:opacity-50"
          >
            {topic}
          </button>
        ))}
        <button
          type="button"
          onClick={clearTerminal}
          className="rounded-md border border-primary/30 px-2 py-1 text-primary hover:bg-primary/10 transition-colors"
          title="Reset terminal output"
        >
          reset
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-2 flex items-center gap-2 rounded-xl border bg-background/80 px-3 py-2 min-w-0"
      >
        <span className="text-[11px] font-mono text-foreground/90">
          {TERMINAL_PROMPT}
        </span>
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about projects, skills, experience..."
          className="flex-1 min-w-0 bg-transparent text-[13px] outline-none text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-0 focus-visible:ring-0"
          maxLength={800}
          aria-label="Ask Anand portfolio question"
          autoComplete="off"
          spellCheck={false}
        />
      </form>
    </>
  );
}

