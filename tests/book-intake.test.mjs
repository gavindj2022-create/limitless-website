import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseBookLead } from "../lib/book-intake.ts";

const root = dirname(dirname(fileURLToPath(import.meta.url)));

const screenshotPayload = {
  service: "website",
  name: "Gavin D Johnson",
  email: "gavindj2022@gmail.com",
  phone: "3093402657",
  business: "test 2",
  message: "website",
  website: "",
};

function fieldErrors(parsed) {
  return parsed.success ? "" : JSON.stringify(parsed.error.flatten().fieldErrors);
}

test("book intake accepts the short request shown in the screenshot", () => {
  const parsed = parseBookLead(screenshotPayload);

  assert.equal(parsed.success, true, fieldErrors(parsed));
  assert.equal(parsed.data.message, "website");
});

test("book intake lets the route silently ignore honeypot submissions", () => {
  const parsed = parseBookLead({
    ...screenshotPayload,
    website: "https://spam.example",
  });

  assert.equal(parsed.success, true, fieldErrors(parsed));
});

test("book intake still rejects missing visible required fields", () => {
  const parsed = parseBookLead({
    service: "website",
    name: "",
    email: "",
    message: "",
    website: "",
  });

  assert.equal(parsed.success, false);
  assert.ok(parsed.error.flatten().fieldErrors.name);
  assert.ok(parsed.error.flatten().fieldErrors.email);
  assert.ok(parsed.error.flatten().fieldErrors.message);
});

test("book route validates before spending the strict contact rate limit", () => {
  const route = readFileSync(join(root, "app", "api", "book", "route.ts"), "utf8");
  const validationIndex = route.indexOf("const parsed = parseBookLead(body);");
  const rateLimitIndex = route.indexOf("rateLimit.check(");

  assert.ok(validationIndex > -1);
  assert.ok(rateLimitIndex > -1);
  assert.ok(validationIndex < rateLimitIndex);
});
