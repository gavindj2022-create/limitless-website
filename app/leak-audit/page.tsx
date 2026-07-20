"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import {
  PRESETS,
  computeLeak,
  usd,
  BELLA_MONTHLY,
  REPLY_TIME_LABELS,
  type LeakPreset,
  type ReplyTime,
} from "@/lib/leak-audit";

const REPLY_ORDER: ReplyTime[] = ["instant", "under1h", "hours", "nextday"];

const GRADE_COLOR: Record<string, string> = {
  A: "#7FD19A",
  B: "#7FD19A",
  C: "#E4C08A",
  D: "#E9A6A6",
  F: "#E9A6A6",
};

export default function LeakAuditPage() {
  const [vertical, setVertical] = useState(PRESETS[0].name);
  const [missed, setMissed] = useState(PRESETS[0].missedCallsPerWeek);
  const [value, setValue] = useState(PRESETS[0].avgCustomerValue);
  const [replyTime, setReplyTime] = useState<ReplyTime>(PRESETS[0].replyTime);
  const [hasAI, setHasAI] = useState(PRESETS[0].hasAIReceptionist);
  const [hasBooking, setHasBooking] = useState(PRESETS[0].hasOnlineBooking);

  // lead form
  const [name, setName] = useState("");
  const [business, setBusiness] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [errMsg, setErrMsg] = useState("");

  const r = useMemo(
    () =>
      computeLeak({
        missedCallsPerWeek: missed,
        avgCustomerValue: value,
        replyTime,
        hasAIReceptionist: hasAI,
        hasOnlineBooking: hasBooking,
      }),
    [missed, value, replyTime, hasAI, hasBooking]
  );

  function pickPreset(p: LeakPreset) {
    setVertical(p.name);
    setMissed(p.missedCallsPerWeek);
    setValue(p.avgCustomerValue);
    setReplyTime(p.replyTime);
    setHasAI(p.hasAIReceptionist);
    setHasBooking(p.hasOnlineBooking);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setErrMsg("");
    try {
      const res = await fetch("/api/audit-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          business: business || undefined,
          phone: phone || undefined,
          vertical,
          website,
          missedCallsPerWeek: missed,
          avgCustomerValue: value,
          replyTime,
          hasAIReceptionist: hasAI,
          hasOnlineBooking: hasBooking,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong.");
      }
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setErrMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  const gradeColor = GRADE_COLOR[r.grade] ?? "#E4C08A";

  return (
    <>
      <a href="#main" className="skip">Skip to content</a>
      <Nav />
      <main id="main">
        <section className="wrap la">
          <div className="la-head">
            <span className="eyebrow">Free 60-second audit</span>
            <h1 className="la-title">How much money is your business leaking?</h1>
            <p className="la-sub">
              Missed calls, slow replies, and no after-hours booking quietly drain
              revenue every month. Answer five quick questions and see your number.
            </p>
          </div>

          <div className="la-grid">
            {/* INPUTS */}
            <div className="la-card">
              <h2 className="la-card-h">Your business</h2>

              <div className="la-verts">
                {PRESETS.map((p) => (
                  <button
                    key={p.key}
                    type="button"
                    className={"la-vert" + (vertical === p.name ? " is-active" : "")}
                    onClick={() => pickPreset(p)}
                  >
                    {p.name}
                  </button>
                ))}
              </div>

              <label className="la-label">Missed calls per week</label>
              <input
                type="number"
                className="la-input"
                min={0}
                value={missed}
                onChange={(e) => setMissed(Math.max(0, +e.target.value || 0))}
              />

              <label className="la-label">Average customer value</label>
              <div className="la-money">
                <span>$</span>
                <input
                  type="number"
                  className="la-input"
                  min={0}
                  step={10}
                  value={value}
                  onChange={(e) => setValue(Math.max(0, +e.target.value || 0))}
                />
              </div>

              <label className="la-label">How fast do you reply to new leads?</label>
              <div className="la-seg">
                {REPLY_ORDER.map((rt) => (
                  <button
                    key={rt}
                    type="button"
                    className={"la-seg-btn" + (replyTime === rt ? " is-active" : "")}
                    onClick={() => setReplyTime(rt)}
                  >
                    {REPLY_TIME_LABELS[rt]}
                  </button>
                ))}
              </div>

              <div className="la-toggles">
                <div className="la-toggle">
                  <span>Do you have an AI receptionist?</span>
                  <div className="la-yn">
                    <button type="button" className={"la-yn-btn" + (hasAI ? " is-active" : "")} onClick={() => setHasAI(true)}>Yes</button>
                    <button type="button" className={"la-yn-btn" + (!hasAI ? " is-active" : "")} onClick={() => setHasAI(false)}>No</button>
                  </div>
                </div>
                <div className="la-toggle">
                  <span>Can customers book online?</span>
                  <div className="la-yn">
                    <button type="button" className={"la-yn-btn" + (hasBooking ? " is-active" : "")} onClick={() => setHasBooking(true)}>Yes</button>
                    <button type="button" className={"la-yn-btn" + (!hasBooking ? " is-active" : "")} onClick={() => setHasBooking(false)}>No</button>
                  </div>
                </div>
              </div>
            </div>

            {/* RESULTS */}
            <div className="la-card la-out">
              <div className="la-bigcap">Your business is leaking</div>
              <div className="la-big">~{usd(r.totalMonthly)}<span className="la-per">/month</span></div>
              <div className="la-year">≈ {usd(r.totalYearly)} a year walking out the door</div>

              <div className="la-grade" style={{ borderColor: gradeColor }}>
                <span className="la-grade-letter" style={{ color: gradeColor }}>{r.grade}</span>
                <span className="la-grade-cap">Lead-capture grade · {r.score}/100</span>
              </div>

              <div className="la-rows">
                <div className="la-row"><span>Missed calls never called back</span><b className="la-lost">{usd(r.missedCallLeak)}/mo</b></div>
                <div className="la-row"><span>Leads gone cold from slow replies</span><b className="la-lost">{usd(r.slowReplyLeak)}/mo</b></div>
                <div className="la-row"><span>Bookings lost after hours</span><b className="la-lost">{usd(r.afterHoursLeak)}/mo</b></div>
              </div>
            </div>
          </div>

          {/* LEAD CAPTURE */}
          <div className="la-cta">
            {status === "done" ? (
              <div className="la-done">
                <h3>Sent, {name.split(" ")[0] || "thanks"}. 🎉</h3>
                <p>
                  Your full breakdown is on its way to your inbox. Want us to plug the
                  leak? Bella answers every call, texts back missed callers, and books
                  after hours — <b>${BELLA_MONTHLY}/mo</b>.
                </p>
                <Link href="/book?service=bella" className="la-submit la-submit-link">
                  Get my free fix plan →
                </Link>
              </div>
            ) : (
              <form className="la-form" onSubmit={submit}>
                <div className="la-form-head">
                  <h3>Get my free fix plan</h3>
                  <p>Full breakdown emailed instantly. No spam — one report, one follow-up.</p>
                </div>
                <div className="la-fields">
                  <input className="la-input" placeholder="Your name" required
                    value={name} onChange={(e) => setName(e.target.value)} />
                  <input className="la-input" placeholder="Business name"
                    value={business} onChange={(e) => setBusiness(e.target.value)} />
                  <input className="la-input" type="email" placeholder="Email" required
                    value={email} onChange={(e) => setEmail(e.target.value)} />
                  <input className="la-input" placeholder="Phone (optional)"
                    value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                {/* Honeypot — hidden from real users. */}
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
                />
                {status === "error" && <p className="la-err">{errMsg}</p>}
                <button className="la-submit" type="submit" disabled={status === "sending"}>
                  {status === "sending" ? "Sending…" : "Email me my free fix plan"}
                </button>
              </form>
            )}
          </div>

          <p className="la-foot">
            Estimate only, based on your inputs and industry benchmarks (~35% of missed
            callers would have booked). Not a guarantee of results. · Limitless · Peoria, IL
          </p>
        </section>
      </main>

      <style>{`
        .la { padding-top: 56px; padding-bottom: 96px; }
        .la-head { max-width: 720px; margin-bottom: 40px; }
        .la-title { font-size: clamp(30px, 5vw, 52px); font-weight: 500; letter-spacing: -0.02em; line-height: 1.05; margin: 16px 0 14px; }
        .la-sub { color: var(--ink-2); font-size: 18px; max-width: 620px; }
        .la-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        @media (max-width: 820px) { .la-grid { grid-template-columns: 1fr; } }
        .la-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--r-lg); padding: 28px; box-shadow: var(--shadow-md); }
        .la-card-h { font-size: 13px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--muted); margin-bottom: 20px; }
        .la-verts { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 22px; }
        .la-vert { flex: 1 1 30%; background: var(--surface-2); border: 1px solid var(--border); border-radius: 999px; padding: 9px 8px; font-size: 13px; transition: .15s; }
        .la-vert:hover { border-color: var(--accent-line); }
        .la-vert.is-active { background: var(--ink); color: var(--accent-ink); border-color: var(--ink); font-weight: 500; }
        .la-label { display: block; font-size: 14px; color: var(--ink-2); margin: 16px 0 7px; }
        .la-input { width: 100%; background: var(--surface-2); border: 1px solid var(--border-hi); border-radius: var(--r-sm); padding: 12px 13px; font: inherit; font-size: 16px; font-weight: 500; color: var(--ink); }
        .la-input:focus { outline: none; border-color: var(--ink); }
        .la-money { display: flex; align-items: center; gap: 8px; }
        .la-money > span { color: var(--muted); font-size: 17px; }
        .la-seg { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .la-seg-btn { background: var(--surface-2); border: 1px solid var(--border); border-radius: var(--r-sm); padding: 10px 8px; font-size: 13px; color: var(--ink-2); transition: .15s; }
        .la-seg-btn:hover { border-color: var(--accent-line); }
        .la-seg-btn.is-active { background: var(--ink); color: var(--accent-ink); border-color: var(--ink); font-weight: 500; }
        .la-toggles { margin-top: 20px; display: grid; gap: 12px; }
        .la-toggle { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
        .la-toggle > span { font-size: 14px; color: var(--ink-2); }
        .la-yn { display: flex; gap: 6px; flex-shrink: 0; }
        .la-yn-btn { background: var(--surface-2); border: 1px solid var(--border); border-radius: 999px; padding: 8px 16px; font-size: 13px; color: var(--ink-2); transition: .15s; }
        .la-yn-btn.is-active { background: var(--ink); color: var(--accent-ink); border-color: var(--ink); font-weight: 500; }
        .la-out { background: var(--ink); color: var(--accent-ink); border-color: var(--ink); }
        .la-bigcap { font-size: 12px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--muted-2); margin-bottom: 6px; }
        .la-big { font-size: clamp(40px, 7vw, 56px); font-weight: 600; letter-spacing: -0.02em; line-height: 1; color: #fff; }
        .la-per { font-size: 18px; font-weight: 400; color: var(--muted-2); margin-left: 4px; }
        .la-year { font-size: 13px; color: var(--muted-2); margin-top: 8px; }
        .la-grade { display: flex; align-items: center; gap: 14px; margin: 22px 0; padding: 14px 18px; border: 1px solid rgba(255,255,255,0.16); border-radius: var(--r-md); background: rgba(255,255,255,0.05); }
        .la-grade-letter { font-size: 40px; font-weight: 700; line-height: 1; }
        .la-grade-cap { font-size: 13px; color: var(--muted-2); }
        .la-rows { display: grid; gap: 2px; }
        .la-row { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; padding: 11px 0; border-bottom: 1px solid rgba(255,255,255,0.1); }
        .la-row > span { color: var(--muted-2); font-size: 14px; }
        .la-row > b { font-size: 16px; font-weight: 600; color: #fff; white-space: nowrap; }
        .la-lost { color: #E9A6A6 !important; }
        .la-cta { margin-top: 24px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--r-lg); padding: 28px; box-shadow: var(--shadow-md); }
        .la-form-head h3, .la-done h3 { font-size: 22px; font-weight: 500; letter-spacing: -0.01em; margin-bottom: 6px; }
        .la-form-head p, .la-done p { color: var(--ink-2); margin-bottom: 18px; }
        .la-fields { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        @media (max-width: 560px) { .la-fields { grid-template-columns: 1fr; } }
        .la-submit { margin-top: 16px; width: 100%; background: var(--ink); color: var(--accent-ink); border-radius: 999px; padding: 15px; font-weight: 500; font-size: 16px; transition: .15s; }
        .la-submit:hover { opacity: 0.9; }
        .la-submit:disabled { opacity: 0.5; cursor: default; }
        .la-submit-link { display: inline-block; width: auto; padding: 14px 26px; text-align: center; }
        .la-err { color: var(--danger); margin-top: 12px; font-size: 14px; }
        .la-done { text-align: left; }
        .la-foot { margin-top: 24px; color: var(--muted); font-size: 13px; text-align: center; }
      `}</style>
    </>
  );
}
