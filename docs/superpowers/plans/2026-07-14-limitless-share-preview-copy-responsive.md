# Limitless Share Preview Copy Responsive Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the Limitless share preview say `limitless`, use the Limitless logo, remove unconfirmed/customer-specific copy, move About lower, and improve mobile/desktop fit.

**Architecture:** Keep the work small. Metadata lives in `app/layout.tsx` and file-based assets live in `app/`. Homepage copy/order changes stay in `app/page.tsx` and `components/experience/Ledger.tsx`. Responsive fit changes stay in `app/globals.css`.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Node test runner, global CSS.

---

### Task 1: Backup And Memory

**Files:**
- Create/update: `C:/Users/ninja/Gavs Brain/Gavs Brain/Projects/Limitless Website Backups/<timestamp>/`
- Modify: `C:/Users/ninja/Gavs Brain/Gavs Brain/Codex Hub/Codex User Profile.md`

- [x] **Step 1: Save pre-edit backup**

Create a dated backup folder in the Obsidian vault with git status, HEAD, tracked diff, untracked list, and untracked archive.

- [x] **Step 2: Save communication preference**

Add the preference that technical explanations should start in plain, dumbed-down language.

### Task 2: Share Preview Metadata

**Files:**
- Modify: `app/layout.tsx`
- Modify: `proxy.ts`
- Create: `app/opengraph-image.png`
- Create: `app/twitter-image.png`
- Create: `app/icon.png`
- Create: `app/apple-icon.png`
- Test: `tests/metadata.test.mjs`

- [x] **Step 1: Write failing metadata tests**

Assert that root metadata says `limitless` and the expected image files exist.

- [x] **Step 2: Run metadata tests and confirm failure**

Run: `node --test .\tests\metadata.test.mjs`

- [x] **Step 3: Implement metadata and assets**

Update `app/layout.tsx`, add logo assets, and make sure proxy excludes metadata image/icon routes.

- [x] **Step 4: Run metadata tests and confirm pass**

Run: `node --test .\tests\metadata.test.mjs`

### Task 3: Homepage Copy And Order

**Files:**
- Modify: `app/page.tsx`
- Modify: `components/experience/Ledger.tsx`
- Test: `tests/homepage-content.test.mjs`

- [x] **Step 1: Write failing homepage tests**

Assert `service business` is present, `salon on the Bella plan` is gone, `Becky Thompson` is gone, and the About section appears after FAQ.

- [x] **Step 2: Run homepage tests and confirm failure**

Run: `node --test .\tests\homepage-content.test.mjs`

- [x] **Step 3: Implement copy/order changes**

Replace salon wording, replace Becky card with an outcome/workflow card, and move About lower.

- [x] **Step 4: Run homepage tests and confirm pass**

Run: `node --test .\tests\homepage-content.test.mjs`

### Task 4: Responsive Fit

**Files:**
- Modify: `app/globals.css`

- [x] **Step 1: Tighten responsive CSS**

Compact mobile hero, hide desktop nav earlier on tablets, and reduce crowded card spacing on smaller screens.

- [x] **Step 2: Browser check viewports**

Check `320x568`, `390x844`, `768x1024`, `1280x800`, and `1920x1080` for horizontal overflow and obvious overlap.

### Task 5: Verification And Deploy Path

**Files:**
- Update: `C:/Users/ninja/Gavs Brain/Gavs Brain/Projects/Limitless Website Backups/<timestamp>/README.md`
- Update: `C:/Users/ninja/Gavs Brain/Gavs Brain/Codex Hub/Codex Session Log.md`

- [x] **Step 1: Run full checks**

Run: `node --test .\tests\*.mjs`, `npm run lint`, and `npm run build`.

- [x] **Step 2: Update Obsidian log**

Record what changed, test/build results, and deploy recommendation.

- [x] **Step 3: Deploy path**

If local checks pass, push/merge through the private GitHub/Vercel path only when ready for production.
