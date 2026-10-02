import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";
import "./globals.css";
import { AnalyticsScripts, AnalyticsNoScript } from "@/components/Analytics";
import BellaChat from "@/components/BellaChat";
import { Analytics as VercelAnalytics } from "@vercel/analytics/next";

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://golimitlessagi.com"),
  title: "Limitless | Agentic solutions made easy",
  description:
    "Founder-led AI audits, done-for-you agentic solutions, and one-on-one training for small-business owners.",
  openGraph: {
    title: "Limitless | Agentic solutions made easy",
    description:
      "Founder-led AI audits, done-for-you agentic solutions, and one-on-one training for small-business owners.",
    url: "/",
    siteName: "Limitless",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Limitless: We make AI easy. Gavin Johnson, founder.",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Limitless | Agentic solutions made easy",
    description:
      "Founder-led AI audits, done-for-you agentic solutions, and one-on-one training for small-business owners.",
    images: ["/twitter-image.png"],
  },
};

const businessSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": "https://golimitlessagi.com/#business",
      name: "Limitless",
      url: "https://golimitlessagi.com",
      email: "limitlessgav@gmail.com",
      telephone: "+1-312-313-1478",
      founder: { "@id": "https://golimitlessagi.com/#gavin-johnson" },
      areaServed: [
        { "@type": "AdministrativeArea", name: "Central Illinois" },
        { "@type": "City", name: "Peoria, Illinois" },
        { "@type": "City", name: "Metamora, Illinois" },
        { "@type": "City", name: "Eureka, Illinois" },
        { "@type": "VirtualLocation", name: "Online" },
      ],
    },
    {
      "@type": "Person",
      "@id": "https://golimitlessagi.com/#gavin-johnson",
      name: "Gavin Johnson",
      jobTitle: "Founder",
      worksFor: { "@id": "https://golimitlessagi.com/#business" },
      sameAs: ["https://www.linkedin.com/in/gavin-johnson-lkdn/"],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={instrumentSans.variable}>
      <body>
        <AnalyticsNoScript />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema).replace(/</g, "\\u003c") }}
        />
        {children}
        <BellaChat />
        <VercelAnalytics />
        <AnalyticsScripts />
      </body>
    </html>
  );
}
