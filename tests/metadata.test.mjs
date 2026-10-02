import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const root = process.cwd();

test("root metadata and schema describe the consulting brand", () => {
  const layout = readFileSync(join(root, "app/layout.tsx"), "utf8");
  assert.match(layout, /Founder-led AI audits/);
  assert.match(layout, /"@type": "ProfessionalService"/);
  assert.match(layout, /"@type": "Person"/);
  assert.match(layout, /Gavin Johnson/);
  assert.match(layout, /Central Illinois/);
  assert.match(layout, /https:\/\/www\.linkedin\.com\/in\/gavin-johnson-lkdn\//);
});

test("sitemap includes public consulting routes and robots hides private APIs", () => {
  const sitemap = readFileSync(join(root, "app/sitemap.ts"), "utf8");
  for (const route of ["/how-we-help", "/work", "/about", "/faq", "/book", "/privacy-security"]) assert.match(sitemap, new RegExp(route));
  assert.doesNotMatch(sitemap, /hear-bella/);
  const robots = readFileSync(join(root, "app/robots.ts"), "utf8");
  assert.match(robots, /"\/api\/"/);
  assert.match(robots, /"\/hear-bella"/);
});

test("share assets remain present", () => {
  for (const filename of ["opengraph-image.png", "twitter-image.png", "icon.png", "apple-icon.png"]) {
    assert.equal(existsSync(join(root, "app", filename)), true, filename);
  }
});
