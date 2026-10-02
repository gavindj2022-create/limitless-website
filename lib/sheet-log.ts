import type { ConsultingLead } from "./validation";

type SheetLead = Pick<ConsultingLead, "source" | "name" | "email" | "phone" | "company" | "message" | "page">;

async function postToSheet(payload: Record<string, string>): Promise<boolean> {
  const url = process.env.LEADS_SHEET_URL;
  const secret = process.env.LEADS_SHEET_SECRET;
  if (!url || !secret) return false;
  try {
    const endpoint = new URL(url);
    if (endpoint.protocol !== "https:" || endpoint.hostname !== "script.google.com" || !endpoint.pathname.endsWith("/exec")) return false;
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ secret, ...payload }),
      cache: "no-store",
      signal: AbortSignal.timeout(3000),
    });
    if (!response.ok) return false;
    const result = await response.json().catch(() => null);
    return result?.ok === true;
  } catch {
    return false;
  }
}

export function logLeadToSheet(lead: SheetLead): Promise<boolean> {
  return postToSheet({
    kind: "lead",
    source: lead.source === "bella" ? "Bella mini audit" : "Website booking form",
    name: lead.name,
    email: lead.email,
    phone: lead.phone ?? "",
    business: lead.company ?? "",
    summary: lead.message,
    page: lead.page,
  });
}

const piiPattern = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}|(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\b(?:my name is|i am|i'm|call me|contact me at)\b|https?:\/\//i;

export function safeQuestionForLog(question: string): string | null {
  const clean = question.trim().replace(/\s+/g, " ").slice(0, 300);
  if (!clean || piiPattern.test(clean)) return null;
  return clean;
}

export function logQuestionToSheet(question: string, page: string, result: string, faqMatch: string | null): Promise<boolean> {
  const safe = safeQuestionForLog(question);
  if (!safe) return Promise.resolve(false);
  return postToSheet({ kind: "question", page, question: safe, result, faqMatch: faqMatch ?? "" });
}
