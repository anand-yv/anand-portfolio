"use client";

import * as React from "react";
import {
  ChevronDown,
  MessageCircle,
  RotateCcw,
  Send,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useChat } from "@/lib/chat-context";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChatMessageList } from "@/components/ai/chat-message-list";
import { usePortfolioChat } from "@/components/ai/use-portfolio-chat";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function PortfolioChat() {
  const { isOpen, openChat, closeChat } = useChat();
  const reduced = useReducedMotion();
  const {
    messages,
    input,
    setInput,
    isSubmitting,
    scrollRef,
    clearChat,
    sendMessage,
    handleSubmit,
    handleKeyDown,
    suggestedTopics,
    showWelcome,
  } = usePortfolioChat();

  const inputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) closeChat();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, closeChat]);

  const fabIdleAnimation =
    !isOpen && !reduced
      ? {
          scale: [1, 1.04, 1],
          y: [0, -2, 0],
          opacity: [1, 0.95, 1],
          boxShadow: [
            "0 10px 24px color-mix(in oklab, var(--brand) 28%, transparent), 0 0 22px color-mix(in oklab, var(--brand) 16%, transparent)",
            "0 14px 30px color-mix(in oklab, var(--brand) 38%, transparent), 0 0 30px color-mix(in oklab, var(--brand) 24%, transparent)",
            "0 10px 24px color-mix(in oklab, var(--brand) 28%, transparent), 0 0 22px color-mix(in oklab, var(--brand) 16%, transparent)",
          ],
        }
      : undefined;

  const fabIdleTransition =
    !isOpen && !reduced
      ? {
          duration: 2.2,
          ease: "easeInOut" as const,
          repeat: Infinity,
        }
      : undefined;

  return (
    <>
      <AnimatePresence>
        {isOpen ? (
          <motion.button
            type="button"
            key="backdrop"
            className="fixed inset-0 z-[59] bg-foreground/10 backdrop-blur-[2px] sm:hidden"
            aria-label="Close chat"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeChat}
          />
        ) : null}
      </AnimatePresence>

      <div
        className="fixed z-[60] bottom-4 right-4 sm:bottom-6 sm:right-6 pb-[env(safe-area-inset-bottom)] flex flex-col items-end"
        aria-label="Portfolio chat"
      >
        <AnimatePresence>
          {isOpen ? (
            <motion.div
              key="panel"
              className="mb-3 flex flex-col items-end"
              role="dialog"
              aria-modal="true"
              aria-labelledby="portfolio-chat-title"
              initial={reduced ? false : { opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduced ? undefined : { opacity: 0, y: 12, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
            >
              <div
                className={cn(
                  "glass-panel flex flex-col overflow-hidden rounded-sm",
                  "w-[calc(100vw-1.5rem)] max-w-[380px]",
                  "h-[min(70vh,520px)] sm:h-[520px]"
                )}
              >
                <header className="flex shrink-0 items-center justify-between gap-2 border-b border-border/60 px-4 py-3">
                  <div className="min-w-0">
                    <h2
                      id="portfolio-chat-title"
                      className="truncate text-sm font-semibold text-foreground"
                    >
                      Portfolio assistant
                    </h2>
                    <p className="truncate text-xs text-muted-foreground">
                      Ask about Anand&apos;s work
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-0.5">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={clearChat}
                      aria-label="Clear chat"
                      title="Clear chat"
                    >
                      <RotateCcw className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={closeChat}
                      aria-label="Close chat"
                      title="Close"
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                </header>

                <ChatMessageList
                  messages={messages}
                  showWelcome={showWelcome}
                  scrollRef={scrollRef}
                />

                <div className="shrink-0 space-y-2 border-t border-border/60 px-3 py-2.5">
                  <div className="flex flex-wrap gap-1.5">
                    {suggestedTopics.map((topic) => (
                      <button
                        key={topic}
                        type="button"
                        onClick={() => sendMessage(topic)}
                        disabled={isSubmitting}
                        className="rounded-sm border border-border px-2 py-0.5 text-xs text-muted-foreground transition-colors hover:border-brand/40 hover:bg-brand-muted hover:text-foreground disabled:opacity-50"
                      >
                        {topic}
                      </button>
                    ))}
                  </div>

                  <form
                    onSubmit={handleSubmit}
                    className="flex items-center gap-2 rounded-sm border border-border bg-background px-3 py-1.5"
                  >
                    <input
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Ask a question..."
                      className="flex-1 min-w-0 bg-transparent text-sm outline-none text-foreground placeholder:text-muted-foreground/60"
                      maxLength={800}
                      aria-label="Message"
                      autoComplete="off"
                      spellCheck={false}
                      disabled={isSubmitting}
                    />
                    <Button
                      type="submit"
                      size="icon-sm"
                      disabled={!input.trim() || isSubmitting}
                      aria-label="Send message"
                      className="shrink-0 bg-brand text-brand-foreground hover:bg-brand/90"
                    >
                      <Send className="size-4" />
                    </Button>
                  </form>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <motion.div
          whileTap={reduced ? undefined : { scale: 0.94 }}
          animate={fabIdleAnimation}
          transition={fabIdleTransition}
        >
          <Button
            type="button"
            size="icon"
            onClick={isOpen ? closeChat : openChat}
            aria-label={isOpen ? "Close portfolio chat" : "Open portfolio chat"}
            aria-expanded={isOpen}
            className={cn(
              "relative size-12 rounded-sm bg-brand text-brand-foreground shadow-md shadow-brand/25 hover:bg-brand/90 hover:shadow-lg hover:shadow-brand/30",
              isOpen && "ring-2 ring-brand/30"
            )}
          >
            {isOpen ? (
              <ChevronDown className="size-5" />
            ) : (
              <MessageCircle className="size-5" />
            )}
          </Button>
        </motion.div>
      </div>
    </>
  );
}
