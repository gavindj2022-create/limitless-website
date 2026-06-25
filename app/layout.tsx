import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";
import "./globals.css";

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Limitless - Bella AI Receptionist and AI Websites",
  description:
    "Bella answers calls and captures leads while Limitless builds clean AI-powered websites with chatbots, booking paths, and simple automation.",
  openGraph: {
    title: "Limitless - Bella AI Receptionist and AI Websites",
    description:
      "AI receptionist service and clean web presence builds for local businesses that need to answer faster and look sharper.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={instrumentSans.variable}>
      <body>{children}</body>
    </html>
  );
}
