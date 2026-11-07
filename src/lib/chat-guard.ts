/**
 * Guards for the portfolio chat. Self-contained (no imports) so it can be tested on its own.
 *
 *  - sanitizeInput:   strips control / invisible characters from visitor text.
 *  - classifyMessage: spots prompt-injection, questions about how the assistant works, and requests for
 *                     secrets, and returns a fixed reply so the model is never asked to handle them.
 *  - createLeakGuard: watches the streamed answer and cuts it if it starts describing internals.
 */

/* ---------------------------------------------------------------- input */

export function sanitizeInput(raw: string, max = 800): string {
  return raw
    .normalize("NFKC")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "") // control characters
    .replace(/[​-‏‪-‮⁠-⁤﻿]/g, "") // zero-width and bidi tricks
    .replace(/\r\n?/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, max);
}

export type GuardKind = "injection" | "secrets" | "how-it-works" | "identity";

export type GuardResult = { kind: "ok" } | { kind: GuardKind; reply: string };

const SUGGEST = "[[ask: What does Anand work on? | Show me his projects | How can I contact him?]]";

const REPLIES: Record<GuardKind, string> = {
  injection: `I can't change how I work or share behind-the-scenes details, but I'm glad to help with questions about Anand's work.\n\n${SUGGEST}`,
  secrets: `I can't help with keys, passwords or credentials. I'm happy to talk about Anand's projects, skills or experience instead.\n\n${SUGGEST}`,
  "how-it-works": `I answer from what Anand has shared on this site: his projects, experience, skills and education. I don't go into how I'm built. If you need something that isn't covered here, the quickest route is to email Anand directly.\n\n[[email]]\n[[ask: What does Anand work on? | Show me his projects]]`,
  identity: `I'm an AI assistant on Anand's portfolio, not a person. I can tell you about his projects, skills and experience, or help you get in touch with him.\n\n[[email]]\n${SUGGEST}`,
};

const INJECTION: RegExp[] = [
  /\b(ignore|disregard|forget|override|bypass|skip)\b.{0,40}\b(previous|prior|above|earlier|all|your|these|the|any)\b.{0,30}\b(instruction|prompt|rule|guideline|constraint|direction|restriction)s?\b/i,
  /\b(reveal|show|print|display|repeat|output|leak|tell me|give me|share|dump|recite|paste|translate|summari[sz]e)\b.{0,30}\b(system|initial|hidden|original|developer|secret|full)\b.{0,15}\b(prompt|instruction|message|rule)s?\b/i,
  /\bwhat\b.{0,12}\b(is|are|were)\b.{0,10}\byour\b.{0,12}\b(system |initial |hidden |original )?(prompt|instructions|rules|guidelines|directives)\b/i,
  /\b(jailbreak|developer mode|dan mode|do anything now|unrestricted mode|no restrictions)\b/i,
  /\byou are now\b|\bpretend (that )?(you are|you're|to be)\b|\bfrom now on,? you\b/i,
  /<\/?(system|assistant|instructions?)>|\[\/?(inst|system)\]/i,
  /\brepeat (everything|all|the text|the words) (above|before)\b/i,
];

const SECRETS: RegExp[] = [
  /(^|\s)\.env\b/i,
  /\b(what('?s| is| are)|give|show|tell|share|reveal|send|leak|print|expose)\b.{0,30}\b(api[\s_-]?keys?|secret keys?|access tokens?|auth tokens?|passwords?|\.env|environment variables?|private keys?)\b/i,
  /\byour\b.{0,10}\b(api[\s_-]?keys?|secrets?|env|tokens?)\b/i,
];

const HOW_IT_WORKS: RegExp[] = [
  /\bwhere\b.{0,20}\b(is|are|do|does|did)\b.{0,12}\b(your|you)\b.{0,40}\b(data|info|information|knowledge|answers?|details)\b/i,
  /\bwhere\b.{0,30}\b(data|info|information|knowledge)\b.{0,30}\byou\b.{0,15}\b(use|have|know|read|store|keep)\b/i,
  /\b(where|how)\b.{0,25}\b(do|did|does)\b.{0,10}\byou\b.{0,20}\b(get|got|know|learn|learned|retrieve|fetch|pull|access)\b/i,
  /\b(what|which)\b.{0,25}\b(model|llm|ai|gpt|engine|api|provider)\b.{0,25}\b(are you|do you use|powers? you|is this|behind you|running|using)\b/i,
  /\b(how|what)\b.{0,15}\b(are|were)\b.{0,10}\byou\b.{0,15}\b(built|made|trained|programmed|created|coded|developed)\b/i,
  /\bhow do(es)? (you|this (chat|bot|assistant)) work\b/i,
  /\byour\b.{0,6}\b(source|sources|database|backend|codebase|training data|knowledge base|data ?source|tech stack)\b/i,
  /\bwhat('?s| is)\b.{0,6}\byour\b.{0,6}\b(data|source|context|knowledge|backend)\b/i,
  /\b(json|database|file|csv|spreadsheet|document|vector|embedding)s?\b.{0,40}\b(do you|are you|is your|you use|you read|you have)\b/i,
  /\bdo you (have|use|read|see)\b.{0,25}\b(a )?(database|file|json|prompt|knowledge base|documents?|source code)\b/i,
];

const IDENTITY: RegExp[] = [
  /\bare you\b.{0,12}\b(chatgpt|gpt|gemini|claude|llama|openai|bard|copilot|an ai|a bot|a robot|real|human|a person|anand)\b/i,
  /\bam i (talking|speaking|chatting) (to|with)\b.{0,20}\b(a )?(human|person|bot|ai|robot|anand|real)\b/i,
  /\bis this\b.{0,10}\b(a )?(human|person|bot|ai|robot|real|anand)\b/i,
];

const test = (list: RegExp[], text: string) => list.some((re) => re.test(text));

export function classifyMessage(message: string): GuardResult {
  const text = message.toLowerCase();
  if (test(INJECTION, text)) return { kind: "injection", reply: REPLIES.injection };
  if (test(SECRETS, text)) return { kind: "secrets", reply: REPLIES.secrets };
  if (test(HOW_IT_WORKS, text)) return { kind: "how-it-works", reply: REPLIES["how-it-works"] };
  if (test(IDENTITY, text)) return { kind: "identity", reply: REPLIES.identity };
  return { kind: "ok" };
}

/* --------------------------------------------------------------- output */

/** Things an answer should never say: names of internals, or descriptions of its own instructions. */
const LEAK: RegExp[] = [
  /PORTFOLIO[_ ]?DATA|USER_?QUESTION|VISITOR.S QUESTION|PROFILE[_ ]?DATA|personalInfo|systemInstruction|GEMINI_API|process\.env/i,
  /\bsystem[ _]prompt\b/i,
  /\b(here (are|is)|these are|those are) (my|the) (system |hidden |initial )?(instructions|rules|prompt|guidelines)\b|\bmy (system |hidden |initial )?(instructions|prompt)\s*[:\-]/i,
  /\b(my|the|these|those) (system |hidden |initial )?(instructions|programming|guidelines|prompt)\b.{0,25}\b(say|says|tell|tells|state|states|are|is|include|require|require[sd]|forbid|forbids)\b/i,
  /\bi (was|am|have been|had been) (instructed|told|programmed|configured|trained|prompted|designed) (to|not to|never to)\b/i,
  /\bsrc\/(data|lib|app|components)\b|\b[\w-]+\.(tsx?|json)\b/i, // not .js: Node.js, React.js and Next.js are real answers
  /\baccording to (the|my) (data|profile|context|json|file|document|database|information (provided|given))\b/i,
  /\b(in|from|within) (the|my) (provided|given) (data|profile|context|information|json|files?)\b/i,
  /\b(in|from|within) my (data|profile|context|files?|database|knowledge base)\b/i, // not "in the database": projects store data in databases
];

export const LEAK_REDIRECT =
  "That's about how I work behind the scenes, which I can't get into. I'm happy to talk about Anand's projects, skills or experience instead.";

/**
 * Streaming-safe filter. Text is held back for a short tail so a pattern split across chunks is still
 * caught. On a match it emits everything up to the last complete sentence, then a polite redirect, and
 * tells the caller to stop the stream.
 */
export function createLeakGuard(hold = 40) {
  let pending = "";
  let stopped = false;

  const firstMatch = (text: string) => {
    let at = -1;
    for (const re of LEAK) {
      const m = re.exec(text);
      if (m && (at === -1 || m.index < at)) at = m.index;
    }
    return at;
  };

  const cut = (text: string, at: number) => {
    const head = text.slice(0, at);
    const sentenceEnd = Math.max(head.lastIndexOf(". "), head.lastIndexOf("! "), head.lastIndexOf("? "), head.lastIndexOf("\n"));
    const safe = sentenceEnd >= 0 ? head.slice(0, sentenceEnd + 1).trimEnd() : "";
    return (safe ? `${safe}\n\n` : "") + LEAK_REDIRECT;
  };

  return {
    push(chunk: string): { emit: string; stop: boolean } {
      if (stopped) return { emit: "", stop: true };
      pending += chunk;
      const at = firstMatch(pending);
      if (at >= 0) {
        stopped = true;
        const emit = cut(pending, at);
        pending = "";
        return { emit, stop: true };
      }
      if (pending.length <= hold) return { emit: "", stop: false };
      const emit = pending.slice(0, pending.length - hold);
      pending = pending.slice(pending.length - hold);
      return { emit, stop: false };
    },
    flush(): string {
      if (stopped) return "";
      const at = firstMatch(pending);
      const out = at >= 0 ? cut(pending, at) : pending;
      pending = "";
      stopped = true;
      return out;
    },
  };
}
