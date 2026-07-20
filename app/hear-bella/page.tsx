import type { Metadata } from "next";
import HearBella from "@/components/experience/HearBella";

// Private preview — must never be indexed or followed by crawlers, and is
// intentionally not linked from the nav, footer, or anywhere on the site.
export const metadata: Metadata = {
  title: "Hear Bella take a call",
  description: "Private preview of Bella handling an after-hours booking call.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

export default function HearBellaPage() {
  return <HearBella />;
}
