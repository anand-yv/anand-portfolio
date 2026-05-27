import { personalInfo } from "@/data/personal";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/70 py-10">
      <div className="container mx-auto max-w-3xl px-4 sm:px-6">
        <p className="text-sm text-muted-foreground">
          © {year} {personalInfo.name}. Built with Next.js.
        </p>
      </div>
    </footer>
  );
}
