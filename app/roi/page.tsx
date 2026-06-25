"use client";

import { useMemo, useState } from "react";
import Nav from "@/components/Nav";

type Preset = { name: string; ticket: number };

const PRESETS: Preset[] = [
  { name: "Salon / Barber", ticket: 150 },
  { name: "Gym / Fitness", ticket: 1000 },
  { name: "Med-Spa", ticket: 600 },
  { name: "Contractor", ticket: 2000 },
  { name: "Dental", ticket: 600 },
  { name: "Property Mgmt", ticket: 1500 },
];

const BELLA_MONTHLY = 147;
const usd = (n: number) => "$" + Math.round(n).toLocaleString("en-US");

export default function RoiCalculatorPage() {
  const [vertical, setVertical] = useState(PRESETS[0].name);
  const [callsMissed, setCallsMissed] = useState(5);
  const [ticket, setTicket] = useState(PRESETS[0].ticket);
  const [conv, setConv] = useState(25);
  const [days, setDays] = useState(22);

  // lead form
  const [name, setName] = useState("");
  const [business, setBusiness] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [errMsg, setErrMsg] = useState("");

  const r = useMemo(() => {
    const lostPerDay = callsMissed * (conv / 100) * ticket;
    const lostPerMonth = lostPerDay * days;
    const breakeven = ticket > 0 ? Math.max(1, Math.ceil(BELLA_MONTHLY / ticket)) : 1;
    const roi = lostPerMonth > 0 ? lostPerMonth / BELLA_MONTHLY : 0;
    return {
      lostPerDay,
      lostPerWeek: lostPerDay * 5,
      lostPerMonth,
      lostPerYear: lostPerMonth * 12,
      breakeven,
      roi,
    };
  }, [callsMissed, conv, ticket, days]);

  function pickPreset(p: Preset) {
    setVertical(p.name);
    setTicket(p.ticket);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setErrMsg("");
    try {
      const res = await fetch("/api/roi-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          business: business || undefined,
          phone: phone || undefined,
          vertical,
          callsMissedPerDay: callsMissed,
          avgTicket: ticket,
          conversionPct: conv,
          businessDays: days,
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

  return (
    <>
      <a href="#main" className="skip">Skip to content</a>
      <Nav />
      <main id="main">
        <section className="wrap roi">
          <div className="roi-head">
            <span className="eyebrow">Free tool</span>
            <h1 className="roi-title">
              How much are missed calls costing your business?
            </h1>
            <p className="roi-sub">
              When a call hits voicemail, ~85% of people just dial the next business on
              Google. Here&apos;s the leak — and what Bella recovers.
            </p>
          </div>

          <div className="roi-grid">
            {/* INPUTS */}
            <div className="roi-card">
              <h2 className="roi-card-h">Your numbers</h2>

              <div className="roi-verts">
                {PRESETS.map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    className={"roi-vert" + (vertical === p.name ? " is-active" : "")}
                    onClick={() => pickPreset(p)}
                  >
                    {p.name}
                  </button>
                ))}
              </div>

              <label className="roi-label">Calls missed per day</label>
              <input
                type="number"
                className="roi-input"
                min={0}
                value={callsMissed}
                onChange={(e) => setCallsMissed(Math.max(0, +e.target.value || 0))}
              />

              <label className="roi-label">Average job / first ticket value</label>
              <div className="roi-money">
                <span>$</span>
                <input
                  type="number"
                  className="roi-input"
                  min={0}
                  step={10}
                  value={ticket}
                  onChange={(e) => setTicket(Math.max(0, +e.target.value || 0))}
                />
              </div>

              <label className="roi-label">
                Of missed callers, % who&apos;d have booked{" "}
                <b className="roi-rv">{conv}%</b>
              </label>
              <input
                type="range"
                min={5}
                max={60}
                step={5}
                value={conv}
                onChange={(e) => setConv(+e.target.value)}
              />

              <label className="roi-label">
                Business days per month <b className="roi-rv">{days}</b>
              </label>
              <input
                type="range"
                min={15}
                max={30}
                step={1}
                value={days}
                onChange={(e) => setDays(+e.target.value)}
              />
            </div>

            {/* RESULTS */}
            <div className="roi-card roi-out">
              <div className="roi-bigcap">Walking out the door / month</div>
              <div className="roi-big">{usd(r.lostPerMonth)}</div>
              <div className="roi-rows">
                <div className="roi-row"><span>Lost per day</span><b className="roi-lost">{usd(r.lostPerDay)}</b></div>
                <div className="roi-row"><span>Lost per week</span><b className="roi-lost">{usd(r.lostPerWeek)}</b></div>
                <div className="roi-row"><span>Lost per year</span><b className="roi-lost">{usd(r.lostPerYear)}</b></div>
                <div className="roi-row"><span>Bella costs</span><b className="roi-bella">${BELLA_MONTHLY} / mo</b></div>
              </div>
              <div className="roi-verdict">
                Bella pays for herself after just <b>{r.breakeven}</b> saved{" "}
                {r.breakeven === 1 ? "job" : "jobs"} a month.
                {r.roi >= 1 && (
                  <span className="roi-pill">
                    {r.roi >= 10 ? r.roi.toFixed(0) : r.roi.toFixed(1)}× return on the $147
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* LEAD CAPTURE */}
          <div className="roi-cta">
            {status === "done" ? (
              <div className="roi-done">
                <h3>Got it, {name.split(" ")[0] || "thanks"}. 🎉</h3>
                <p>
                  Your numbers are on their way to my inbox — I&apos;ll reach out about
                  your <b>free 2-week Bella pilot</b>. No card, your number stays the same.
                </p>
              </div>
            ) : (
              <form className="roi-form" onSubmit={submit}>
                <div className="roi-form-head">
                  <h3>Email me these numbers + claim my free 2-week pilot</h3>
                  <p>No card. Your phone number stays the same. Cancel anytime.</p>
                </div>
                <div className="roi-fields">
                  <input className="roi-input" placeholder="Your name" required
                    value={name} onChange={(e) => setName(e.target.value)} />
                  <input className="roi-input" placeholder="Business name"
                    value={business} onChange={(e) => setBusiness(e.target.value)} />
                  <input className="roi-input" type="email" placeholder="Email" required
                    value={email} onChange={(e) => setEmail(e.target.value)} />
                  <input className="roi-input" placeholder="Phone (optional)"
                    value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                {status === "error" && <p className="roi-err">{errMsg}</p>}
                <button className="roi-submit" type="submit" disabled={status === "sending"}>
                  {status === "sending" ? "Sending…" : "Send my results & start my pilot"}
                </button>
              </form>
            )}
          </div>

          <p className="roi-foot">
            Estimate only, based on your inputs and the industry ~85% voicemail-abandon
            rate. Not a guarantee of results. · Limitless · Peoria, IL
          </p>
        </section>
      </main>

      <style>{`
        .roi { padding-top: 56px; padding-bottom: 96px; }
        .roi-head { max-width: 720px; margin-bottom: 40px; }
        .roi-title { font-size: clamp(30px, 5vw, 52px); font-weight: 500; letter-spacing: -0.02em; line-height: 1.05; margin: 16px 0 14px; }
        .roi-sub { color: var(--ink-2); font-size: 18px; max-width: 620px; }
        .roi-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        @media (max-width: 820px) { .roi-grid { grid-template-columns: 1fr; } }
        .roi-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--r-lg); padding: 28px; box-shadow: var(--shadow-md); }
        .roi-card-h { font-size: 13px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--muted); margin-bottom: 20px; }
        .roi-verts { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 22px; }
        .roi-vert { flex: 1 1 30%; background: var(--surface-2); border: 1px solid var(--border); border-radius: 999px; padding: 9px 8px; font-size: 13px; transition: .15s; }
        .roi-vert:hover { border-color: var(--accent-line); }
        .roi-vert.is-active { background: var(--ink); color: var(--accent-ink); border-color: var(--ink); font-weight: 500; }
        .roi-label { display: block; font-size: 14px; color: var(--ink-2); margin: 16px 0 7px; }
        .roi-rv { color: var(--warm); font-weight: 600; }
        .roi-input { width: 100%; background: var(--surface-2); border: 1px solid var(--border-hi); border-radius: var(--r-sm); padding: 12px 13px; font: inherit; font-size: 16px; font-weight: 500; color: var(--ink); }
        .roi-input:focus { outline: none; border-color: var(--ink); }
        .roi-money { display: flex; align-items: center; gap: 8px; }
        .roi-money > span { color: var(--muted); font-size: 17px; }
        input[type=range] { width: 100%; accent-color: var(--ink); margin-top: 4px; }
        .roi-out { background: var(--ink); color: var(--accent-ink); border-color: var(--ink); }
        .roi-bigcap { font-size: 12px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--muted-2); margin-bottom: 6px; }
        .roi-big { font-size: clamp(44px, 8vw, 60px); font-weight: 600; letter-spacing: -0.02em; line-height: 1; color: #fff; margin-bottom: 22px; }
        .roi-rows { display: grid; gap: 2px; }
        .roi-row { display: flex; justify-content: space-between; align-items: baseline; padding: 11px 0; border-bottom: 1px solid rgba(255,255,255,0.1); }
        .roi-row > span { color: var(--muted-2); font-size: 14px; }
        .roi-row > b { font-size: 18px; font-weight: 600; color: #fff; }
        .roi-lost { color: #E9A6A6 !important; }
        .roi-bella { color: #A9C0EA !important; }
        .roi-verdict { margin-top: 20px; background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.12); border-radius: var(--r-md); padding: 16px; font-size: 15px; color: #fff; }
        .roi-verdict b { color: #fff; }
        .roi-pill { display: inline-block; margin-top: 10px; background: rgba(169,192,234,0.16); border: 1px solid rgba(169,192,234,0.4); color: #C7D6F2; border-radius: 999px; padding: 4px 12px; font-size: 13px; }
        .roi-cta { margin-top: 24px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--r-lg); padding: 28px; box-shadow: var(--shadow-md); }
        .roi-form-head h3, .roi-done h3 { font-size: 22px; font-weight: 500; letter-spacing: -0.01em; margin-bottom: 6px; }
        .roi-form-head p, .roi-done p { color: var(--ink-2); margin-bottom: 18px; }
        .roi-fields { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        @media (max-width: 560px) { .roi-fields { grid-template-columns: 1fr; } }
        .roi-submit { margin-top: 16px; width: 100%; background: var(--ink); color: var(--accent-ink); border-radius: 999px; padding: 15px; font-weight: 500; font-size: 16px; transition: .15s; }
        .roi-submit:hover { opacity: 0.9; }
        .roi-submit:disabled { opacity: 0.5; cursor: default; }
        .roi-err { color: var(--danger); margin-top: 12px; font-size: 14px; }
        .roi-done { text-align: left; }
        .roi-foot { margin-top: 24px; color: var(--muted); font-size: 13px; text-align: center; }
      `}</style>
    </>
  );
}
