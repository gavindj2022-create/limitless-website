import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const config = readFileSync(join(process.cwd(), "next.config.ts"), "utf8");

test("retired product and demo routes are permanent redirects", () => {
  for (const route of ["/build", "/leak-audit", "/dashboard/:path*", "/signin", "/sign-in", "/checkout", "/api/checkout", "/api/billing-portal", "/api/auth/:path*", "/demos"]) {
    assert.match(config, new RegExp(`source: "${route.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"[\\s\\S]{0,80}permanent: true`), route);
  }
});

test("security headers and immutable consulting media cache are configured", () => {
  for (const header of ["Content-Security-Policy", "X-Frame-Options", "X-Content-Type-Options", "Referrer-Policy", "Strict-Transport-Security", "Permissions-Policy"]) {
    assert.match(config, new RegExp(header));
  }
  // 'unsafe-eval' is allowed only for the local dev server (React dev tooling), never in production.
  assert.equal((config.match(/unsafe-eval/g) || []).length, 1);
  assert.match(config, /process\.env\.NODE_ENV === "development" \? " 'unsafe-eval'" : ""/);
  assert.match(config, /source: "\/consulting\/:path\*"[\s\S]*headers: immutableCache/);
});
