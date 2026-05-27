"use client";

import * as React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import { cn } from "@/lib/utils";

export type ChatMessage = {
  id: number;
  role: "user" | "assistant";
  content: string;
  isLoading?: boolean;
};

const WELCOME_MESSAGE =
  "Ask me about projects, experience, or how to get in touch.";

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-1 py-0.5" aria-hidden>
      <span className="size-1.5 rounded-full bg-muted-foreground/70 animate-pulse" />
      <span
        className="size-1.5 rounded-full bg-muted-foreground/70 animate-pulse"
        style={{ animationDelay: "120ms" }}
      />
      <span
        className="size-1.5 rounded-full bg-muted-foreground/70 animate-pulse"
        style={{ animationDelay: "240ms" }}
      />
    </div>
  );
}

function MessageBubble({
  message,
}: {
  message: ChatMessage;
}) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex w-full",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[85%] rounded-sm px-3 py-2 text-sm leading-relaxed break-words",
          isUser
            ? "bg-brand text-brand-foreground"
            : "bg-muted text-foreground"
        )}
      >
        {message.isLoading ? (
          <TypingIndicator />
        ) : isUser ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="prose prose-sm max-w-none prose-p:my-1.5 prose-ul:my-1.5 prose-li:my-0.5 prose-headings:my-1.5 prose-strong:text-foreground dark:prose-invert">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeSanitize]}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}

type ChatMessageListProps = {
  messages: ChatMessage[];
  showWelcome: boolean;
  scrollRef?: React.RefObject<HTMLDivElement | null>;
};

export function ChatMessageList({
  messages,
  showWelcome,
  scrollRef,
}: ChatMessageListProps) {
  return (
    <div
      ref={scrollRef}
      className="resume-modal-scroll flex-1 overflow-x-hidden overflow-y-auto px-4 py-4 space-y-3 min-h-0"
      role="log"
      aria-live="polite"
      aria-relevant="additions"
    >
      {showWelcome && messages.length === 0 ? (
        <div className="flex justify-start">
          <div className="max-w-[85%] rounded-sm px-3 py-2 text-sm leading-relaxed bg-muted text-foreground">
            <p>{WELCOME_MESSAGE}</p>
          </div>
        </div>
      ) : null}
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
    </div>
  );
}
