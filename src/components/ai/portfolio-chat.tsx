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
    retry,
    handleSubmit,
    handleKeyDown,
    starterPrompts,
    showWelcome,
  } = usePortfolioChat();

  const handleGoto = React.useCallback(
    (target: string) => {
      closeChat();
      setTimeout(() => document.getElementById(target)?.scrollIntoView({ behavior: "smooth", block: "start" }), 180);
    },
    [closeChat]
  );

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
      // Cmd/Ctrl + K toggles the assistant.
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) closeChat();
        else openChat();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, openChat, closeChat]);

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
                  "sketch-box flex flex-col overflow-hidden",
                  "w-[calc(100vw-1.5rem)] sm:w-[420px]",
                  "h-[min(78dvh,640px)]"
                )}
              >
                <header className="flex shrink-0 items-center justify-between gap-2 border-b-2 border-dashed border-ink/25 px-4 py-3">
                  <div className="min-w-0">
                    <h2
                      id="portfolio-chat-title"
                      className="truncate font-display text-base font-bold text-foreground"
                    >
                      Portfolio assistant
                    </h2>
                    <p className="truncate font-hand text-lg leading-none text-link">
                      ask me about Anand&apos;s work
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
                  starterPrompts={starterPrompts}
                  busy={isSubmitting}
                  scrollRef={scrollRef}
                  onSend={sendMessage}
                  onRetry={retry}
                  onGoto={handleGoto}
                />

                <div className="shrink-0 space-y-2 border-t-2 border-dashed border-ink/25 px-3 py-2.5">
                  <form
                    onSubmit={handleSubmit}
                    className="sketch-box sketch-box--sm flex items-center gap-2 bg-background px-3 py-1.5"
                  >
                    <input
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Ask about projects, skills, hiring…"
                      className="flex-1 min-w-0 bg-transparent text-sm outline-none text-foreground placeholder:text-muted-foreground/60"
                      maxLength={800}
                      aria-label="Message"
                      enterKeyHint="send"
                      autoComplete="off"
                      spellCheck={false}
                      disabled={isSubmitting}
                    />
                    <Button
                      type="submit"
                      size="icon-sm"
                      disabled={!input.trim() || isSubmitting}
                      aria-label="Send message"
                      className="shrink-0 bg-brand text-brand-foreground hover:bg-brand"
                    >
                      <Send className="size-4" />
                    </Button>
                  </form>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <motion.div whileTap={reduced ? undefined : { scale: 0.94 }}>
          <Button
            type="button"
            size="icon"
            onClick={isOpen ? closeChat : openChat}
            aria-label={isOpen ? "Close portfolio chat" : "Open portfolio chat"}
            aria-expanded={isOpen}
            className={cn(
              "sketch-btn sketch-box--brand relative size-12 rounded-sm hover:bg-brand",
              !isOpen && "fab-wiggle"
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
