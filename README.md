# Limitless

Marketing site and customer dashboard for **Limitless** — an AI automation
company for local businesses (AI receptionist "Bella" + AI-powered websites).

Built with Next.js 16, GSAP, Prisma/Postgres, NextAuth, Stripe, and Resend.

## Develop

```bash
npm install
npm run dev          # http://localhost:3000
```

Copy `.env.example` to `.env.local` and fill in values to exercise auth, Stripe,
and email locally. The homepage and marketing pages run without any env vars.

## Build

```bash
npm run build        # prisma generate runs on install; next build for prod
```

## Deploy / publish

See **[DEPLOY.md](./DEPLOY.md)** for the full publish checklist (Vercel, env
vars, database, Stripe webhook, custom domain).

## Project layout

- `app/` — routes. `/` homepage, `/roi`, `/book`, `/dashboard`, `/api/*`.
- `components/` — UI. Hero/world, pricing, team, FAQ, and scroll-animation
  helpers (`ScrollProgress`, `ScrollParallax`, `RevealOnScroll`).
- `prisma/schema.prisma` — NextAuth + subscriptions + booking/lead models.
- `docs/superpowers/` — design specs and implementation plans.
