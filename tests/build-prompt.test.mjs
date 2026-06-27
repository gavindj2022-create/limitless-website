import test from "node:test";
import assert from "node:assert/strict";

import { generateBuildPrompt } from "../lib/build-prompt.ts";
import { scoreAnswers } from "../lib/quiz.ts";

test("generateBuildPrompt produces a complete, client-specific build order", () => {
  // A realistic set of quiz answers (keys match QUESTIONS ids in lib/quiz.ts).
  const sampleAnswers = {
    industry: "salon",
    reach: "phone",
    callHandling: "missed",
    callsMissed: "6-10",
    website: "old",
    siteAction: "hard",
    booking: "phoneonly",
    followUp: "never",
    timeSink: "phones",
    goal: "calls",
    tools: "Square, Google Calendar",
    automateOne: "Answering the phone",
    budget: "300-600",
  };

  const reco = scoreAnswers(sampleAnswers);

  const qa = [
    { q: "How do most of your customers reach you today?", a: "Phone calls" },
    { q: "When a call comes in and you're busy, what usually happens?", a: "Honestly, we miss it" },
    { q: "What's your website situation right now?", a: "Old and outdated" },
  ];

  const contact = {
    name: "Becky",
    business: "Studio B Hair Design",
    email: "b@x.com",
    phone: "309-555-0142",
  };

  const prompt = generateBuildPrompt({ contact, reco, qa });

  assert.equal(typeof prompt, "string");
  assert.match(prompt, /ROLE/);
  assert.match(prompt, /DELIVERABLES/);
  assert.match(prompt, /DEFINITION OF DONE/);
  assert.match(prompt, /Studio B Hair Design/);

  // Contact + a recommended module should also flow through.
  assert.match(prompt, /Becky/);
  assert.match(prompt, /b@x\.com/);
});
