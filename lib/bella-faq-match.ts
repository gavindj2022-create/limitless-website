import { bellaExtraItems, faqItems } from "../content/faq.ts";

export const PRICE_ANSWER = "The audit is free. After it you get a written plan with a clear quote.";
export const NO_MATCH_ANSWER = "I'm not sure on that one. Want me to run a free mini audit, or should I pass it to Gavin?";
export const GREETING_ANSWER = "Hi! I'm Bella, the Limitless front desk agent. Ask me what we do, what it costs, or how the free audit works.";

export type BellaChip = { label: string; action: "ask" | "audit" | "book" | "call"; value?: string };
export type BellaReply = { reply: string; matchId: string | null; chips: BellaChip[] };

const words = (value: string) => value.toLowerCase().normalize("NFKC").replace(/['’]/g, "").replace(/[^a-z0-9]+/g, " ").trim();

const related: BellaChip[] = [
  { label: "Run my free mini audit", action: "audit" },
  { label: "Book a free audit", action: "book" },
];

const askChips: BellaChip[] = [
  { label: "What do you do?", action: "ask", value: "What do you do?" },
  { label: "How much does it cost?", action: "ask", value: "How much does it cost?" },
  { label: "Run my free mini audit", action: "audit" },
];

const PRICE = /\b(?:how much|price|prices|pricing|cost|costs|fee|fees|charge|charges|expensive|cheap|afford|budget|rates?)\b|\b(?:monthly|per month) (?:fee|cost|price|charge)\b|\bis (?:it|the audit|the call|this) free\b|\bfree (?:audit|consultation|call)\b/;
const GREETING = /^(?:hi|hey|hello|yo|hiya|good (?:morning|afternoon|evening)|sup|whats up)(?: there| bella)?$/;
const items = [...faqItems, ...bellaExtraItems];

export function matchBellaQuestion(message: string): BellaReply {
  const normalized = words(message.slice(0, 1000));
  const padded = ` ${normalized} `;
  if (!normalized) return { reply: GREETING_ANSWER, matchId: "greeting", chips: askChips };
  if (GREETING.test(normalized)) return { reply: GREETING_ANSWER, matchId: "greeting", chips: askChips };
  if (PRICE.test(normalized)) return { reply: PRICE_ANSWER, matchId: "cost", chips: related };

  let best: { id: string; answer: string; score: number } | null = null;
  for (const item of items) {
    if (item.id === "cost") continue;
    let score = 0;
    for (const keyword of item.keywords) {
      const term = words(keyword);
      if (term.length > 2 && padded.includes(` ${term} `)) score += term.includes(" ") ? 4 : 2;
    }
    if (normalized === words(item.question)) score += 10;
    if (score >= 2 && (!best || score > best.score)) best = { id: item.id, answer: item.answer, score };
  }
  if (best) return { reply: best.answer, matchId: best.id, chips: related };
  return { reply: NO_MATCH_ANSWER, matchId: null, chips: related };
}
