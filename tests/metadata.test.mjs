import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import assert from "node:assert/strict";

const root = process.cwd();

test("root share metadata uses the simple Limitless brand", () => {
  const layout = readFileSync(join(root, "app", "layout.tsx"), "utf8");

  assert.match(layout, /title:\s*"limitless"/);
  assert.match(layout, /openGraph:\s*{[\s\S]*title:\s*"limitless"/);
  assert.match(layout, /twitter:\s*{[\s\S]*title:\s*"limitless"/);
  assert.doesNotMatch(layout, /Bella Receptionist Agent and Agent-Powered Websites/);
});

test("share preview and app icon assets exist", () => {
  [
    "opengraph-image.png",
    "twitter-image.png",
    "icon.png",
    "apple-icon.png",
  ].forEach((filename) => {
    assert.equal(existsSync(join(root, "app", filename)), true, filename);
  });
});
