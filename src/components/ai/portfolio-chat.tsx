"use client";

import * as React from "react";
import {
  ChevronDown,
  MessageCircle,
  RotateCcw,
  Send,
  X,
} from "lucide-react";
import { useChat } from "@/lib/chat-context";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChatMessageList } from "@/components/ai/chat-message-list";
import { usePortfolioChat } from "@/components/ai/use-portfolio-chat";

export function PortfolioChat() {
  const { isOpen, openChat, closeChat } = useChat();
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

  return (
    <>
      {isOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-[59] bg-foreground/10 backdrop-blur-[2px] sm:hidden"
          aria-label="Close chat"
          onClick={closeChat}
        />
      ) : null}

      <div
        className="fixed z-[60] bottom-4 right-4 sm:bottom-6 sm:right-6 pb-[env(safe-area-inset-bottom)] flex flex-col items-end"
        aria-label="Portfolio chat"
      >
      {isOpen ? (
        <div
          className="flex flex-col items-end mb-3 motion-reduce:transition-none transition-[opacity,transform] duration-200 ease-out opacity-100 translate-y-0"
          role="dialog"
          aria-modal="true"
          aria-labelledby="portfolio-chat-title"
        >
          <div
            className={cn(
              "flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-card/95 shadow-xl backdrop-blur-md",
              "w-[calc(100vw-1.5rem)] max-w-[380px]",
              "h-[min(70vh,520px)] sm:h-[520px]"
            )}
          >
          <header className="flex shrink-0 items-center justify-between gap-2 border-b border-border/60 px-4 py-3">
            <div className="min-w-0">
              <h2
                id="portfolio-chat-title"
                className="text-sm font-semibold text-foreground truncate"
              >
                Portfolio assistant
              </h2>
              <p className="text-xs text-muted-foreground truncate">
                Ask about Anand&apos;s work
              </p>
            </div>
            <div className="flex items-center gap-0.5 shrink-0">
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
                aria-label="Minimize chat"
                title="Minimize"
              >
                <ChevronDown className="size-4" />
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

          <div className="shrink-0 border-t border-border/60 px-3 py-2.5 space-y-2">
            <div className="flex flex-wrap gap-1.5">
              {suggestedTopics.map((topic) => (
                <button
                  key={topic}
                  type="button"
                  onClick={() => sendMessage(topic)}
                  disabled={isSubmitting}
                  className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors disabled:opacity-50"
                >
                  {topic}
                </button>
              ))}
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 rounded-xl border border-border bg-background/80 px-3 py-1.5"
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
                className="shrink-0 rounded-lg"
              >
                <Send className="size-4" />
              </Button>
            </form>
          </div>
        </div>
        </div>
      ) : null}

      <Button
        type="button"
        size="icon"
        onClick={isOpen ? closeChat : openChat}
        aria-label={isOpen ? "Close portfolio chat" : "Open portfolio chat"}
        aria-expanded={isOpen}
        className={cn(
          "relative size-14 rounded-full shadow-lg hover:shadow-xl transition-shadow",
          isOpen && "ring-2 ring-primary/30"
        )}
      >
        {isOpen ? (
          <ChevronDown className="size-6" />
        ) : (
          <MessageCircle className="size-6" />
        )}
        {!isOpen ? (
          <span
            className="absolute top-3 right-3 size-2.5 rounded-full bg-emerald-500 ring-2 ring-card"
            aria-hidden
          />
        ) : null}
      </Button>
      </div>
    </>
  );
}
