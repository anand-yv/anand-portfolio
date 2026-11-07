"use client";

import * as React from "react";
import type { ChatMessage } from "@/components/ai/chat-message-list";
import { parseAnswer } from "@/lib/chat-directives";

export type ChatTurn = {
  role: "user" | "assistant";
  content: string;
};

const STORAGE_KEY = "portfolio-chat-v1";

export const STARTER_PROMPTS = [
  "What's Anand's strongest skill?",
  "Tell me about the Flight Booking project",
  "Is Anand open to work?",
  "How can I contact Anand?",
] as const;

const FRIENDLY_ERROR = "I couldn't reach the assistant just now.";
const RATE_LIMITED = "You're sending messages quickly. Please wait a minute and try again.";
const BUSY = "The assistant is busy right now. Please try again in a minute.";

function historyFrom(messages: ChatMessage[]): ChatTurn[] {
  const turns: ChatTurn[] = [];
  messages.forEach((m, i) => {
    if (m.isLoading || m.error || !m.content) return;
    // Skip a user message whose answer failed (it will be re-sent on retry).
    if (m.role === "user" && messages[i + 1]?.error) return;
    turns.push({ role: m.role, content: m.content });
  });
  return turns;
}

export function usePortfolioChat() {
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [input, setInput] = React.useState("");
  const [inputHistory, setInputHistory] = React.useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = React.useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement | null>(null);
  const abortRef = React.useRef<AbortController | null>(null);
  const nextId = React.useRef(1);
  const hydrated = React.useRef(false);

  // Restore the conversation for this tab session.
  React.useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as ChatMessage[];
        if (Array.isArray(saved) && saved.length) {
          setMessages(saved);
          nextId.current = Math.max(...saved.map((m) => m.id)) + 1;
        }
      }
    } catch {
      // Storage unavailable or corrupt: start fresh.
    }
    hydrated.current = true;
  }, []);

  React.useEffect(() => {
    if (!hydrated.current || isSubmitting) return;
    try {
      const toSave = messages.filter((m) => !m.isLoading);
      if (toSave.length) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
      else sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, [messages, isSubmitting]);

  React.useEffect(() => () => abortRef.current?.abort(), []);

  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, isSubmitting]);

  const clearChat = React.useCallback(() => {
    abortRef.current?.abort();
    setMessages([]);
    setInput("");
    setHistoryIndex(null);
    setIsSubmitting(false);
  }, []);

  /** Sends `text` and streams the answer into the message with `loadingId`. */
  const request = React.useCallback(async (text: string, history: ChatTurn[], loadingId: number) => {
    const controller = new AbortController();
    abortRef.current = controller;
    setIsSubmitting(true);

    const fail = (message: string) =>
      setMessages((prev) =>
        prev.map((m) =>
          m.id === loadingId
            ? { id: loadingId, role: "assistant", content: message, error: true, retryText: text }
            : m
        )
      );

    try {
      const response = await fetch("/api/portfolio-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
        signal: controller.signal,
      });

      if (response.status === 429) return fail(RATE_LIMITED);
      if (response.status === 503) return fail(BUSY);
      if (!response.ok || !response.body) return fail(FRIENDLY_ERROR);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let raw = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        raw += decoder.decode(value, { stream: true });
        const parsed = parseAnswer(raw);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === loadingId
              ? { ...m, ...parsed, content: parsed.text, isLoading: parsed.text === "" }
              : m
          )
        );
      }

      const final = parseAnswer(raw);
      if (!final.text) return fail(FRIENDLY_ERROR);
      setMessages((prev) =>
        prev.map((m) => (m.id === loadingId ? { ...m, ...final, content: final.text, isLoading: false } : m))
      );
    } catch (error) {
      if ((error as { name?: string })?.name === "AbortError") return;
      fail(FRIENDLY_ERROR);
    } finally {
      if (abortRef.current === controller) setIsSubmitting(false);
    }
  }, []);

  const sendMessage = React.useCallback(
    async (rawInput: string) => {
      const text = rawInput.trim();
      if (!text || isSubmitting) return;

      const userId = nextId.current++;
      const loadingId = nextId.current++;
      const history = historyFrom(messages);

      setMessages((prev) => [
        ...prev,
        { id: userId, role: "user", content: text },
        { id: loadingId, role: "assistant", content: "", isLoading: true },
      ]);
      setInputHistory((prev) => [...prev, text]);
      setHistoryIndex(null);
      setInput("");

      await request(text, history, loadingId);
    },
    [isSubmitting, messages, request]
  );

  const retry = React.useCallback(
    async (messageId: number) => {
      if (isSubmitting) return;
      const index = messages.findIndex((m) => m.id === messageId);
      const failed = messages[index];
      if (!failed?.retryText) return;

      // Drop the failed answer and its question, then ask again.
      const remaining = messages.filter((m, i) => i !== index && i !== index - 1);
      const userId = nextId.current++;
      const loadingId = nextId.current++;
      setMessages([
        ...remaining,
        { id: userId, role: "user", content: failed.retryText },
        { id: loadingId, role: "assistant", content: "", isLoading: true },
      ]);
      await request(failed.retryText, historyFrom(remaining), loadingId);
    },
    [isSubmitting, messages, request]
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
        const nextIndex = historyIndex === null ? inputHistory.length - 1 : Math.max(0, historyIndex - 1);
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
    retry,
    handleSubmit,
    handleKeyDown,
    starterPrompts: STARTER_PROMPTS,
    showWelcome: messages.length === 0,
  };
}
