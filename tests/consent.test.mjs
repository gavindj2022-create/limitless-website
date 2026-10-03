import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("GTM and Meta Pixel load only through the consent gate", () => {
  const layout = readFileSync("app/layout.tsx", "utf8");
  const gate = readFileSync("components/ConsentAnalytics.tsx", "utf8");
  assert.doesNotMatch(layout, /<AnalyticsScripts|<AnalyticsNoScript/);
  assert.match(layout, /<ConsentAnalytics \/>/);
  assert.match(gate, /choice === "yes"\) return <AnalyticsScripts \/>/);
});
