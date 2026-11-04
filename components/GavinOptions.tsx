"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import styles from "@/app/gavin/gavin.module.css";

const CALENDAR_EMBED =
  "https://calendar.google.com/calendar/appointments/schedules/AcZssZ0j-EATXmBTsJedxjQh9EA4TsMcSuJ7MWYN2Lxy3123xAcsElUCsgGi3Rjals4jjCT-LtlIUXn0?gv=true";
const CELL = "+13093402657";

type Open = "none" | "book" | "callback";

export default function GavinOptions() {
  const [open, setOpen] = useState<Open>("none");
  const toggle = (next: Open) => setOpen((current) => (current === next ? "none" : next));

  return (
    <div className={styles.options}>
      <button type="button" className={`${styles.option} ${styles.primary}`} aria-expanded={open === "book"} onClick={() => toggle("book")}>
        <span className={styles.icon} aria-hidden="true">📅</span>
        <span className={styles.label}><strong>Book a Strategy Call</strong><span className={styles.hint}>Free · 30 min · scroll the calendar to pick a time</span></span>
        <span className={styles.chev} aria-hidden="true">{open === "book" ? "−" : "+"}</span>
      </button>
      {open === "book" && (
        <div className={`${styles.panel} ${styles.panelCal}`}>
          <CalendarEmbed />
        </div>
      )}

      <button type="button" className={styles.option} aria-expanded={open === "callback"} onClick={() => toggle("callback")}>
        <span className={styles.icon} aria-hidden="true">📞</span>
        <span className={styles.label}><strong>Call me back</strong><span className={styles.hint}>Leave your number and a good time</span></span>
        <span className={styles.chev} aria-hidden="true">{open === "callback" ? "−" : "+"}</span>
      </button>
      {open === "callback" && <div className={styles.panel}><CallbackForm /></div>}

      <a className={styles.option} href={`sms:${CELL}`}>
        <span className={styles.icon} aria-hidden="true">💬</span>
        <span className={styles.label}><strong>Text me now</strong><span className={styles.hint}>309-340-2657</span></span>
        <span className={styles.chev} aria-hidden="true">→</span>
      </a>

      <Link className={styles.option} href="/">
        <span className={styles.icon} aria-hidden="true">✦</span>
        <span className={styles.label}><strong>See what I do</strong><span className={styles.hint}>golimitlessagi.com</span></span>
        <span className={styles.chev} aria-hidden="true">→</span>
      </Link>
    </div>
  );
}

/** Google's booking page, plus a fade and arrow that tell people to scroll inside it.
 * The page can't see scrolling inside Google's frame, so the hint hides once they tap into it. */
function CalendarEmbed() {
  const frame = useRef<HTMLIFrameElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const onBlur = () => {
      // Focus moving into the iframe blurs this window.
      window.setTimeout(() => {
        if (document.activeElement === frame.current) setSeen(true);
      }, 0);
    };
    window.addEventListener("blur", onBlur);
    return () => window.removeEventListener("blur", onBlur);
  }, []);

  return (
    <div className={`${styles.calWrap} ${seen ? styles.calSeen : ""}`}>
      <iframe ref={frame} className={styles.calendar} src={CALENDAR_EMBED} title="Book a free 30-minute strategy call" loading="lazy" />
      <div className={styles.calFade} aria-hidden="true">
        <b>Scroll for times</b>
        <span className={styles.calArrow}>⌄</span>
      </div>
    </div>
  );
}

function CallbackForm() {
  const [values, setValues] = useState({ name: "", phone: "", bestTime: "Anytime", website: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!values.name.trim() || values.phone.replace(/\D/g, "").length < 10) {
      setStatus("error");
      setError("Add your name and a 10-digit phone number.");
      return;
    }
    setStatus("sending");
    setError("");
    try {
      const response = await fetch("/api/callback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "That didn't go through. Try again, or text me instead.");
      setStatus("sent");
    } catch (cause) {
      setStatus("error");
      setError(cause instanceof Error ? cause.message : "That didn't go through. Try again, or text me instead.");
    }
  }

  if (status === "sent") {
    return <p className={styles.done} role="status"><strong>Got it, thanks!</strong>I&apos;ll call you back soon.</p>;
  }

  return (
    <form className={styles.form} onSubmit={submit} noValidate>
      <div className={styles.field}>
        <label htmlFor="cb-name">Name</label>
        <input id="cb-name" autoComplete="name" maxLength={120} value={values.name} onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))} />
      </div>
      <div className={styles.field}>
        <label htmlFor="cb-phone">Phone</label>
        <input id="cb-phone" type="tel" inputMode="tel" autoComplete="tel" maxLength={40} value={values.phone} onChange={(e) => setValues((v) => ({ ...v, phone: e.target.value }))} />
      </div>
      <div className={styles.field}>
        <label htmlFor="cb-time">Best time</label>
        <select id="cb-time" value={values.bestTime} onChange={(e) => setValues((v) => ({ ...v, bestTime: e.target.value }))}>
          <option>Anytime</option>
          <option>Morning</option>
          <option>Afternoon</option>
          <option>Evening</option>
        </select>
      </div>
      <div className={styles.honeypot} aria-hidden="true">
        <label htmlFor="cb-website">Website</label>
        <input id="cb-website" tabIndex={-1} autoComplete="off" value={values.website} onChange={(e) => setValues((v) => ({ ...v, website: e.target.value }))} />
      </div>
      {status === "error" && <p className={styles.error} role="alert">{error}</p>}
      <button className={styles.submit} type="submit" disabled={status === "sending"}>{status === "sending" ? "Sending…" : "Call me back"}</button>
    </form>
  );
}
