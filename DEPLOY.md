# Publishing the Limitless website

This is a **Next.js 16** app with API routes, Prisma/Postgres, NextAuth, Stripe,
and Resend. The recommended host is **Vercel** (built for Next.js, free tier is
plenty to launch). The marketing pages (`/`, `/roi`) are static and will go live
immediately — the database, auth, Stripe, and email only power `/dashboard`,
`/book`, and the `/api/*` routes, so you can launch the site first and wire those
up as you go.

Repo: https://github.com/gavindj2022-create/limitless-website (branch `main`)

---

## Fast path — get the site live (5 minutes)

1. Go to **https://vercel.com/new** and sign in with GitHub.
2. **Import** the `gavindj2022-create/limitless-website` repo.
3. Framework preset auto-detects **Next.js**. Leave build settings default
   (`npm install` → `next build`; the `postinstall` runs `prisma generate`).
4. Before the first deploy, add at least these two env vars (see table below):
   `NEXTAUTH_SECRET` and `NEXT_PUBLIC_APP_URL`. The homepage renders without the
   rest.
5. Click **Deploy**. You'll get a live URL like
   `limitless-website.vercel.app`.

The homepage, mission, How It Works, pricing, and FAQ all work at this point.
Forms and checkout stay inert until you finish the steps below.

---

## Environment variables

Set these in **Vercel → Project → Settings → Environment Variables** (Production).
Mirror them into `.env.local` if you want forms/checkout working locally too.

| Variable | Required for | Where to get it |
|---|---|---|
| `NEXTAUTH_URL` | Login / dashboard | Your live URL, e.g. `https://limitless.com` |
| `NEXTAUTH_SECRET` | Login / dashboard | Run `openssl rand -base64 32` |
| `NEXT_PUBLIC_APP_URL` | Links / redirects | Your live URL |
| `DATABASE_URL` | Dashboard, bookings, subscriptions | Postgres connection string (see Database) |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google login | Google Cloud Console → Credentials |
| `STRIPE_SECRET_KEY` | Checkout / billing | Stripe Dashboard → API keys (`sk_live_…`) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Checkout | Stripe Dashboard → API keys (`pk_live_…`) |
| `STRIPE_WEBHOOK_SECRET` | Subscription status | Stripe → Webhooks (`whsec_…`, see Stripe step) |
| `STRIPE_PRICE_STARTER` | Pricing → checkout | Stripe product price ID ($29/mo) |
| `STRIPE_PRICE_GROWTH` | Pricing → checkout | Stripe product price ID ($199/mo) |
| `STRIPE_PRICE_FULL_OPS` | Pricing → checkout | Stripe product price ID ($499/mo) |
| `RESEND_API_KEY` | Contact / lead / booking emails | resend.com → API keys (`re_…`) |

---

## Database (Postgres)

1. Provision Postgres — easiest options: **Vercel Postgres** (Storage tab in the
   project), **Neon**, or **Supabase**. Copy the connection string into
   `DATABASE_URL`.
2. Push the schema (run locally with `DATABASE_URL` set, or from a one-off shell):
   ```bash
   npx prisma db push
   ```
   This creates the NextAuth + Subscription + booking/lead tables.

> Note: `prisma generate` runs automatically on install (postinstall) and does
> **not** need a database. `db push` / migrations do.

---

## Stripe

1. In the Stripe Dashboard, create three recurring products and copy each
   **price ID** into `STRIPE_PRICE_STARTER`, `STRIPE_PRICE_GROWTH`,
   `STRIPE_PRICE_FULL_OPS`.
2. Add API keys (`STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`). Use
   `sk_test_…` / `pk_test_…` to trial, swap to live keys when ready.
3. Add a webhook endpoint: **Developers → Webhooks → Add endpoint**
   `https://YOUR_DOMAIN/api/webhooks/stripe`, subscribe to
   `checkout.session.completed` and `customer.subscription.*` events, then copy
   the signing secret into `STRIPE_WEBHOOK_SECRET`.

## Google OAuth (login)

In Google Cloud Console → Credentials → your OAuth client, add the redirect URI:
`https://YOUR_DOMAIN/api/auth/callback/google`. Copy client ID/secret into env.

## Resend (email)

Create an API key at resend.com and set `RESEND_API_KEY`. Verify your sending
domain so contact/booking/lead emails deliver instead of landing in spam.

---

## Custom domain

In **Vercel → Project → Settings → Domains**, add your domain and follow the DNS
records Vercel shows. Then set `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` to the
final `https://` domain and redeploy.

---

## Going forward

The repo's default branch is `main`. Vercel auto-deploys every push to `main`,
and builds a preview deploy for any other branch or pull request. To ship a
change: commit, push, done.
