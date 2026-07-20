// Pure definition + scoring for the free "Leak Audit" lead-gen tool.
// Imported by the API route, the client component, and the unit test, so it
// must stay free of React / Next / server-only imports (mirror lib/quiz.ts).

import { z } from "zod";

export type ReplyTime = "instant" | "under1h" | "hours" | "nextday";
export type Grade = "A" | "B" | "C" | "D" | "F";

export interface LeakPreset {
  /** Stable key used for prefill + email summary. */
  key: string;
  /** Human label shown on the business-type chips. */
  name: string;
  missedCallsPerWeek: number;
  avgCustomerValue: number;
  replyTime: ReplyTime;
  hasAIReceptionist: boolean;
  hasOnlineBooking: boolean;
}

export interface LeakInput {
  missedCallsPerWeek: number;
  avgCustomerValue: number;
  replyTime: ReplyTime;
  hasAIReceptionist: boolean;
  hasOnlineBooking: boolean;
}

export interface LeakResult {
  /** Individual monthly-dollar leaks (rounded for display by the caller). */
  missedCallLeak: number;
  slowReplyLeak: number;
  afterHoursLeak: number;
  /** Sum of the three leaks, per month. */
  totalMonthly: number;
  totalYearly: number;
  /** 0–100 operational-health score (independent of ticket size). */
  score: number;
  grade: Grade;
}

// --- Defensible assumptions (all transparent, all documented here) ---
/** Bella's monthly price — used in copy anywhere the plan is mentioned. */
export const BELLA_MONTHLY = 199;
/** Share of missed callers who would have booked (industry ~30–40%). */
export const CLOSE_RATE = 0.35;
/** Business weeks per month (52 / 12). */
export const WEEKS_PER_MONTH = 4.3;
/** Share of customer demand that lands outside business hours. */
export const AFTER_HOURS_SHARE = 0.35;
/** How much a receptionist recovers of the missed-call leak (residual leaks). */
const RECEPTIONIST_RESIDUAL = 0.15;

/** Fraction of digital leads that go cold at each reply speed. */
const REPLY_LOSS: Record<ReplyTime, number> = {
  instant: 0.03,
  under1h: 0.12,
  hours: 0.3,
  nextday: 0.5,
};

export const REPLY_TIME_LABELS: Record<ReplyTime, string> = {
  instant: "Within minutes",
  under1h: "Within an hour",
  hours: "A few hours",
  nextday: "Next day or later",
};

export const PRESETS: LeakPreset[] = [
  { key: "salon", name: "Salon", missedCallsPerWeek: 8, avgCustomerValue: 150, replyTime: "hours", hasAIReceptionist: false, hasOnlineBooking: false },
  { key: "gym", name: "Gym", missedCallsPerWeek: 6, avgCustomerValue: 500, replyTime: "hours", hasAIReceptionist: false, hasOnlineBooking: false },
  { key: "realtor", name: "Realtor", missedCallsPerWeek: 5, avgCustomerValue: 8000, replyTime: "hours", hasAIReceptionist: false, hasOnlineBooking: false },
  { key: "airbnb", name: "Airbnb host", missedCallsPerWeek: 4, avgCustomerValue: 900, replyTime: "hours", hasAIReceptionist: false, hasOnlineBooking: true },
  { key: "contractor", name: "Contractor", missedCallsPerWeek: 10, avgCustomerValue: 2000, replyTime: "nextday", hasAIReceptionist: false, hasOnlineBooking: false },
  { key: "medspa", name: "Med-spa", missedCallsPerWeek: 7, avgCustomerValue: 600, replyTime: "hours", hasAIReceptionist: false, hasOnlineBooking: false },
];

/**
 * Compute the monthly revenue leak from the five inputs. The math is kept
 * transparent and independently defensible:
 *
 *  1. Missed calls never called back  = missed/mo × close-rate × ticket
 *     (a receptionist recovers most of it, so only a residual leaks).
 *  2. Leads gone cold from slow replies = digital-leads/mo × reply-loss × close × ticket
 *     (digital lead volume modelled at parity with missed calls).
 *  3. No after-hours booking           = digital-leads/mo × after-hours-share × close × ticket
 *     (fully captured if they have online booking OR an AI receptionist).
 */
export function computeLeak(input: LeakInput): LeakResult {
  const missedPerWeek = clampNum(input.missedCallsPerWeek, 0, 1000);
  const ticket = clampNum(input.avgCustomerValue, 0, 1_000_000);
  const replyLoss = REPLY_LOSS[input.replyTime] ?? REPLY_LOSS.hours;

  const monthlyMissed = missedPerWeek * WEEKS_PER_MONTH;
  // Model digital (web/text/DM) inbound volume at parity with missed calls.
  const monthlyDigitalLeads = monthlyMissed;

  const missedCallLeak =
    monthlyMissed *
    CLOSE_RATE *
    ticket *
    (input.hasAIReceptionist ? RECEPTIONIST_RESIDUAL : 1);

  const slowReplyLeak = monthlyDigitalLeads * replyLoss * CLOSE_RATE * ticket;

  const capturesAfterHours = input.hasOnlineBooking || input.hasAIReceptionist;
  const afterHoursLeak = capturesAfterHours
    ? 0
    : monthlyDigitalLeads * AFTER_HOURS_SHARE * CLOSE_RATE * ticket;

  const totalMonthly = missedCallLeak + slowReplyLeak + afterHoursLeak;

  return {
    missedCallLeak,
    slowReplyLeak,
    afterHoursLeak,
    totalMonthly,
    totalYearly: totalMonthly * 12,
    ...gradeFor(input),
  };
}

/**
 * Operational-health score, deliberately independent of ticket size so a
 * high-value business isn't auto-graded worse than a low-value one.
 */
export function gradeFor(input: LeakInput): { score: number; grade: Grade } {
  let score = 100;

  const callPenalty = Math.min(40, clampNum(input.missedCallsPerWeek, 0, 1000) * 3);
  score -= callPenalty * (input.hasAIReceptionist ? 0.2 : 1);

  const replyPenalty: Record<ReplyTime, number> = {
    instant: 0,
    under1h: 8,
    hours: 20,
    nextday: 32,
  };
  score -= replyPenalty[input.replyTime] ?? 20;

  if (!input.hasOnlineBooking) score -= 15;
  if (!input.hasAIReceptionist) score -= 10;

  score = Math.max(0, Math.min(100, Math.round(score)));

  const grade: Grade =
    score >= 85 ? "A" : score >= 70 ? "B" : score >= 55 ? "C" : score >= 40 ? "D" : "F";

  return { score, grade };
}

function clampNum(n: number, min: number, max: number): number {
  if (!Number.isFinite(n)) return min;
  return Math.max(min, Math.min(max, n));
}

/** Rounded USD, matching the ROI tool's formatter. */
export function usd(n: number): string {
  return "$" + Math.round(n).toLocaleString("en-US");
}

// --- Validation (mirrors lib/book-intake.ts so the route + tests share it) ---

export const auditLeadSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z.string().trim().email("Invalid email address").max(160),
  business: z.string().trim().max(160).optional(),
  phone: z.string().trim().max(40).optional(),
  vertical: z.string().trim().max(60).optional(),
  // Honeypot — real users never fill this.
  website: z.string().max(500).optional().default(""),
  missedCallsPerWeek: z.number().min(0).max(1000),
  avgCustomerValue: z.number().min(0).max(1_000_000),
  replyTime: z.enum(["instant", "under1h", "hours", "nextday"]),
  hasAIReceptionist: z.boolean(),
  hasOnlineBooking: z.boolean(),
});

export type AuditLead = z.infer<typeof auditLeadSchema>;

export function parseAuditLead(body: unknown) {
  return auditLeadSchema.safeParse(body);
}
