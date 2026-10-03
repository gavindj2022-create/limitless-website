"use client";

import { useEffect, useState } from "react";
import { AnalyticsScripts } from "@/components/Analytics";

const KEY = "limitless-analytics-consent";
const hasTrackers = Boolean(process.env.NEXT_PUBLIC_GTM_ID || process.env.NEXT_PUBLIC_META_PIXEL_ID);

/**
 * GTM / Meta Pixel load only after the visitor says yes, as the privacy policy promises.
 * With no tracker IDs set, this renders nothing at all.
 */
export default function ConsentAnalytics() {
  const [choice, setChoice] = useState<"yes" | "no" | null | "unset">("unset");

  useEffect(() => {
    if (!hasTrackers) return;
    let saved: string | null = null;
    try { saved = localStorage.getItem(KEY); } catch { /* storage blocked */ }
    const timer = window.setTimeout(() => setChoice(saved === "yes" || saved === "no" ? saved : null), 0);
    return () => window.clearTimeout(timer);
  }, []);

  if (!hasTrackers || choice === "unset") return null;
  if (choice === "yes") return <AnalyticsScripts />;
  if (choice === "no") return null;

  const decide = (value: "yes" | "no") => {
    try { localStorage.setItem(KEY, value); } catch { /* storage blocked */ }
    setChoice(value);
  };

  return (
    <div role="region" aria-label="Cookie choice" style={{ position: "fixed", left: 16, bottom: "calc(16px + env(safe-area-inset-bottom))", zIndex: 1001, maxWidth: 360, padding: "16px 18px", borderRadius: 18, background: "#0B0B0A", color: "#fff", boxShadow: "0 20px 50px -20px rgba(0,0,0,.6)", fontSize: 14, lineHeight: 1.45 }}>
      <p style={{ margin: 0 }}>We use analytics cookies to see which pages help owners most. <a href="/privacy#cookies" style={{ color: "#f4d7bf" }}>Privacy policy</a></p>
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button type="button" onClick={() => decide("yes")} style={{ border: 0, borderRadius: 999, padding: "9px 16px", background: "#fff", color: "#0B0B0A", fontWeight: 650, cursor: "pointer", font: "inherit" }}>Accept</button>
        <button type="button" onClick={() => decide("no")} style={{ border: "1px solid rgba(255,255,255,.5)", borderRadius: 999, padding: "9px 16px", background: "transparent", color: "#fff", fontWeight: 600, cursor: "pointer", font: "inherit" }}>No thanks</button>
      </div>
    </div>
  );
}
