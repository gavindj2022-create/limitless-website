# Limitless consulting remodel Council board

Branch: `consulting-remodel`

Source of truth: `C:\Users\ninja\Gavs Brain\Gavs Brain\Projects\Limitless Website\Consulting Remodel - Codex Handoff 2026-10-01.md`

## Path contract

| Role | Owner | Paths | Status |
|---|---|---|---|
| Lead / orchestrator | `/root` | integration, `app/layout.tsx`, `app/globals.css`, `next.config.ts`, package files, archive manifest, build and preview | complete |
| Designer-critic | `/root/designer_critic` | read-only visual review and final signoff | final review requested |
| Builder: pages | `/root/builder_pages` | public pages, `components/Nav.tsx`, `Footer.tsx`, `SocialLinks.tsx`, `WorkTiles.tsx`, booking form, page CSS module, sitemap and robots | implementation integrated |
| Builder: DotCloud + motion | `/root/builder_dotcloud_motion` | `components/experience/DotCloud.tsx`, its CSS module, film lifecycle fixes, motion-specific tests | implementation integrated |
| Builder: Bella + leads | `/root/builder_bella_leads` | `content/faq.ts`, Bella and lead libraries/components/routes/tests listed in its ownership report | implementation integrated |
| Copy | `/root/copy_review` | read-only exact-copy and claims review | complete |
| Change regression | `/root/change_regression_review` | read-only comparison of the late change log against built work | complete |
| Hero change review | `/root/hero_change_review` | read-only locked hero compliance review | complete |
| QA verifier | `/root/qa_final` | read-only build, tests, browser, accessibility, performance, security, redirects, preview checks | initial findings fixed, final review requested |

## Locked integration contracts

- Pages may import `DotCloud`, `FaqAsk`, and Bella trigger helpers, but do not edit their owner files.
- Bella owner may modify `app/api/audit-lead/route.ts`, `lib/validation.ts`, `lib/email-templates.ts`, and `lib/rate-limit.ts`.
- Lead success means the owner notification was accepted. Sheet logging and visitor auto-reply stay best-effort.
- Default Bella mode never calls Anthropic. Mini audit works as a scripted four-question flow without a key.
- `/roi` is retained and has all public price copy removed.
- Phone demo is shown now. The later “SHOW NOW” decision supersedes the older hidden-until-test line.
- No production deployment, push, remote change, secret access, or secret write.

## Resumption change review, 2026-10-01 late

- Re-read the change log and `HERO IMAGE: FINAL` before resuming implementation.
- Rejected and retired from the shipping plan: the generated cafe image of Gavin and a client, plus the three separate owner-scene images.
- Home hero now uses the supplied no-people shop-counter poster and cinemagraph. The existing HTML headline and CTA layer stays.
- DotCloud changes from a small corner badge to the main center-right pop, inside the specified desktop x 46-71% / y 34-50% target zone and outside the OPEN sign, steam, mug, phone, plant, and copy keep-outs.
- `/work` changes from three owner scenes to the supplied single wide team banner. People are not described as clients or team members.
- `/book` adds the supplied planning-table banner above the locked narrow form.
- Unaffected finished work stays: nav, locked home sections after the hero, dawn film, `/how-we-help`, `/about`, FAQ and Bella source data, work tiles, footer, and lead/security foundations.
- New media source: vault `Projects/Limitless Website/Images 2026-10/`. Source assets are copied to new `/public/consulting` filenames, never removed from the vault.

## Verification ledger

- Baseline screenshots: `.impeccable/review/baseline/desktop-{hero,dawn,footer}.png` and mobile equivalents.
- Baseline console errors: 0 desktop, 0 mobile.
- Baseline branch point: `dd872a1f3507a6b1fcd49bedfb92e3d85299a91b`.
- Final hero proof: `.impeccable/review/hero-final-change/desktop-hero.png`, `mobile-hero.png`, and `home-production-trace.json`.
- Late-change hero: final shop-counter poster and loop, large center-right DotCloud, and HTML copy. The rejected Gavin/client hero remains archived, not shipped.
- Late-change page media: one team banner on `/work`, one planning-table banner on `/book`, no three-owner-scene set.
- Browser QA: all 10 public/main pages checked at desktop and 375px with no horizontal overflow. Console errors and warnings: 0. Nav, FAQ keyboard behavior, work dialog, sticky CTA, and reduced motion were exercised.
- Performance trace: LCP 150.823 ms, FCP 150.823 ms, CLS 0, long tasks over 50 ms: 0, first-load transfer 508,683 bytes. Reduced motion produced 0 videos, 0 DotCloud canvases, and 1 static mark.
- Media budgets: poster 56,156 bytes, WebM 48,393 bytes, MP4 53,320 bytes, work banner 41,442 bytes, book banner 26,690 bytes.
- Automated proof: 26 of 26 tests pass, lint passes, production build renders 23 routes, and `npm audit --omit=dev` reports 0 vulnerabilities.
- Prove-it mutation: the locked headline assertion was deliberately broken, failed, restored, and passed 5 of 5 targeted tests.
- Live local checks: 11 public routes return 200 with CSP and `nosniff`; 10 retired routes return 308; invalid lead JSON returns 400; oversized chat JSON returns 413.
- Final preview deployment is READY at `https://limitless-website-k5xy1g09a-gavindj2022-7436s-projects.vercel.app`. Vercel-authenticated checks returned 200 for `/`, `/work`, `/book`, and `/privacy`, plus 308 from `/api/auth/signin` to `/book`.
- Production remains untouched. No remote push was made.

## Final QA corrections, 2026-10-02

- Removed the retired `$199` constant and checkout tier schema.
- Changed the stale mobile CTA from `/build` to `/book` and locked it with a regression test.
- Added the retired `/api/auth/:path*` redirect to `/book` and proved `/api/auth/signin` returns 308 locally and on the preview.
- Corrected the full privacy-page contact to `limitlessgav@gmail.com`.
- Corrected the hero WebM source declaration so the VP9 file is not mislabeled as AV1.
- Added executable Bella cap logic tests: per-IP, per-session, or spend denial all force the scripted fallback.
- Remaining operational limitation: `BELLA_DAILY_MAX` is enforced per running process. A production-wide ceiling needs a shared persistent counter before enabling the Anthropic key across multiple instances.
