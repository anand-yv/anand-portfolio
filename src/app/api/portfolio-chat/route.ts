import { NextResponse } from "next/server";

import { personalInfo } from "@/data/personal";
import { projects } from "@/data/projects";
import { experience } from "@/data/experience";
import { skills } from "@/data/skills";
import { education } from "@/data/education";

type ChatTurn = {
  role: "user" | "assistant";
  content: string;
};

const PRIMARY_MODEL = "gemini-3.5-flash";
const FALLBACK_MODEL = "gemini-2.5-flash-lite";
const MAX_MESSAGE_CHARS = 800;
const MAX_CONTENT_CHARS = 1500;
const MAX_TURNS = 6;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 8;

// Best-effort, per-instance limiter. On serverless each instance has its own
// memory, so this curbs abuse and quota burn but is not a hard global limit.
const hits = new Map<string, number[]>();

function isRateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (recent.length >= RATE_LIMIT_MAX) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 1000) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= RATE_LIMIT_WINDOW_MS)) hits.delete(key);
    }
  }
  return false;
}

function clientIp(req: Request) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

function clampHistory(history: ChatTurn[] | undefined): ChatTurn[] {
  if (!Array.isArray(history)) return [];
  return history
    .filter(
      (t): t is ChatTurn =>
        !!t &&
        (t.role === "user" || t.role === "assistant") &&
        typeof t.content === "string"
    )
    .map((t) => ({ role: t.role, content: t.content.slice(0, MAX_CONTENT_CHARS) }))
    .slice(-MAX_TURNS);
}

function buildPortfolioContext() {
  return JSON.stringify({ personalInfo, projects, experience, skills, education });
}

function systemInstructionText() {
  const projectIds = projects.map((p) => `${p.id} (${p.title})`).join(", ");
  return [
    "You are the portfolio assistant for Anand Yadav, a software engineer. Visitors are often recruiters or engineers.",
    "PORTFOLIO_DATA is your only source of facts about Anand. Never invent employers, metrics, dates, projects or skills that are not in it.",
    "Be honest, specific and concise. Highlight real strengths, but if something is not in PORTFOLIO_DATA, say it is not listed and, only when it is genuinely adjacent, mention the related experience that is listed. Do not exaggerate.",
    "For availability questions, use personalInfo.availability.",
    "Keep answers short for a chat window: usually 2-5 lines, short sentences, compact bullets when listing. Markdown is supported.",
    "If a question is unrelated to Anand, answer briefly if harmless, then steer back to his work.",
    "",
    "OPTIONAL ACTIONS: after your answer you may add directive lines, each on its own line at the very end, never inside the prose. Use them only when helpful:",
    `[[project:<id>]]  show a project card. Valid ids: ${projectIds}. At most 2.`,
    "[[goto:<section>]]  offer a button that scrolls the page. Sections: about, skills, projects, experience, education, contact.",
    "[[email]]  offer an email button (use when the visitor wants to contact or hire Anand).",
    "[[resume]]  offer a resume link.",
    "[[ask: first follow-up question | second follow-up question]]  up to 3 short follow-up questions the visitor might click next, written from the visitor's point of view.",
    "Do not mention these directives to the visitor.",
  ].join("\n");
}

function encodeSse(text: string) {
  return new TextEncoder().encode(text);
}

/** Streams plain text chunks to the client, translated from Gemini's SSE format. */
async function streamFromGemini(params: { message: string; history: ChatTurn[] }) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("portfolio-chat: GEMINI_API_KEY is not configured.");
    return NextResponse.json({ error: "Missing GEMINI_API_KEY server configuration." }, { status: 500 });
  }

  const contents = [
    ...params.history.map((t) => ({
      role: t.role === "assistant" ? "model" : "user",
      parts: [{ text: t.content }],
    })),
    {
      role: "user",
      parts: [
        {
          text: ["PORTFOLIO_DATA:", buildPortfolioContext(), "", "USER_QUESTION:", params.message].join("\n"),
        },
      ],
    },
  ];

  const body = JSON.stringify({
    systemInstruction: { parts: [{ text: systemInstructionText() }] },
    contents,
    // Thinking off: this is a short Q&A over a small data set, and "thinking"
    // added ~6s before the first token.
    generationConfig: { temperature: 0.5, maxOutputTokens: 800, thinkingConfig: { thinkingBudget: 0 } },
  });

  for (const model of [PRIMARY_MODEL, FALLBACK_MODEL]) {
    try {
      const resp = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse`,
        {
          method: "POST",
          headers: { "content-type": "application/json", "x-goog-api-key": apiKey },
          body,
        }
      );

      if (!resp.ok || !resp.body) {
        console.error(`portfolio-chat: ${model} responded with ${resp.status}`);
        continue;
      }

      const upstream = resp.body.getReader();
      const decoder = new TextDecoder();

      const stream = new ReadableStream<Uint8Array>({
        async start(controller) {
          let buffer = "";
          try {
            for (;;) {
              const { done, value } = await upstream.read();
              if (done) break;
              buffer += decoder.decode(value, { stream: true });
              let newline: number;
              while ((newline = buffer.indexOf("\n")) >= 0) {
                const line = buffer.slice(0, newline).trim();
                buffer = buffer.slice(newline + 1);
                if (!line.startsWith("data:")) continue;
                const json = line.slice(5).trim();
                if (!json) continue;
                try {
                  const data = JSON.parse(json) as {
                    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
                  };
                  const text = (data.candidates?.[0]?.content?.parts ?? []).map((p) => p.text || "").join("");
                  if (text) controller.enqueue(encodeSse(text));
                } catch {
                  // Ignore malformed keep-alive / partial lines.
                }
              }
            }
          } catch (error) {
            console.error(`portfolio-chat: ${model} stream failed`, error);
          } finally {
            controller.close();
          }
        },
        cancel() {
          upstream.cancel().catch(() => {});
        },
      });

      return new Response(stream, {
        headers: {
          "content-type": "text/plain; charset=utf-8",
          "cache-control": "no-store",
          "x-accel-buffering": "no",
        },
      });
    } catch (error) {
      console.error(`portfolio-chat: ${model} request failed`, error);
    }
  }

  return NextResponse.json({ error: "The assistant is temporarily unavailable." }, { status: 502 });
}

export async function POST(req: Request) {
  if (isRateLimited(clientIp(req))) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment." },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = body as { message?: unknown; history?: unknown };
  const message = typeof parsed?.message === "string" ? parsed.message.trim() : "";
  if (!message) {
    return NextResponse.json({ error: "Message is required." }, { status: 400 });
  }
  if (message.length > MAX_MESSAGE_CHARS) {
    return NextResponse.json({ error: `Message too long (max ${MAX_MESSAGE_CHARS} chars).` }, { status: 400 });
  }

  const history = clampHistory(parsed?.history as ChatTurn[] | undefined);
  return streamFromGemini({ message, history });
}
