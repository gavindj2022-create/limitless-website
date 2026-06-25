import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import assert from "node:assert/strict";

const root = process.cwd();

test("homepage centers Bella and AI web presence as equal offers", () => {
  const page = readFileSync(join(root, "app", "page.tsx"), "utf8");

  assert.match(page, /Calls answered\. Website handled\./);
  assert.match(page, /Book With Bella/);
  assert.match(page, /Build My Website/);
  assert.match(page, /AI-powered web presence/);
  assert.match(page, /Add-on automation suite/);
  assert.doesNotMatch(page, /AI that runs your\s+\{?"?\s*back office/);
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

test("primary CTAs use the booking intake instead of auth checkout dead ends", () => {
  const page = readFileSync(join(root, "app", "page.tsx"), "utf8");
  const nav = readFileSync(join(root, "components", "Nav.tsx"), "utf8");
  const pricing = readFileSync(
    join(root, "components", "PricingCard.tsx"),
    "utf8"
  );

  assert.match(page, /href="\/book\?service=bella"/);
  assert.match(page, /href="\/book\?service=website"/);
  assert.match(page, /href="\/book\?service=system"/);
  assert.match(page, /Book With Bella/);
  assert.match(nav, /infinity-mark/);
  assert.doesNotMatch(nav, /M13 3L4 14h7l-1 7 9-11h-7l1-7z/);
  assert.match(pricing, /href\?: string/);
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
