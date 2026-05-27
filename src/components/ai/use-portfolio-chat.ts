"use client";

import * as React from "react";
import type { ChatMessage } from "@/components/ai/chat-message-list";

export type ChatTurn = {
  role: "user" | "assistant";
  content: string;
};

const SUGGESTED_TOPICS = ["projects", "skills", "experience", "contact"] as const;

function formatAnswer(text: string) {
  return text.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
}

export function usePortfolioChat() {
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [chatHistory, setChatHistory] = React.useState<ChatTurn[]>([]);
  const [input, setInput] = React.useState("");
  const [inputHistory, setInputHistory] = React.useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = React.useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, isSubmitting]);

  const clearChat = React.useCallback(() => {
    setMessages([]);
    setChatHistory([]);
    setInput("");
    setHistoryIndex(null);
    setIsSubmitting(false);
  }, []);

  const sendMessage = React.useCallback(
    async (rawInput: string) => {
      const text = rawInput.trim();
      if (!text || isSubmitting) return;

      const userMsg: ChatMessage = {
        id: Date.now(),
        role: "user",
        content: text,
      };
      const loadingId = Date.now() + 1;
      const loadingMsg: ChatMessage = {
        id: loadingId,
        role: "assistant",
        content: "",
        isLoading: true,
      };

      setMessages((prev) => [...prev, userMsg, loadingMsg]);
      setInputHistory((prev) => [...prev, text]);
      setHistoryIndex(null);
      setInput("");

      setIsSubmitting(true);
      try {
        const response = await fetch("/api/portfolio-chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: text,
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
        const answer = formatAnswer(
          typeof data.answer === "string" ? data.answer : "No response from AI."
        );

        setMessages((prev) =>
          prev.map((m) =>
            m.id === loadingId
              ? { id: loadingId, role: "assistant", content: answer }
              : m
          )
        );
        setChatHistory((prev) => [
          ...prev,
          { role: "user", content: text },
          { role: "assistant", content: answer },
        ]);
      } catch (error) {
        const answer =
          error instanceof Error
            ? [
                "Temporary AI hiccup on this request.",
                "Please retry in a few seconds.",
              ].join("\n")
            : "Temporary AI hiccup on this request. Please retry in a few seconds.";
        setMessages((prev) =>
          prev.map((m) =>
            m.id === loadingId
              ? { id: loadingId, role: "assistant", content: answer }
              : m
          )
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [chatHistory, isSubmitting]
  );

  const handleSubmit = React.useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      sendMessage(input);
    },
    [input, sendMessage]
  );

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
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
    },
    [historyIndex, inputHistory]
  );

  return {
    messages,
    input,
    setInput,
    isSubmitting,
    scrollRef,
    clearChat,
    sendMessage,
    handleSubmit,
    handleKeyDown,
    suggestedTopics: SUGGESTED_TOPICS,
    showWelcome: messages.length === 0,
  };
}
