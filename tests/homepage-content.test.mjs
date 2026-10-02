import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const root = process.cwd();
const read = (path) => readFileSync(join(root, path), "utf8");

test("home uses the founder hero and keeps the locked short site map", () => {
  const home = read("app/page.tsx");
  assert.match(home, /src="\/consulting\/gav-founder-city\.webp"/);
  assert.match(home, /alt="Gavin Johnson, founder of Limitless"/);
  assert.match(home, /styles\.founderHero/);
  assert.doesNotMatch(home, /hero-counter-loop/);
  assert.match(home, /<DotCloud \/>/);
  assert.match(home, /We make AI easy\./);
  assert.match(home, /We find the busywork, build agents to handle it, and teach your team to run them\./);
  assert.match(home, /Where are you with AI\?/);
  assert.match(home, /film="\/media\/dawn"/);
  assert.match(home, /Wake up ahead\./);
  assert.doesNotMatch(home, /gavin-client-hero|owner-audit|owner-salon|owner-contractor/);
  assert.doesNotMatch(home, /pricing|id="faq"|id="about"/i);
});

test("work and book use only the approved replacement banners", () => {
  const work = read("app/work/page.tsx");
  const book = read("app/book/page.tsx");
  assert.match(work, /work-banner-team\.webp/);
  assert.match(work, /Built for owners like these\./);
  assert.doesNotMatch(work, /owner-audit|owner-salon|owner-contractor/);
  assert.match(book, /book-banner-planning-table\.webp/);
  assert.match(book, /30-minute call\. Written plan in 3 business days\. No pressure\./);
  assert.match(book, /ConsultingLeadForm/);
});

test("the locked pages and global Bella mount exist", () => {
  for (const path of ["how-we-help", "work", "about", "faq", "book", "privacy-security"]) {
    assert.match(read(`app/${path}/page.tsx`), /<Nav \/>/, `${path} must use the shared nav`);
  }
  assert.match(read("app/layout.tsx"), /<BellaChat \/>/);
  assert.match(read("app/about/page.tsx"), /CountUpValue/);
  assert.match(read("app/faq/page.tsx"), /faqItems\.map/);
});

test("retired product prices and checkout language are absent from consulting surfaces", () => {
  const files = [
    "app/page.tsx",
    "app/how-we-help/page.tsx",
    "app/work/page.tsx",
    "app/about/page.tsx",
    "app/faq/page.tsx",
    "app/book/page.tsx",
    "components/BellaChat.tsx",
    "content/faq.ts",
    "lib/email-templates.ts",
  ];
  const source = files.map(read).join("\n");
  assert.doesNotMatch(source, /\$(?:29|199|499)\b/);
  assert.doesNotMatch(source, /Stripe|checkout|pricing tier/i);
  assert.match(read("app/about/page.tsx"), /\$" \/><span>Our own rental business in 2025/);
});

test("social links hide the unverified Facebook slug", () => {
  const socialConfig = read("content/socials.ts");
  assert.match(socialConfig, /name: "Facebook", href: ""/);
  assert.match(read("components/SocialLinks.tsx"), /filter\(\(social\) => social\.href\)/);
});
