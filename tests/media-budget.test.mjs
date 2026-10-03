import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const root = process.cwd();
const bytes = (path) => statSync(join(root, path)).size;

test("founder hero cutout stays lightweight", () => {
  assert.ok(bytes("public/consulting/gav-founder-city.webp") <= 200_000);
  assert.ok(bytes("public/consulting/hero-city-bg.webp") <= 250_000);
});

test("replacement page banners stay lightweight", () => {
  assert.ok(bytes("public/consulting/work-banner-team-v2.webp") <= 150_000);
  assert.ok(bytes("public/consulting/book-banner-planning-table-v2.webp") <= 150_000);
});

test("Chapter keeps poster-first, idle video and reduced-motion behavior", () => {
  const chapter = readFileSync(join(root, "components/experience/Chapter.tsx"), "utf8");
  assert.match(chapter, /preload=\{eager \? "none" : "auto"\}/);
  assert.match(chapter, /requestIdleCallback/);
  assert.match(chapter, /rootMargin: "50% 0px 50% 0px"/);
  assert.match(chapter, /reduced \? \(/);
  assert.match(chapter, /video\.pause\(\)/);
  assert.match(chapter, /removeAttribute\("src"\)/);
  assert.match(chapter, /type="video\/webm"/);
  assert.doesNotMatch(chapter, /av01/);
});
