import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme-provider";
import { Navbar } from "@/components/layout/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
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
    url: "https://anandyadav.dev", // Update with your domain
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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
