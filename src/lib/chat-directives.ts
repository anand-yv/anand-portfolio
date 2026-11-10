import { projects } from "@/data/projects";

/** Sections the assistant is allowed to scroll the page to. */
export const GOTO_TARGETS = ["about", "skills", "projects", "experience", "education", "contact"] as const;
export type GotoTarget = (typeof GOTO_TARGETS)[number];

export type ParsedAnswer = {
  /** Answer text with all directives removed (safe to render while streaming). */
  text: string;
  projects: string[];
  goto: GotoTarget[];
  email: boolean;
  resume: boolean;
  suggestions: string[];
};

const DIRECTIVE = /\[\[\s*([a-z]+)\s*(?::([^\]]*))?\]\]/gi;
const projectIds = new Set(projects.map((p) => p.id));

/**
 * The model may end its reply with directive lines such as `[[project:trendsift]]`,
 * `[[goto:contact]]`, `[[email]]`, `[[resume]]`, `[[ask: question one | question two]]`.
 * Everything is validated against known data, so a bad directive is simply ignored.
 */
export function parseAnswer(raw: string): ParsedAnswer {
  const out: ParsedAnswer = { text: "", projects: [], goto: [], email: false, resume: false, suggestions: [] };

  let text = raw.replace(DIRECTIVE, (_m, name: string, arg?: string) => {
    const key = name.toLowerCase();
    const value = (arg ?? "").trim();
    if (key === "project" && projectIds.has(value) && !out.projects.includes(value) && out.projects.length < 2) {
      out.projects.push(value);
    } else if (key === "goto" && (GOTO_TARGETS as readonly string[]).includes(value) && out.goto.length < 2) {
      if (!out.goto.includes(value as GotoTarget)) out.goto.push(value as GotoTarget);
    } else if (key === "email") {
      out.email = true;
    } else if (key === "resume") {
      out.resume = true;
    } else if (key === "ask") {
      out.suggestions = value
        .split("|")
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 3);
    }
    return "";
  });

  // Hide a directive that is still being streamed (opening "[[" without its closing "]]").
  text = text.replace(/\[\[[^\]]*$/, "");
  out.text = text.replace(/\n{3,}/g, "\n\n").trim();
  return out;
}
