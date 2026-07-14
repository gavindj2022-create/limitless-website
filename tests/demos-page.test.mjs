import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import assert from "node:assert/strict";

const root = process.cwd();

function read(relativePath) {
  return readFileSync(join(root, relativePath), "utf8");
}

test("demos page points to the branded Limitless demo domain", () => {
  const page = read(join("app", "demos", "page.tsx"));

  assert.match(page, /https:\/\/limitless-demo-websites\.pages\.dev\//);
  assert.doesNotMatch(page, /fable25-9qg\.pages\.dev/);
  assert.match(page, /View all 25/);
  assert.match(page, /Limitless Demo Websites/);
  assert.match(page, /created with AI by Limitless/);
});

test("demo cards use Limitless AI-build language instead of how-to language", () => {
  const card = read(join("components", "DemoCard.tsx"));

  assert.match(card, /Built with AI/);
  assert.match(card, /Open demo/);
  assert.doesNotMatch(card, /How it was built/);
  assert.doesNotMatch(card, /Fable-25/);
});
