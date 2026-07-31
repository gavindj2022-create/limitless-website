import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import assert from "node:assert/strict";

const root = process.cwd();

function readPage() {
  return readFileSync(join(root, "app", "page.tsx"), "utf8");
}

function readLedger() {
  return readFileSync(
    join(root, "components", "experience", "Ledger.tsx"),
    "utf8"
  );
}

test("hero leads with the current headline, badge, and Build My Agent CTA", () => {
  const page = readPage();

  // Hero headline "Less busywork. Limitless growth." (split across a <br />).
  assert.match(page, /Less busywork\./);
  assert.match(page, /Limitless growth\./);

  // Badge.
  assert.match(page, /Agent Automation Company/);

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
  assert.match(page, /Your business, made <em>limitless<\/em>\./);

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

test("homepage shows the risk-reversal line and the ROI hook to /roi", () => {
  const page = readPage();

  // Risk-reversal micro-copy appears under the hero CTA and near pricing.
  const matches = page.match(/No contracts\. Cancel anytime\./g) || [];
  assert.ok(
    matches.length >= 2,
    "expected the reassurance line under the hero and near pricing"
  );

  // ROI hook links to the existing /roi calculator without an inline widget.
  assert.match(page, /See what missed calls cost you/);
  assert.match(page, /href="\/roi"/);
});

test("private Hear Bella page exists and is set to noindex, nofollow", () => {
  const page = readFileSync(
    join(root, "app", "hear-bella", "page.tsx"),
    "utf8"
  );

  assert.match(page, /Hear Bella take a call/);
  assert.match(page, /robots/);
  assert.match(page, /index:\s*false/);
  assert.match(page, /follow:\s*false/);
});

test("homepage avoids unconfirmed customer proof and has no About section", () => {
  const page = readPage();
  const ledger = readLedger();

  assert.match(ledger, /service business on the Bella plan/);
  assert.doesNotMatch(ledger, /salon on the Bella plan/i);

  assert.doesNotMatch(page, /Becky Thompson/);
  assert.doesNotMatch(page, /Salon owner - Peoria, IL/);
  assert.match(page, /Every missed call becomes a handled lead/);

  // The About/team section was removed deliberately (compact, minimal page).
  assert.match(page, /id="faq"/);
  assert.doesNotMatch(page, /id="about"/);
  assert.doesNotMatch(page, /TeamCard/);
  assert.doesNotMatch(page, /Gavin Johnson/);
});
