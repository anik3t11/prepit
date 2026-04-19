import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PrepIt — Ace Every Interview",
  description:
    "The all-in-one AI-powered interview preparation platform. Practice coding, system design, behavioral, and role-specific questions. Get personalized feedback and track your progress.",
  keywords: [
    "interview preparation",
    "coding interview",
    "system design",
    "mock interview",
    "AI interview coach",
    "SDE prep",
    "data science interview",
    "cloud interview",
  ],
  openGraph: {
    title: "PrepIt — Ace Every Interview",
    description:
      "AI-powered interview prep platform for SDE, Data Science, Cloud, QA, BA, PM and more.",
    type: "website",
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
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
