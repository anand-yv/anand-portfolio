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

const MODEL = "gemini-3.1-flash-lite-preview";
const MAX_MESSAGE_CHARS = 800;
const MAX_TURNS = 6;
const MAX_OUTPUT_CHARS = 700;

function fallbackReply() {
  return [
    "Temporary AI hiccup on my side (rate-limit or network).",
    "Please retry in a few seconds.",
  ].join("\n");
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
    .slice(-MAX_TURNS);
}

function buildPortfolioContext() {
  return JSON.stringify(
    {
      personalInfo,
      projects,
      experience,
      skills,
      education,
    },
    null,
    0
  );
}

function systemInstructionText() {
  return [
    "You are Anand Yadav's portfolio assistant.",
    "Use PORTFOLIO_DATA as the main source for factual details about Anand.",
    "Be polished, friendly, and concise. Sound natural, not robotic.",
    "Always present Anand in a strong, positive professional light while staying truthful.",
    "If asked about a tool not explicitly listed (for example Redis), avoid a flat rejection.",
    "For missing tools: acknowledge it's not explicitly listed, then add growth framing (adjacent experience + ability to learn fast).",
    "Keep responses structured and skimmable when listing projects/skills.",
    "Keep responses short-to-medium for terminal UX: typically 2-5 lines.",
    "Avoid long paragraphs. Prefer short sentences and compact bullets when needed.",
    "If asked outside portfolio context, still answer helpfully and briefly.",
    "Do not invent portfolio facts that are not present in PORTFOLIO_DATA.",
    "Vary phrasing so replies do not feel repetitive.",
  ].join("\n");
}

function normalizeAnswerLength(answer: string) {
  const compact = answer.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
  if (compact.length <= MAX_OUTPUT_CHARS) return compact;

  const truncated = compact.slice(0, MAX_OUTPUT_CHARS);
  const lastBreak = Math.max(
    truncated.lastIndexOf("\n"),
    truncated.lastIndexOf(". "),
    truncated.lastIndexOf(" | ")
  );
  const safeCut = lastBreak > 180 ? truncated.slice(0, lastBreak + 1) : truncated;
  return `${safeCut.trim()}\n\n(Short version shown)`;
}

async function generateWithGemini(params: {
  message: string;
  history: ChatTurn[];
}) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing GEMINI_API_KEY server configuration." },
      { status: 500 }
    );
  }

  const portfolioData = buildPortfolioContext();
  const systemText = systemInstructionText();

  const contents = [
    ...params.history.map((t) => ({
      role: t.role === "assistant" ? "model" : "user",
      parts: [{ text: t.content }],
    })),
    {
      role: "user",
      parts: [
        {
          text: [
            "PORTFOLIO_DATA:",
            portfolioData,
            "",
            "USER_QUESTION:",
            params.message,
          ].join("\n"),
        },
      ],
    },
  ];

  let resp: Response;
  try {
    resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${encodeURIComponent(
        apiKey
      )}`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemText }] },
          contents,
          generationConfig: {
            temperature: 0.55,
            maxOutputTokens: 512,
          },
        }),
      }
    );
  } catch {
    return NextResponse.json({ answer: fallbackReply() });
  }

  if (!resp.ok) {
    return NextResponse.json({ answer: fallbackReply() });
  }

  const data = (await resp.json()) as {
    candidates?: Array<{
      content?: { parts?: Array<{ text?: string }> };
    }>;
  };

  const parts = data.candidates?.[0]?.content?.parts ?? [];
  const answer: string | undefined = parts
    .map((part) => part.text || "")
    .join("")
    .trim();

  if (!answer || typeof answer !== "string") {
    return NextResponse.json({ answer: fallbackReply() });
  }

  return NextResponse.json({ answer: normalizeAnswerLength(answer) });
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = body as {
    message?: unknown;
    history?: unknown;
  };

  const message =
    typeof parsed?.message === "string" ? parsed.message.trim() : "";
  if (!message) {
    return NextResponse.json({ error: "Message is required." }, { status: 400 });
  }
  if (message.length > MAX_MESSAGE_CHARS) {
    return NextResponse.json(
      { error: `Message too long (max ${MAX_MESSAGE_CHARS} chars).` },
      { status: 400 }
    );
  }

  const history = clampHistory(parsed?.history as ChatTurn[] | undefined);
  return generateWithGemini({ message, history });
}

