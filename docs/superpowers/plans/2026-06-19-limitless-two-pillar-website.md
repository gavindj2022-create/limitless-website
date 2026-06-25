# Limitless Two-Pillar Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the homepage so Bella AI Receptionist and fast AI-powered web presence are the two equal primary offers.

**Architecture:** Keep the existing Next.js App Router structure and reuse existing components where possible. Update the homepage content, rotating demo, and CSS so the site is cleaner, more visual, and easier for business owners to understand. Add a lightweight content smoke test to lock in the new positioning.

**Tech Stack:** Next.js 16, React 19, TypeScript, GSAP, ESLint flat config, Node built-in test runner for content smoke checks.

---

## File Structure

- Modify `app/page.tsx`: replace the homepage hierarchy and copy with the two-pillar Bella + web presence direction.
- Modify `components/HeroDemoPanel.tsx`: update the rotating demo scenarios to show Bella answering, website chatbot, and owner summary states.
- Modify `app/globals.css`: add/adjust styles for two-pillar hero cards, visual explainer flow, compact add-on tiles, and mobile responsiveness.
- Modify `components/Nav.tsx`: align navigation labels and CTA with the new positioning.
- Modify `app/layout.tsx`: update metadata to match the new homepage message.
- Modify `.gitignore`: ignore generated local agent/dev artifacts.
- Create `tests/homepage-content.test.mjs`: smoke-test the important homepage positioning strings.

---

### Task 1: Content Smoke Test

**Files:**
- Create: `tests/homepage-content.test.mjs`

- [ ] **Step 1: Write the failing test**

```js
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import assert from "node:assert/strict";

const root = process.cwd();

test("homepage centers Bella and AI web presence as equal offers", () => {
  const page = readFileSync(join(root, "app", "page.tsx"), "utf8");

  assert.match(page, /Calls answered\. Website handled\./);
  assert.match(page, /Meet Bella/);
  assert.match(page, /See Websites/);
  assert.match(page, /AI-powered web presence/);
  assert.match(page, /Add-on automation suite/);
  assert.doesNotMatch(page, /AI that runs your\s+\{?"?\s*back office/);
});

test("hero demo shows receptionist, website chatbot, and owner summary flows", () => {
  const demo = readFileSync(join(root, "components", "HeroDemoPanel.tsx"), "utf8");

  assert.match(demo, /Bella answers/);
  assert.match(demo, /Website chat/);
  assert.match(demo, /Owner summary/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/homepage-content.test.mjs`

Expected: FAIL because the current homepage still says the old back-office positioning and the demo does not include the new scenario labels.

---

### Task 2: Homepage Repositioning

**Files:**
- Modify: `app/page.tsx`
- Modify: `components/Nav.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Update the hero**

Replace the current hero copy with:

- Badge: `Bella + Websites`
- Headline: `Calls answered. Website handled.`
- Supporting copy: `Bella picks up the phone, books the appointment, and captures the lead. Limitless builds the clean website around her, with AI chat and contact flows ready from day one.`
- CTAs: `Meet Bella` linking to `#bella`, and `See Websites` linking to `#websites`.

- [ ] **Step 2: Add two equal visual hero cards**

Add two cards inside the hero area:

- Bella card: incoming call, live answer status, booked appointment.
- Website card: website preview, AI chat bubble, lead captured state.

Use real JSX cards, not long explanatory text.

- [ ] **Step 3: Reorder sections**

Set homepage order to:

1. Hero
2. Demo showcase
3. Two-pillar services section with `id="services"`
4. Visual flow section with `id="how-it-works"`
5. Add-on automation suite
6. Pricing
7. Testimonials
8. About
9. FAQ
10. Final CTA and footer

- [ ] **Step 4: Update navigation**

Use these nav labels:

- `Bella` -> `#bella`
- `Websites` -> `#websites`
- `How It Works` -> `#how-it-works`
- `Pricing` -> `#pricing`

Set the nav CTA to `Book a Build` -> `#pricing`.

- [ ] **Step 5: Update metadata**

Set title and description in `app/layout.tsx` to emphasize Bella and AI-powered websites.

---

### Task 3: Demo Panel

**Files:**
- Modify: `components/HeroDemoPanel.tsx`

- [ ] **Step 1: Replace demo scenarios**

Use three scenarios:

1. `Bella answers` with tasks for call answered, service identified, appointment booked, summary sent.
2. `Website chat` with tasks for visitor question, AI answer, lead form filled, consultation request saved.
3. `Owner summary` with tasks for missed calls, bookings, website leads, and follow-up queue.

- [ ] **Step 2: Keep current animation behavior**

Keep the existing GSAP transition pattern and reduced-motion guard. Only change content and labels unless a visual bug appears.

---

### Task 4: Visual CSS And Responsiveness

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Add two-pillar and visual-flow styles**

Add styles for:

- `.hero-visual-grid`
- `.hero-offer-card`
- `.offer-pillars`
- `.pillar-card`
- `.visual-flow`
- `.flow-card`
- `.addon-grid`
- `.addon-tile`

- [ ] **Step 2: Add purposeful animation states**

Add CSS animation for:

- pulsing call dot
- subtle chat reveal
- booking confirmation slide

Respect `prefers-reduced-motion`.

- [ ] **Step 3: Check mobile layout**

Ensure all new two-column grids collapse to one column below tablet width and no long label can overflow.

---

### Task 5: Cleanup And Verification

**Files:**
- Modify: `.gitignore`
- Modify: `eslint.config.mjs`

- [ ] **Step 1: Ignore generated artifacts**

Add to `.gitignore`:

```txt
.claude/
next-dev*.log
```

Keep the ESLint `.claude/**` ignore that already prevents generated worktree output from breaking lint.

- [ ] **Step 2: Run content smoke test**

Run: `node --test tests/homepage-content.test.mjs`

Expected: PASS.

- [ ] **Step 3: Run lint**

Run: `npm run lint`

Expected: exit code 0.

- [ ] **Step 4: Run production build**

Run: `npm run build`

Expected: exit code 0, with routes for `/` and `/roi`.

- [ ] **Step 5: Browser verification**

Open or reload `http://localhost:3000/` in the in-app browser and verify:

- The hero headline is `Calls answered. Website handled.`
- Bella and web presence are equal main offers.
- The page feels minimal, clean, and easy to scan.
- Add-on automations are visibly secondary.
- Desktop and mobile layouts do not overlap.
