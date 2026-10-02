"use client";

import { FormEvent, useState } from "react";
import s from "./BellaChat.module.css";

type Answer = { reply?: string };

export default function FaqAsk() {
  const [question, setQuestion] = useState("");
  const [asked, setAsked] = useState("");
  const [answer, setAnswer] = useState("");
  const [busy, setBusy] = useState(false);

  async function ask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = question.trim();
    if (!message || busy) return;
    setBusy(true);
    setAsked(message);
    setAnswer("");
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "ask", message, page: window.location.pathname }),
      });
      if (!response.ok) throw new Error("request failed");
      const data: Answer = await response.json();
      setAnswer(typeof data.reply === "string" ? data.reply : "Please try again.");
      setQuestion("");
    } catch {
      setAnswer("Bella could not answer just now. You can book a free audit and ask Gavin directly.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section aria-labelledby="faq-ask-title" style={{ padding: "clamp(22px,4vw,34px)", borderRadius: 24, background: "#F1EEE9", display: "grid", gap: 14 }}>
      <div>
        <h2 id="faq-ask-title" style={{ margin: 0 }}>Ask Bella.</h2>
        <p style={{ margin: "8px 0 0", color: "#4C4B48" }}>Ask a quick question, or try a free mini audit for your business.</p>
      </div>
      <form onSubmit={ask} className={s.composer} style={{ margin: 0 }}>
        <label htmlFor="faq-ask-question" className={s.srOnly}>Your question for Bella</label>
        <input id="faq-ask-question" value={question} onChange={(event) => setQuestion(event.target.value)} maxLength={600} placeholder="What would you like to know?" required autoComplete="off" />
        <button className={s.send} disabled={busy || !question.trim()} aria-label={busy ? "Asking Bella" : "Ask Bella"}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </button>
      </form>
      <div aria-live="polite" style={{ display: "grid", gap: 8 }}>
        {asked && <div className={`${s.row} ${s.rowUser}`}><p className={`${s.bubble} ${s.user}`} style={{ margin: 0 }}>{asked}</p></div>}
        {busy && <div className={s.row}><p className={`${s.bubble} ${s.bot} ${s.typing}`} style={{ margin: 0 }} aria-label="Bella is typing"><i /><i /><i /></p></div>}
        {answer && <div className={s.row}><p className={`${s.bubble} ${s.bot}`} style={{ margin: 0 }}>{answer}</p></div>}
      </div>
      <div>
        <button type="button" className={s.chip} onClick={() => window.dispatchEvent(new CustomEvent("bella:open", { detail: { action: "audit" } }))}>Run my free mini audit</button>
      </div>
    </section>
  );
}
