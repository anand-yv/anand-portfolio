import { ArrowUp } from "lucide-react";
import { CursorToggle } from "@/components/layout/cursor-toggle";
import { personalInfo } from "@/data/personal";

export function Footer() {
  return (
    <footer className="border-t-2 border-dashed border-ink/15 py-10">
      <div className="container mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 xl:max-w-6xl">
        <p className="font-hand text-xl text-muted-foreground">
          © {new Date().getFullYear()} {personalInfo.name} · sketched with Next.js &amp; a lot of coffee
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <CursorToggle />
          <a
            href="#hero"
            className="sketch-btn inline-flex items-center gap-1.5 bg-card px-3 py-1.5 font-hand text-lg text-foreground"
          >
            back to top <ArrowUp className="size-4" aria-hidden />
          </a>
        </div>
      </div>
    </footer>
  );
}
