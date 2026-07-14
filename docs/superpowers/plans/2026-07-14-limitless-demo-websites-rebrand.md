# Limitless Demo Websites Rebrand Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebrand the 25 static demo websites from FABLE/Fable/Claude Fable to Limitless Demo Websites, simplify the how-to content, update the main Limitless demos page links, and deploy the static demo collection.

**Architecture:** The main Next.js app keeps `/demos` as the sales-facing showroom and points to a standalone static Cloudflare Pages collection. The static collection remains self-contained under `C:\Users\ninja\fable-25\sites`, with `/guide` pages reduced to short AI-build notes instead of full replication instructions.

**Tech Stack:** Next.js 16, React 19, Node test runner, static HTML/CSS/JS, Cloudflare Pages via Wrangler.

---

### Task 1: Add Rebrand Regression Checks

**Files:**
- Create: `C:\Users\ninja\limitless-website\tests\demos-page.test.mjs`
- Create: `C:\Users\ninja\fable-25\verify-limitless-rebrand.mjs`

- [ ] **Step 1: Add a Next app content test**

Create `tests/demos-page.test.mjs` with assertions that `app/demos/page.tsx` uses `https://limitless-demo-websites.pages.dev/`, does not contain `fable25-9qg.pages.dev`, and `components/DemoCard.tsx` shows `Open demo` plus `Built with AI` instead of `How it was built`.

- [ ] **Step 2: Add a static collection content test**

Create `C:\Users\ninja\fable-25\verify-limitless-rebrand.mjs` with assertions that `sites/index.html` uses `Limitless Demo Websites`, contains `25 live websites created with AI by Limitless`, and no HTML file contains `FABLE·25`, `Claude Fable`, `The Making`, `Replicate This`, or `Prompt Claude Code`.

- [ ] **Step 3: Run tests red**

Run: `node --test tests/demos-page.test.mjs` from `C:\Users\ninja\limitless-website`.

Expected: fail because links still use `fable25-9qg.pages.dev` and the card still says `How it was built`.

Run: `node verify-limitless-rebrand.mjs` from `C:\Users\ninja\fable-25`.

Expected: fail because the static collection still uses FABLE/Claude/how-to language.

### Task 2: Rebrand Main Limitless Demo Links

**Files:**
- Modify: `C:\Users\ninja\limitless-website\app\demos\page.tsx`
- Modify: `C:\Users\ninja\limitless-website\components\DemoCard.tsx`

- [ ] **Step 1: Update the demo base URL**

Set the gallery URL to `https://limitless-demo-websites.pages.dev/` and derive each featured demo `live` and `guide` URL from that base.

- [ ] **Step 2: Update public copy**

Change the intro CTA to `View all 25`, keep the Limitless sales framing, and replace the guide link label with `Built with AI`.

- [ ] **Step 3: Run the Next demo test green**

Run: `node --test tests/demos-page.test.mjs`.

Expected: pass.

### Task 3: Rebrand Static Demo Collection

**Files:**
- Modify: `C:\Users\ninja\fable-25\sites\index.html`
- Modify: `C:\Users\ninja\fable-25\sites\guide\index.html`
- Modify: `C:\Users\ninja\fable-25\sites\*\guide\index.html`
- Modify: `C:\Users\ninja\fable-25\sites\*\index.html`

- [ ] **Step 1: Update collection homepage**

Change title, meta tags, nav, hero, about strip, and footer to `Limitless Demo Websites`. Replace the long build explanation with a short note: `These 25 live demos were created with AI by Limitless, then reviewed and refined for layout, copy, motion, and mobile.`

- [ ] **Step 2: Simplify guide pages**

Replace detailed `Replicate This` and prompt sections with simple `Built with AI` sections that say the demos were created with AI, then reviewed by humans and refined across layout, copy, motion, contrast, and mobile.

- [ ] **Step 3: Remove public FABLE/Claude/Fable how-to language**

Replace `Claude Fable 5`, `Claude (Fable 5)`, `FABLE·25`, and `The Making` with Limitless-branded alternatives. Keep fictional brand names like CÉLESTE, EMBER & OAK, and KAIROS unchanged.

- [ ] **Step 4: Run static content test green**

Run: `node verify-limitless-rebrand.mjs`.

Expected: pass.

### Task 4: Verify And Deploy

**Files:**
- No source file changes expected beyond Tasks 1-3.

- [ ] **Step 1: Run main app verification**

Run: `node --test tests/`.

Expected: all tests pass.

Run: `npm run build`.

Expected: production build exits 0.

- [ ] **Step 2: Run static local smoke test**

Serve `C:\Users\ninja\fable-25\sites` locally and fetch `/`, `/01-celeste/`, `/01-celeste/guide/`, `/25-kairos/`, and `/25-kairos/guide/`.

Expected: all return HTTP 200.

- [ ] **Step 3: Deploy static collection**

Run: `npx wrangler pages deploy ./sites --project-name limitless-demo-websites --branch main` from `C:\Users\ninja\fable-25`.

Expected: Wrangler uploads the static collection and returns a Cloudflare Pages deployment URL.

- [ ] **Step 4: Document domain follow-up if needed**

If `demos.golimitlessagi.com` is not already attached to the Cloudflare Pages project, note that Cloudflare Pages custom domains and DNS need to point `demos.golimitlessagi.com` to the `limitless-demo-websites` Pages project before switching the main app from the branded Pages URL to that custom subdomain.
