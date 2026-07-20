import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  PRESETS,
  computeLeak,
  gradeFor,
  parseAuditLead,
  usd,
  BELLA_MONTHLY,
} from "../lib/leak-audit.ts";

const root = dirname(dirname(fileURLToPath(import.meta.url)));

// --- Scoring math ---------------------------------------------------------

test("every preset produces a positive, well-formed leak result", () => {
  assert.equal(PRESETS.length, 6);
  const names = PRESETS.map((p) => p.name);
  for (const want of ["Salon", "Gym", "Realtor", "Airbnb host", "Contractor", "Med-spa"]) {
    assert.ok(names.includes(want), `missing preset ${want}`);
  }
  for (const p of PRESETS) {
    const r = computeLeak(p);
    assert.ok(r.totalMonthly > 0, `${p.name} should leak something`);
    assert.ok(r.totalYearly === r.totalMonthly * 12);
    assert.ok(["A", "B", "C", "D", "F"].includes(r.grade));
    assert.ok(r.score >= 0 && r.score <= 100);
    // Total is the sum of the three visible line items.
    const sum = r.missedCallLeak + r.slowReplyLeak + r.afterHoursLeak;
    assert.ok(Math.abs(sum - r.totalMonthly) < 1e-6);
  }
});

test("salon defaults compute the documented, defensible numbers", () => {
  const salon = PRESETS.find((p) => p.name === "Salon");
  const r = computeLeak(salon);
  // 8/wk × 4.3 = 34.4 missed/mo. Close 35%, ticket $150.
  assert.equal(Math.round(r.missedCallLeak), 1806); // 34.4 × 0.35 × 150
  assert.equal(Math.round(r.slowReplyLeak), 542); // 34.4 × 0.30 × 0.35 × 150
  assert.equal(Math.round(r.afterHoursLeak), 632); // 34.4 × 0.35 × 0.35 × 150
  assert.equal(Math.round(r.totalMonthly), 2980);
  assert.equal(r.grade, "F");
});

test("an AI receptionist sharply reduces the missed-call leak", () => {
  const base = { missedCallsPerWeek: 10, avgCustomerValue: 500, replyTime: "hours" };
  const without = computeLeak({ ...base, hasAIReceptionist: false, hasOnlineBooking: false });
  const withAI = computeLeak({ ...base, hasAIReceptionist: true, hasOnlineBooking: false });
  assert.ok(withAI.missedCallLeak < without.missedCallLeak);
  // Residual is 15% of the un-covered leak.
  assert.ok(Math.abs(withAI.missedCallLeak - without.missedCallLeak * 0.15) < 1e-6);
});

test("online booking OR a receptionist eliminates the after-hours leak", () => {
  const base = { missedCallsPerWeek: 6, avgCustomerValue: 800, replyTime: "hours", hasAIReceptionist: false };
  assert.ok(computeLeak({ ...base, hasOnlineBooking: false }).afterHoursLeak > 0);
  assert.equal(computeLeak({ ...base, hasOnlineBooking: true }).afterHoursLeak, 0);
  assert.equal(
    computeLeak({ ...base, hasOnlineBooking: false, hasAIReceptionist: true }).afterHoursLeak,
    0
  );
});

test("a fully-covered business scores an A with zero leak", () => {
  const r = computeLeak({
    missedCallsPerWeek: 0,
    avgCustomerValue: 500,
    replyTime: "instant",
    hasAIReceptionist: true,
    hasOnlineBooking: true,
  });
  assert.equal(r.totalMonthly, 0);
  assert.equal(r.grade, "A");
  assert.equal(r.score, 100);
});

test("grade is independent of ticket size (same inputs, different value)", () => {
  const a = gradeFor({ missedCallsPerWeek: 10, avgCustomerValue: 100, replyTime: "nextday", hasAIReceptionist: false, hasOnlineBooking: false });
  const b = gradeFor({ missedCallsPerWeek: 10, avgCustomerValue: 9000, replyTime: "nextday", hasAIReceptionist: false, hasOnlineBooking: false });
  assert.equal(a.grade, b.grade);
  assert.equal(a.score, b.score);
});

// --- Validation -----------------------------------------------------------

const validPayload = {
  name: "Gav Johnson",
  email: "gavindj2022@gmail.com",
  business: "Test Salon",
  phone: "3093402657",
  vertical: "Salon",
  website: "",
  missedCallsPerWeek: 8,
  avgCustomerValue: 150,
  replyTime: "hours",
  hasAIReceptionist: false,
  hasOnlineBooking: false,
};

test("audit schema accepts a valid payload", () => {
  const parsed = parseAuditLead(validPayload);
  assert.equal(parsed.success, true, parsed.success ? "" : JSON.stringify(parsed.error.flatten().fieldErrors));
});

test("audit schema rejects missing name/email and bad reply enum", () => {
  const bad = parseAuditLead({ ...validPayload, name: "", email: "nope", replyTime: "someday" });
  assert.equal(bad.success, false);
  const errs = bad.error.flatten().fieldErrors;
  assert.ok(errs.name && errs.email && errs.replyTime);
});

test("audit schema lets honeypot submissions through for the route to drop", () => {
  const parsed = parseAuditLead({ ...validPayload, website: "https://spam.example" });
  assert.equal(parsed.success, true);
});

test("usd rounds and Bella price is $199", () => {
  assert.equal(usd(2979.9), "$2,980");
  assert.equal(BELLA_MONTHLY, 199);
});

// --- Page + route + wire-in wiring ----------------------------------------

test("leak-audit page has the required headline, eyebrow, and reassurance copy", () => {
  const page = readFileSync(join(root, "app", "leak-audit", "page.tsx"), "utf8");
  assert.match(page, /How much money is your business leaking\?/);
  assert.match(page, /Free 60-second audit/);
  assert.match(page, /No spam — one report, one follow-up\./);
  assert.match(page, /Get my free fix plan/);
  assert.match(page, /href="\/book\?service=bella"/);
  assert.match(page, /Your business is leaking/);
});

test("audit route validates before spending the strict contact rate limit", () => {
  const route = readFileSync(join(root, "app", "api", "audit-lead", "route.ts"), "utf8");
  const validationIndex = route.indexOf("parseAuditLead(body)");
  const rateLimitIndex = route.indexOf("rateLimit.check(");
  assert.ok(validationIndex > -1);
  assert.ok(rateLimitIndex > -1);
  assert.ok(validationIndex < rateLimitIndex);
  // Honeypot short-circuit + best-effort dual path.
  assert.match(route, /if \(website\)/);
  assert.match(route, /if \(!saved && !emailedOwner\)/);
});

test("leak audit is wired into the nav and homepage, and quiz fallback URL is fixed", () => {
  const nav = readFileSync(join(root, "components", "Nav.tsx"), "utf8");
  assert.match(nav, /href: "\/leak-audit"/);

  const home = readFileSync(join(root, "app", "page.tsx"), "utf8");
  assert.match(home, /Free 60-second leak audit/);
  assert.match(home, /href="\/leak-audit"/);

  const quiz = readFileSync(join(root, "app", "api", "quiz-lead", "route.ts"), "utf8");
  assert.match(quiz, /golimitlessagi\.com/);
  assert.doesNotMatch(quiz, /limitless-website\.vercel\.app/);
});
