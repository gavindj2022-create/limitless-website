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
  metadataBase: new URL("https://golimitlessagi.com"),
  title: "limitless",
  description:
    "Practical AI agents and clean websites for service businesses.",
  openGraph: {
    title: "limitless",
    description:
      "Practical AI agents and clean websites for service businesses.",
    url: "/",
    siteName: "limitless",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Limitless logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "limitless",
    description:
      "Practical AI agents and clean websites for service businesses.",
    images: ["/twitter-image.png"],
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
