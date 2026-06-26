import test from "node:test";
import assert from "node:assert/strict";
import { scoreAnswers, QUESTIONS } from "../lib/quiz.ts";

test("question set is 10-15 questions with valid shapes", () => {
  assert.ok(QUESTIONS.length >= 10 && QUESTIONS.length <= 15);
  for (const q of QUESTIONS) {
    assert.ok(q.id && q.prompt && (q.type === "single" || q.type === "text"));
    if (q.type === "single") assert.ok(Array.isArray(q.options) && q.options.length >= 2);
  }
});

test("phone-heavy, missed-calls answers recommend Bella", () => {
  const reco = scoreAnswers({
    reach: "phone",
    callHandling: "missed",
    callsMissed: "10plus",
    website: "modern",
    siteAction: "easy",
    booking: "tool",
    followUp: "automated",
    timeSink: "phones",
    goal: "calls",
  });
  assert.equal(reco.serviceKey, "bella");
  assert.ok(reco.scores.bella > reco.scores.website);
  assert.ok(reco.modules.some((m) => /Bella/i.test(m.name)));
});

test("no-website answers recommend Website", () => {
  const reco = scoreAnswers({
    reach: "website",
    website: "none",
    siteAction: "nosite",
    goal: "professional",
    timeSink: "marketing",
    callHandling: "staff",
    callsMissed: "0-2",
    booking: "tool",
    followUp: "automated",
  });
  assert.equal(reco.serviceKey, "website");
  assert.ok(reco.modules.some((m) => /website/i.test(m.name)));
});

test("multiple pain areas recommend the full System", () => {
  const reco = scoreAnswers({
    callHandling: "missed",
    callsMissed: "6-10",
    followUp: "never",
    timeSink: "admin",
    website: "okay",
  });
  assert.equal(reco.serviceKey, "system");
  // full system surfaces more than one build module
  assert.ok(reco.modules.length >= 3);
});

test("no answers falls back to a system consult without throwing", () => {
  const reco = scoreAnswers({});
  assert.equal(reco.serviceKey, "system");
  assert.ok(reco.title && reco.summary && reco.modules.length > 0);
});
