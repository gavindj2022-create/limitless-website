import { readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import assert from "node:assert/strict";

const root = process.cwd();
const FILMS = ["threads", "dawn", "night", "leak"];

// The homepage once shipped 11.5 MB of video across four full-viewport films,
// which is what made the site feel laggy. These budgets exist so a future
// re-export cannot quietly put it back.
const WEBM_MAX = 600_000;
const MP4_MAX = 800_000;
const POSTER_MAX = 90_000;

test("chapter films stay inside their byte budget", () => {
  for (const film of FILMS) {
    const webm = statSync(join(root, "public", "media", `${film}.webm`)).size;
    const mp4 = statSync(join(root, "public", "media", `${film}-slim.mp4`)).size;
    assert.ok(webm < WEBM_MAX, `${film}.webm is ${webm} bytes (max ${WEBM_MAX})`);
    assert.ok(mp4 < MP4_MAX, `${film}-slim.mp4 is ${mp4} bytes (max ${MP4_MAX})`);
  }
});

test("chapter posters stay inside their byte budget", () => {
  for (const film of FILMS) {
    const size = statSync(
      join(root, "public", "media", `${film}-poster-v2.jpg`)
    ).size;
    assert.ok(size < POSTER_MAX, `${film} poster is ${size} bytes`);
  }
});

test("Chapter keeps AV1 + H.264 sources and lazy mounting", () => {
  const chapter = readFileSync(
    join(root, "components", "experience", "Chapter.tsx"),
    "utf8"
  );
  assert.match(chapter, /video\/webm/, "AV1/WebM source missing");
  assert.match(chapter, /video\/mp4/, "H.264 fallback missing");
  assert.match(chapter, /rootMargin/, "lazy mount observer missing");
  assert.match(chapter, /removeAttribute\("src"\)/, "decoder release missing");
});

test("homepage and demos render as server components", () => {
  for (const page of [
    join(root, "app", "page.tsx"),
    join(root, "app", "demos", "page.tsx"),
  ]) {
    const src = readFileSync(page, "utf8");
    assert.doesNotMatch(
      src,
      /^"use client"/m,
      `${page} should stay a server component (it has no hooks or handlers)`
    );
  }
});
