# Limitless website: backend, security and privacy review (for Codex)

Reviewed by Claude, 2026-10-02, on branch `consulting-remodel` (uncommitted working tree) with the dev server on `localhost:3200`.
Nothing has been committed, pushed or deployed. Gav reviews locally before production.

## What was tested live

| Check | Result |
|---|---|
| All 11 public routes + `/hear-bella` | 200; unknown route 404 |
| Internal links on every page | all resolve (no 404s) |
| Console errors/warnings on every page | none |
| Home: LCP / CLS / long tasks (dev, warm cache) | 152 ms / 0 / 0 |
| `/work`: 6 tile animations running | 240 fps, worst frame 5 ms, 0 long tasks; all 6 pause off-screen |
| `/api/audit-lead` bad email | 400 with field errors |
| `/api/audit-lead` malformed JSON | 400 |
| `/api/audit-lead` 9 KB body | 413 |
| `/api/audit-lead` honeypot filled | 200, nothing sent |
| `/api/chat` 700-char message / unknown action | 400 / 400 |
| `/api/chat` HTML/script in message | treated as text, no-match reply |
| Bella FAQ answers (25 real visitor questions) | correct after fixes below (now covered by `tests/bella-faq.test.mjs`) |
| Bella mini audit end-to-end + lead hand-off | works; one test lead sent as "QA Test (Claude)" / qa-test@example.com |
| robots.txt / sitemap / `/hear-bella` noindex | correct |
| Tests / tsc / eslint | 30/30 pass, tsc clean, eslint clean on changed files |

## Fixed in this pass (please review the diff)

1. **Dev "1 Issue" badge**: CSP blocked React's dev-only `eval`. `next.config.ts` now adds `'unsafe-eval'` only when `NODE_ENV === "development"`; production CSP is unchanged (test updated to enforce that).
2. **Bella answered "I'm not sure" to basic questions** (what do you do, what is Bella, how do I start, websites, industries, who is Gavin, guarantees). Added FAQ entries in `content/faq.ts` (Bella-only extras in `bellaExtraItems`, so they don't show on /faq).
3. **Bella price matcher was too broad**: any message with "free" or "monthly" got the price answer (e.g. "I have free time Tuesday"). Tightened in `lib/bella-faq-match.ts`. Added a greeting reply.
4. **Mini-audit substring bug**: "voicemail" matched "email", so Bella suggested an admin workflow. `lib/bella-audit.ts` now matches whole words.
5. **Bella widget rebuilt** (`components/BellaChat.tsx` + `BellaChat.module.css`): proper dialog semantics, Esc closes and returns focus, typing indicator, auto-scroll, restart button, consistent chips, mobile bottom sheet, focus returns to the input after each reply, `AskBellaButton` prompt is now used. Logic and API contract unchanged. Never auto-opens.
6. **FAQ "Ask Bella" box**: used an undefined `sr-only` class, so the label showed and squashed the input. Fixed (`components/FaqAsk.tsx`).
7. **Book form**: showed the raw "Validation failed" string; now validates on the client first, focuses the first bad field, and says "Please fix the highlighted fields." The calendar and "Back to home" links no longer run together.

## Fixed in the follow-up pass (2026-10-02 evening)

- #1 Analytics consent: GTM/Meta Pixel now load only after a visitor accepts the cookie banner (`components/ConsentAnalytics.tsx`); the no-JS tracker fallbacks were removed. Test: `tests/consent.test.mjs`.
- #3 Sheet logging now runs in `after()`, so Bella replies never wait on Google.
- #4 Lead alerts set `replyTo` to the lead (sender domain still needs Resend verification in production).
- #5 `.env.example` rewritten for the current app (retired Stripe/NextAuth/DB vars removed; still remove them from Vercel).
- #8 `max_tokens` is 150 and code fences are stripped before `JSON.parse`.
- #9 Unused `history` removed from the request schema and client.
- #10 The proxy uses `getClientIp()`; dead `/api/auth`, `/api/contact`, `/api/webhooks` branches removed.
- #13 `lib/leak-audit.ts` deleted.
- #14 `page` must start with a single `/`.

Still open: #2 (shared rate-limit store before enabling the Anthropic key), #6/#7 (bot protection before turning on autoreply), #11 (nonce CSP), #12, #15, #16.

## Open findings for Codex

Severity: **M** = fix before turning on paid AI or ads, **L** = hardening, **I** = info/content.

| # | Sev | Area | Where | Finding | Suggested fix |
|---|---|---|---|---|---|
| 1 | M | Privacy | `components/Analytics.tsx:19-50` vs `app/privacy/page.tsx:224-228` | Privacy policy says GTM and Meta Pixel "stay off unless we add a consent choice first", but the code loads both as soon as the env vars are set. There's no consent gate. | Add a consent banner/state and only render the scripts after opt-in, or add a test that fails if the IDs are set without consent support. |
| 2 | M | Abuse / cost | `lib/rate-limit.ts:22, 95-124` | All rate limits and the Bella AI spend cap live in process memory. On Vercel each instance and cold start resets them, so they aren't real limits. | Move to a shared store (Upstash Redis / Vercel KV) before setting `ANTHROPIC_API_KEY` in production. Also set a hard spend limit in the Anthropic console. |
| 3 | M | Latency | `app/api/chat/route.ts:57` | Every Bella question waits for the Google Sheet log (up to a 3 s timeout) before replying. | Log after the response with `after()` from `next/server`. |
| 4 | M | Email | `lib/lead-capture.ts:15-21`, `.env` | The owner alert has no `replyTo`, so hitting Reply goes to the sender address, not the lead. The default sender `onboarding@resend.dev` only delivers to the Resend account owner. | Add `replyTo: lead.email`. Set `EMAIL_FROM` to a verified golimitlessagi.com sender in Vercel production. |
| 5 | M | Config hygiene | `.env.example`, Vercel env | `.env.example` still lists retired Stripe, NextAuth and database vars, says the default notify email is gavindj2022@gmail.com (code uses limitlessgav@gmail.com), and is missing `ANTHROPIC_API_KEY`, `BELLA_MODEL`, `BELLA_DAILY_MAX`, `LEADS_SHEET_URL`, `LEADS_SHEET_SECRET`, `LEAD_AUTOREPLY`, `NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_META_PIXEL_ID`. | Rewrite `.env.example`. Remove unused Stripe/NextAuth/DB secrets from Vercel (least privilege). |
| 6 | L | Abuse | `lib/lead-capture.ts:25-33` | With `LEAD_AUTOREPLY=on`, anyone can make the site email any address. | Keep it off, or add bot protection (#7) first. |
| 7 | L | Bots | `app/api/audit-lead/route.ts` | Only a honeypot protects the lead form. | Add Cloudflare Turnstile or Vercel BotID. |
| 8 | L | Cost / robustness | `app/api/chat/route.ts:25-33` | `max_tokens: 4000` for a ~30-token JSON reply. Replies wrapped in code fences fail `JSON.parse` silently (falls back to the script). | Use `max_tokens` ~150, strip fences or use structured output, and log fallback counts. |
| 9 | L | Dead code | `app/api/chat/route.ts:54`, `lib/validation.ts:27,39` | `history` is accepted and normalized, but the result is thrown away. | Remove it from the schema and client, or use it. |
| 10 | L | Rate-limit identity | `proxy.ts:41-44` vs `lib/request-guards.ts:17-28` | The proxy keys limits on the first `X-Forwarded-For` value (spoofable off-Vercel). Routes use the last value. The proxy also references `/api/auth`, `/api/contact` and `/api/webhooks`, which no longer exist. | Use `getClientIp()` in the proxy and delete the dead branches. |
| 11 | L | CSP | `next.config.ts:3-16` | `script-src 'unsafe-inline'` weakens XSS protection. | Move to a nonce-based CSP generated in `proxy.ts`. |
| 12 | L | Spend cap | `app/api/chat/route.ts:73` | The per-session AI cap keys on a client-supplied `sessionId`, which can be rotated freely. Only the IP daily cap really limits. | Rely on the shared IP/day cap from #2. |
| 13 | L | Dead code | `lib/leak-audit.ts` | No longer imported by the app (only one test reads it). | Delete it with its test assertion. |
| 14 | I | Validation | `lib/validation.ts:10,26,31` | The `page` regex `^\/` allows `//host`. It's only rendered escaped, so it's not exploitable today. | Use `^\/(?!\/)`. |
| 15 | I | Headers | `next.config.ts` HSTS | `preload` is set. | Keep it only if the domain is submitted to the preload list and every subdomain is HTTPS. |
| 16 | I | Content accuracy | `/how-we-help` night film, `/roi`, `content/socials.ts` | "You were asleep. This booked itself." reads as booking, while Bella chat says it can't book (that's about chat vs. the phone agent; worth clarifying). `/roi` says "~80% of people just dial the next business" with no source, against the "sourced numbers only" rule. Social handles `@gav.consulting` and `@gavvro` should be confirmed by Gav. | Gav to confirm the copy. Add a source or soften the ROI claim. |

## Already solid (keep)

- Same-origin check, 8 KB streamed body cap, strict zod schemas, `no-store` on API responses.
- HTML-escaped email templates; honeypot discards before any email or PII write.
- Question logging strips emails, phone numbers, names and URLs before writing to the sheet. The sheet URL is allowlisted to `script.google.com/.../exec` with a shared secret.
- The FAQ chat never calls a model. The model path only returns a service list that the server renders (no free-text from the model reaches visitors).
- Security headers: CSP, frame-ancestors none, nosniff, referrer policy, permissions policy, HSTS.

## Backups

The pre-change copies of every file touched today are in `.impeccable/backup-pre-founder-hero/` (untracked — do not commit that folder).
