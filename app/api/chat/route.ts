import { NextResponse } from "next/server";
import { matchBellaQuestion } from "@/lib/bella-faq-match";
import { auditQuestions, nextAuditField, renderSelectedSolutions, scriptedAuditSummary } from "@/lib/bella-audit";
import type { AuditAnswers } from "@/lib/bella-audit";
import { bellaAuditData, bellaSystemPrompt, normalizeBellaHistory } from "@/lib/bella-prompt";
import { getClientIp, isSameOrigin, readLimitedJson } from "@/lib/request-guards";
import { canUseBellaAi, rateLimit, rateLimitConfigs } from "@/lib/rate-limit";
import { logQuestionToSheet } from "@/lib/sheet-log";
import { bellaRequestSchema } from "@/lib/validation";

const json = (body: Record<string, unknown>, status = 200) =>
  NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });

const auditChips = [
  { label: "Book a free audit", action: "book" },
  { label: "Call our Front Desk Agent", action: "call" },
];

async function suggestWithAnthropic(answers: AuditAnswers, page: string): Promise<string | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;
  try {
    const { default: Anthropic } = await import("@anthropic-ai/sdk");
    const client = new Anthropic({ apiKey, maxRetries: 0, timeout: 8000 });
    const result = await client.messages.create({
      model: process.env.BELLA_MODEL || "claude-haiku-4-5-20251001",
      max_tokens: 4000,
      system: bellaSystemPrompt(page),
      messages: [{ role: "user", content: bellaAuditData(answers) }],
    });
    if (result.stop_reason === "refusal") return null;
    const text = result.content.filter((block) => block.type === "text").map((block) => block.text).join("");
    const parsed: unknown = JSON.parse(text);
    if (!parsed || typeof parsed !== "object" || !("services" in parsed) || !Array.isArray(parsed.services)) return null;
    return renderSelectedSolutions(parsed.services.filter((service): service is string => typeof service === "string"));
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return json({ error: "Request not allowed." }, 403);
  const body = await readLimitedJson(request);
  if (!body.ok) return json({ error: body.status === 413 ? "Request too large." : "Invalid request." }, body.status);
  const parsed = bellaRequestSchema.safeParse(body.value);
  if (!parsed.success) return json({ error: "Invalid request." }, 400);

  const ip = getClientIp(request);
  if (!rateLimit.check(`bella:${ip}`, rateLimitConfigs.bella).success) {
    return json({ error: "Too many questions. Please try later." }, 429);
  }

  const input = parsed.data;
  normalizeBellaHistory(input.history);
  if (input.action === "ask") {
    const match = matchBellaQuestion(input.message);
    await logQuestionToSheet(input.message, input.page, match.matchId ? "FAQ answer" : "No match", match.matchId);
    return json({ mode: "faq", ...match });
  }

  const missing = nextAuditField(input.answers);
  if (missing) {
    return json({ mode: "audit", complete: false, field: missing, reply: auditQuestions[missing] });
  }
  const answers = input.answers as AuditAnswers;
  const fallback = scriptedAuditSummary(answers);
  let reply = fallback;
  let mode = "scripted";

  // The model is never called for default FAQ questions or incomplete audits.
  if (process.env.ANTHROPIC_API_KEY) {
    const daily = rateLimit.check(`bella-ai-day:${ip}`, rateLimitConfigs.bellaDaily).success;
    const session = rateLimit.check(`bella-ai-session:${input.sessionId}`, rateLimitConfigs.bellaSession).success;
    const budgetReserved = daily && session && rateLimit.reserveBellaBudget(Number(process.env.BELLA_DAILY_MAX));
    if (canUseBellaAi({ dailyAllowed: daily, sessionAllowed: session, budgetReserved })) {
      const suggested = await suggestWithAnthropic(answers, input.page);
      if (suggested) {
        reply = suggested;
        mode = "ai";
      }
    }
  }
  return json({ mode, complete: true, reply, chips: auditChips });
}
