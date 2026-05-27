import type { Metadata } from "next";
import { Inter, Inter_Tight, Instrument_Serif } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  display: "swap",
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Limitless — AI that runs your back office",
  description:
    "Olivia is your AI employee. She sends invoices, answers calls, books appointments, and follows up with customers — starting at $29/month. Built by DAWGS AGI.",
  openGraph: {
    title: "Limitless — AI that runs your back office",
    description:
      "AI-powered automation for small businesses. Invoices, receptionist, marketing, bookkeeping — all handled.",
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
      className={`${inter.variable} ${interTight.variable} ${instrumentSerif.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
