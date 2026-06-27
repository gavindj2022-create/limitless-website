// Dev utility: render the email templates with sample data to temp HTML files
// so they can be eyeballed in a browser. Run: node scripts/preview-emails.mjs
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { scoreAnswers, QUESTIONS, labelFor } from "../lib/quiz.ts";
import {
  customerRecommendationEmail,
  leadNotificationEmail,
} from "../lib/email-templates.ts";
import { generateBuildPrompt } from "../lib/build-prompt.ts";

const answers = {
  industry: "salon",
  reach: "phone",
  callHandling: "missed",
  callsMissed: "10plus",
  website: "old",
  siteAction: "hard",
  booking: "phoneonly",
  followUp: "never",
  timeSink: "phones",
  goal: "calls",
  tools: "Square, Google Calendar",
  automateOne: "Answering the phone when I'm with a client",
  budget: "100-300",
};

const reco = scoreAnswers(answers);
const contact = {
  name: "Becky",
  business: "Studio B Hair Design",
  email: "becky@example.com",
  phone: "309-555-0142",
};
const bookUrl = "https://limitless-website.vercel.app/book?service=" + reco.serviceKey;
const qa = QUESTIONS.map((q) =>
  answers[q.id] ? { q: q.prompt, a: labelFor(q.id, answers[q.id]) } : null
).filter(Boolean);

const dir = tmpdir();
const customerPath = join(dir, "limitless-customer-email.html");
const leadPath = join(dir, "limitless-lead-email.html");
const buildPrompt = generateBuildPrompt({ contact, reco, qa });
writeFileSync(customerPath, customerRecommendationEmail({ contact, reco, bookUrl }));
writeFileSync(leadPath, leadNotificationEmail({ contact, reco, qa, bookUrl, buildPrompt }));
console.log("CUSTOMER " + customerPath);
console.log("LEAD " + leadPath);
