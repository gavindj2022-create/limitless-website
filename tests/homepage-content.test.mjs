import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import assert from "node:assert/strict";

const root = process.cwd();

function readPage() {
  return readFileSync(join(root, "app", "page.tsx"), "utf8");
}

test("hero leads with the current headline, badge, and Build My Agent CTA", () => {
  const page = readPage();

  // Hero headline "Less busywork. Limitless growth." (split across a <br />).
  assert.match(page, /Less busywork\./);
  assert.match(page, /Limitless growth\./);

  // Badge.
  assert.match(page, /AI Automation Company/);

  // Primary CTA text + href.
  assert.match(page, /Build My Agent/);
  assert.match(page, /href="\/build"/);

  // Old copy must be gone.
  assert.doesNotMatch(page, /Calls answered\. Website handled\./);
});

test("homepage has a mission band, How It Works, and the two core offers", () => {
  const page = readPage();

  // Mission band.
  assert.match(page, /mission-band/);
  assert.match(page, /We make AI/);

  // How It Works section.
  assert.match(page, /How It Works/);
  assert.match(page, /id="how-it-works"/);

  // The two offers: Bella receptionist + AI websites.
  assert.match(page, /Receptionist Agent/);
  assert.match(page, /Bella answers/);
  assert.match(page, /Agent-powered web presence/);
  assert.match(page, /id="bella"/);
  assert.match(page, /id="websites"/);
});

test("homepage shows pricing and routes CTAs to the booking intake", () => {
  const page = readPage();

  // Pricing section + tiers.
  assert.match(page, /id="pricing"/);
  assert.match(page, /Bella Receptionist/);
  assert.match(page, /Website Starter/);
  assert.match(page, /Full Presence/);

  // Booking CTAs (no auth-checkout dead ends).
  assert.match(page, /href="\/book\?service=bella"/);
  assert.match(page, /href="\/book\?service=website"/);
  assert.match(page, /href="\/book\?service=system"/);
  assert.match(page, /Book With Bella/);
  assert.match(page, /Build My Website/);
});

test("hero demo shows receptionist, website chatbot, and owner summary flows", () => {
  const demo = readFileSync(
    join(root, "components", "HeroDemoPanel.tsx"),
    "utf8"
  );

  assert.match(demo, /Bella answers/);
  assert.match(demo, /Website chat/);
  assert.match(demo, /Owner summary/);
});

test("booking intake page and backend route exist", () => {
  const page = readFileSync(join(root, "app", "book", "page.tsx"), "utf8");
  const form = readFileSync(
    join(root, "components", "LeadIntakeForm.tsx"),
    "utf8"
  );
  const route = readFileSync(
    join(root, "app", "api", "book", "route.ts"),
    "utf8"
  );

  assert.match(page, /LeadIntakeForm/);
  assert.match(form, /fetch\("\/api\/book"/);
  assert.match(route, /export async function POST/);
});
