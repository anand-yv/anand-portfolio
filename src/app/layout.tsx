import type { Metadata } from "next";
import { Geist, Geist_Mono, Caveat, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme-provider";
import { ChatProvider } from "@/lib/chat-context";
import { Navbar } from "@/components/layout/navbar";
import { PortfolioChatDynamic } from "@/components/ai/portfolio-chat-dynamic";
import { Intro } from "@/components/layout/intro";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = "https://helloanand.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "/" },
  title: "Anand Yadav | Full-Stack Software Engineer",
  description:
    "Backend-strong Full-Stack Software Engineer specializing in Spring Boot and React. Building scalable REST APIs, robust database architectures, and seamless user experiences.",
  keywords: [
    "Anand Yadav",
    "Software Engineer",
    "Full-Stack Developer",
    "Spring Boot",
    "React",
    "TypeScript",
    "Backend Developer",
    "REST API",
    "Microservices",
    "PostgreSQL",
    "MongoDB",
  ],
  authors: [{ name: "Anand Yadav" }],
  creator: "Anand Yadav",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    title: "Anand Yadav | Full-Stack Software Engineer",
    description:
      "Backend-strong Full-Stack Software Engineer specializing in Spring Boot and React.",
    siteName: "Anand Yadav Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Anand Yadav | Full-Stack Software Engineer",
    description:
      "Backend-strong Full-Stack Software Engineer specializing in Spring Boot and React.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${caveat.variable} ${bricolage.variable}`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              'try{if(sessionStorage.getItem("intro-seen")||matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.dataset.intro="skip"}catch(e){}',
          }}
        />
      </head>
      <body
        className="antialiased"
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <ChatProvider>
            <Intro />
            <Navbar />
            <main className="pt-[var(--nav-height)]">{children}</main>
            <PortfolioChatDynamic />
          </ChatProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
