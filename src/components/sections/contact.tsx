import Link from "next/link";
import { Mail, MapPin, Send } from "lucide-react";
import { SectionWrapper } from "@/components/layout/section-wrapper";
import { Reveal } from "@/components/motion/reveal";
import {
  ContactChannelCard,
  type ContactChannelIcon,
} from "@/components/sections/contact-channel-card";
import { ContactChatCta } from "@/components/sections/contact-chat-cta";
import { SectionHeader } from "@/components/sections/section-header";
import { personalInfo } from "@/data/personal";

type ContactChannel = {
  id: string;
  href: string;
  label: string;
  description: string;
  icon: ContactChannelIcon;
};

const channels: ContactChannel[] = [
  personalInfo.github
    ? {
        id: "github",
        href: personalInfo.github,
        label: "GitHub",
        description: "Projects, code, and open-source work",
        icon: "github",
      }
    : null,
  personalInfo.linkedin
    ? {
        id: "linkedin",
        href: personalInfo.linkedin,
        label: "LinkedIn",
        description: "Professional profile and network",
        icon: "linkedin",
      }
    : null,
].filter((c): c is ContactChannel => c !== null);

export function Contact() {
  return (
    <SectionWrapper id="contact" width="wide">
      <Reveal>
        <SectionHeader
          icon={<Send />}
          label="06 — Contact"
          title="Get in touch"
          description="Open to roles, collaborations, and thoughtful conversations about software."
        />
      </Reveal>

      <div className="mt-8 grid gap-4 sm:mt-10 lg:grid-cols-12 lg:items-stretch lg:gap-5">
        <Reveal delayMs={50} className="lg:col-span-7">
          <div className="group relative flex flex-col gap-5 overflow-hidden rounded-sm border border-brand/20 bg-gradient-to-br from-card/80 via-card/60 to-brand-muted/25 p-6 sm:p-8">
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/60 to-transparent"
              aria-hidden
            />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-brand">
                Email
              </p>
              <p className="mt-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Let&apos;s build something solid.
              </p>
              <p className="mt-3 max-w-lg text-[0.95rem] leading-relaxed text-muted-foreground">
                Whether it&apos;s a full-time role or a project that needs a reliable
                full-stack engineer, I&apos;d love to hear from you.
              </p>
            </div>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Link
                href={`mailto:${personalInfo.email}`}
                className="inline-flex items-center justify-center gap-2 rounded-sm bg-brand px-6 py-3 text-base font-medium text-brand-foreground shadow-sm transition-[transform,box-shadow] duration-200 hover:scale-[1.02] hover:bg-brand/90 hover:shadow-md hover:shadow-brand/25"
              >
                <Mail className="size-4" aria-hidden />
                {personalInfo.email}
              </Link>
              <ContactChatCta />
            </div>
          </div>
        </Reveal>

        <div className="grid h-full gap-2 lg:col-span-5 lg:grid-rows-3 lg:gap-2.5">
          <Reveal delayMs={100} className="h-full">
            <div className="glass-panel flex h-full items-start gap-2 rounded-sm p-3 sm:p-3.5">
              <MapPin className="mt-0.5 size-4.5 shrink-0 text-brand" aria-hidden />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-brand">
                  Location
                </p>
                <p className="mt-1 text-sm font-medium text-foreground">
                  {personalInfo.location}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Open to remote and hybrid opportunities.
                </p>
              </div>
            </div>
          </Reveal>

          {channels.map((channel, idx) => (
            <Reveal key={channel.id} delayMs={140 + idx * 40} className="h-full">
              <ContactChannelCard
                href={channel.href}
                label={channel.label}
                description={channel.description}
                icon={channel.icon}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
