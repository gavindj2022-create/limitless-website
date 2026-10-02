# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Small-business owners, starting with Central Illinois service businesses, who want practical AI help without needing to become technical. Meetings are held by Zoom or Google Meet, so the service is available beyond the local market.

## Product Purpose

Limitless is Gavin Johnson's founder-led AI consulting firm. The website helps owners understand where AI can remove busywork, see credible examples, ask Bella a plain-English question, and book a free 30-minute AI audit. Every audit produces a written plan within three business days.

## Positioning

Limitless combines a real founder-led audit, done-for-you agentic solutions, and one-on-one training. It tests tools in its own rental business before recommending them and uses honest, sourced numbers only.

## Operating Context

- Primary visitor paths: understand the three services, inspect work, learn about Gavin, ask a question, or book the free audit.
- The site is a Next.js 16 App Router project deployed on Vercel.
- Lead alerts use Resend. Google Sheet logging is best-effort and remains disabled until its webhook authorization and server-only settings are complete.
- Bella is keyword-first and costs $0 by default. The mini audit has a scripted fallback when no Anthropic key is present.

## Capabilities and Constraints

- Services are limited to Advise, Build, and Train.
- No public prices. Work is quoted after the audit.
- Home stays short: photo hero, three-choice strip, the existing dawn film, contact, and footer.
- Bella appears on every page and never auto-opens.
- Old product, checkout, auth, and dashboard routes redirect permanently to `/book`; `/demos` redirects to `/work`.
- `/roi`, `/privacy`, `/terms`, and private `/hear-bella` remain available.
- Production deployment requires Gav's explicit approval. This build stops at a Vercel preview.
- The site must function without database, Anthropic, sheet, or other optional server settings.

## Brand Commitments

- Name: Limitless. Tagline: Agentic solutions.
- Voice: plain English, founder-led, confident, and truthful. Use “we”.
- Preserve the incumbent cinematic identity, Instrument Sans, cream/ink/tan/cyan palette, white pill navigation, dark pill actions, film chapters, and giant LIMITLESS footer.
- Preserve existing files under `public/media` and `public/brand` byte-for-byte.
- Never fabricate clients, results, prices, affiliations, testimonials, or claims.

## Evidence on Hand

- Existing cinematic films and posters in `public/media`.
- Existing brand marks in `public/brand`.
- Gavin's real photo library at `C:\Users\ninja\OneDrive\Pictures\GAV`.
- Public booking page: `https://calendar.app.google/CaCfThGeGv6bMpXX9`.
- Verified public work links: `https://jewardllc.com` and `https://limitless-demo-websites.pages.dev`.
- Honest figures and source labels are fixed by the approved handoff. No client case-study metrics are approved for this launch.

## Product Principles

1. Make AI easy to understand and act on.
2. Show only real work and honest numbers.
3. Keep the first decision simple: ask Bella or book the free audit.
4. Preserve privacy, graceful fallbacks, and owner control.
5. Stay fast and readable on a phone.

## Accessibility & Inclusion

Target WCAG AA contrast, visible keyboard focus, semantic landmarks, labeled form errors, keyboard-safe dialogs, readable 14px-or-larger navigation, reduced-motion alternatives, and no hidden mobile navigation tabs.
