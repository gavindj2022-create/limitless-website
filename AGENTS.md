<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Limitless Website

Marketing site for **Limitless** (Gav's AI-automation agency; formerly DAWGS AGI — never use the old name). Next.js App Router + Prisma, sonder-style hero.

- Repo: https://github.com/gavindj2022-create/limitless-website (branch `main`)
- Status: verified deploy-ready 2026-07-02 (11/11 tests, clean build, graceful no-DB degrade). Deployment target: Vercel import + env vars — steps in vault `Projects/Go-Live Runbook — All Web Properties.md`.

## Commands

```bash
npm run dev        # dev server
npm run build      # production build (must stay clean)
npm run lint       # eslint
node --test tests/ # test suite (build-prompt, homepage-content, quiz)
```

## Layout

- `app/` — App Router pages · `components/` — UI · `lib/` — shared logic
- `prisma/` — schema (`postinstall` runs `prisma generate`; app must degrade gracefully with no DB)
- `tests/` — node:test suites · `scripts/preview-emails.mjs` — email template preview

