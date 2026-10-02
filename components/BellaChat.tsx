"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import type { AuditAnswers, AuditField } from "@/lib/bella-audit";
import type { BellaChip } from "@/lib/bella-faq-match";
import s from "./BellaChat.module.css";

type ChatMessage = { role: "user" | "assistant"; text: string };
type ChatReply = { reply?: string; chips?: BellaChip[]; field?: AuditField; complete?: boolean };
const storageKey = "limitless-bella-chat-v1";
const calendarUrl = "https://calendar.app.google/CaCfThGeGv6bMpXX9";
const phoneHref = "tel:+13123131478";

const greeting: Record<string, string> = {
  "/": "Hi, I'm Bella. Want to find where AI fits your business? Ask me anything.",
  "/how-we-help": "Not sure if you need Advise, Build, or Train? I can help you pick.",
  "/work": "Want me to explain any of these builds?",
  "/about": "Want to set up a call with Gavin? I can help.",
  "/faq": "Didn't see your question? Ask me.",
  "/book": "Need help filling this out? Tell me about your business and I'll pass it to Gavin.",
};

const starterChips: BellaChip[] = [
  { label: "What do you do?", action: "ask", value: "What do you do?" },
  { label: "How much does it cost?", action: "ask", value: "How much does it cost?" },
  { label: "Run my free mini audit", action: "audit" },
  { label: "Book a free audit", action: "book" },
];

function Mark() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><path d="M8.2 8.6c-2-1.9-5.2-.5-5.2 3.4s3.2 5.3 5.2 3.4L15.8 8.6c2-1.9 5.2-.5 5.2 3.4s-3.2 5.3-5.2 3.4z" /></svg>;
}

export default function BellaChat() {
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);
  const [panelReady, setPanelReady] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chips, setChips] = useState<BellaChip[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [audit, setAudit] = useState<Partial<AuditAnswers>>({});
  const [auditField, setAuditField] = useState<AuditField | null>(null);
  const [awaitingLead, setAwaitingLead] = useState(false);
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [sessionId, setSessionId] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const busyRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    const restoreTimer = window.setTimeout(() => {
      if (cancelled) return;
      try {
        const saved = JSON.parse(sessionStorage.getItem(storageKey) || "null");
        if (saved && Array.isArray(saved.messages)) {
          setMessages(saved.messages.filter((m: ChatMessage) => (m.role === "user" || m.role === "assistant") && typeof m.text === "string").slice(-20));
          if (saved.audit && typeof saved.audit === "object") setAudit(saved.audit);
          if (typeof saved.auditField === "string") setAuditField(saved.auditField);
          if (typeof saved.awaitingLead === "boolean") setAwaitingLead(saved.awaitingLead);
        }
        setSessionId(typeof saved?.sessionId === "string" && /^[0-9a-f-]{36}$/i.test(saved.sessionId) ? saved.sessionId : crypto.randomUUID());
      } catch {
        setSessionId(crypto.randomUUID());
      }
    }, 0);
    const id = window.requestIdleCallback?.(() => setPanelReady(true)) ?? window.setTimeout(() => setPanelReady(true), 1200);
    return () => {
      cancelled = true;
      window.clearTimeout(restoreTimer);
      if (window.cancelIdleCallback && typeof id === "number") window.cancelIdleCallback(id);
      else window.clearTimeout(id);
    };
  }, []);

  useEffect(() => {
    if (!sessionId) return;
    try { sessionStorage.setItem(storageKey, JSON.stringify({ messages: messages.slice(-20), audit, auditField, awaitingLead, sessionId })); } catch { /* Storage can be unavailable. */ }
  }, [messages, audit, auditField, awaitingLead, sessionId]);

  // Keep the newest message in view.
  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [messages, busy, open, awaitingLead]);

  useEffect(() => { if (open && panelReady) inputRef.current?.focus(); }, [open, panelReady, awaitingLead]);

  const addMessage = useCallback((role: ChatMessage["role"], text: string) => {
    setMessages((current) => [...current, { role, text }].slice(-20));
  }, []);

  const chat = useCallback(async (body: Record<string, unknown>): Promise<ChatReply | null> => {
    try {
      const response = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!response.ok) return null;
      return await response.json();
    } catch { return null; }
  }, []);

  const startAudit = useCallback(async () => {
    if (busyRef.current) return;
    busyRef.current = true;
    setBusy(true);
    setAudit({});
    setAwaitingLead(false);
    setChips([]);
    const id = sessionId || crypto.randomUUID();
    if (!sessionId) setSessionId(id);
    addMessage("user", "Run my free mini audit");
    const reply = await chat({ action: "audit", answers: {}, sessionId: id, page: pathname });
    addMessage("assistant", reply?.reply ? `Great, four quick questions. ${reply.reply}` : "Great, four quick questions. What kind of business do you run?");
    setAuditField(reply?.field || "businessType");
    busyRef.current = false;
    setBusy(false);
  }, [addMessage, chat, pathname, sessionId]);

  useEffect(() => {
    function onOpen(event: Event) {
      setPanelReady(true);
      setOpen(true);
      const detail = (event as CustomEvent<{ action?: string; prompt?: string }>).detail;
      if (detail?.action === "audit") void startAudit();
      else if (detail?.prompt) setInput(detail.prompt);
    }
    window.addEventListener("bella:open", onOpen);
    return () => window.removeEventListener("bella:open", onOpen);
  }, [startAudit]);

  const close = useCallback(() => {
    setOpen(false);
    window.setTimeout(() => launcherRef.current?.focus(), 0);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  function restart() {
    setMessages([]);
    setChips([]);
    setAudit({});
    setAuditField(null);
    setAwaitingLead(false);
    setInput("");
    inputRef.current?.focus();
  }

  async function send(message: string) {
    if (!message || busyRef.current) return;
    busyRef.current = true;
    setInput("");
    addMessage("user", message);
    setBusy(true);
    setChips([]);
    if (auditField) {
      const answers = { ...audit, [auditField]: message };
      setAudit(answers);
      const reply = await chat({ action: "audit", answers, sessionId: sessionId || crypto.randomUUID(), page: pathname });
      addMessage("assistant", reply?.reply || "I couldn't finish that just now. Gavin can help on a free audit call.");
      setAuditField(reply?.field || null);
      if (reply?.complete) setAwaitingLead(true);
      setChips(reply?.chips || []);
    } else {
      const reply = await chat({ action: "ask", message, page: pathname });
      addMessage("assistant", reply?.reply || "I couldn't answer just now. Please book a free audit and ask Gavin directly.");
      setChips(reply?.chips || []);
    }
    busyRef.current = false;
    setBusy(false);
  }

  function submitMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void send(input.trim());
  }

  async function submitLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busyRef.current) return;
    busyRef.current = true;
    setBusy(true);
    const message = `Bella mini audit\nBusiness type: ${audit.businessType || ""}\nBiggest time sink: ${audit.timeSink || ""}\nCalls and leads now: ${audit.leadHandling || ""}\nCurrent tools: ${audit.currentTools || ""}`;
    try {
      const response = await fetch("/api/audit-lead", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source: "bella", name: leadName, email: leadEmail, phone: "", company: "", message, page: pathname, website: honeypot }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.ok !== true) throw new Error("lead failed");
      setAwaitingLead(false);
      setAudit({});
      setLeadName("");
      setLeadEmail("");
      addMessage("assistant", `Thanks, ${leadName.split(" ")[0] || "got it"}! Gavin will reach out soon. You can also pick a time for your free audit now.`);
      setChips([{ label: "Book a free audit", action: "book" }]);
    } catch {
      addMessage("assistant", "That didn't send. Please try again or email limitlessgav@gmail.com directly.");
    } finally {
      busyRef.current = false;
      setBusy(false);
    }
  }

  function renderChip(chip: BellaChip) {
    if (chip.action === "book") return <a key={chip.label} href="/book" className={`${s.chip} ${s.chipPrimary}`}>{chip.label}</a>;
    if (chip.action === "call") return <a key={chip.label} href={phoneHref} className={s.chip}>{chip.label}</a>;
    return <button key={chip.label} type="button" className={s.chip} disabled={busy} onClick={() => chip.action === "audit" ? void startAudit() : void send(chip.value || chip.label)}>{chip.label}</button>;
  }

  const visibleChips = chips.length ? chips : messages.length === 0 ? starterChips : [];

  return (
    <div className={s.root}>
      {!open && (
        <button ref={launcherRef} type="button" className={s.launcher} onClick={() => { setPanelReady(true); setOpen(true); }} aria-label="Ask Bella, our Front Desk Agent" aria-haspopup="dialog">
          <span className={s.avatar} aria-hidden="true"><Mark /></span>
          <span className={s.launchText}><strong>Ask Bella</strong><small><span className={s.live} />Front Desk Agent</small></span>
        </button>
      )}
      {open && panelReady && (
        <section className={s.panel} role="dialog" aria-modal="false" aria-labelledby="bella-title">
          <header className={s.head}>
            <span className={s.avatar} aria-hidden="true"><Mark /></span>
            <span className={s.headText}><strong id="bella-title">Bella</strong><small><span className={s.live} />Front Desk Agent · replies instantly</small></span>
            <button type="button" className={s.iconBtn} onClick={restart} aria-label="Start a new chat" title="Start over"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /></svg></button>
            <button type="button" className={s.iconBtn} onClick={close} aria-label="Close Bella chat"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg></button>
          </header>
          <div ref={logRef} className={s.log} role="log" aria-live="polite" aria-relevant="additions">
            {messages.length === 0 && (
              <div className={s.row}><span className={`${s.avatar} ${s.avatarSm}`} aria-hidden="true"><Mark /></span><p className={`${s.bubble} ${s.bot}`}>{greeting[pathname] || greeting["/"]}</p></div>
            )}
            {messages.map((message, index) => message.role === "user"
              ? <div key={index} className={`${s.row} ${s.rowUser}`}><p className={`${s.bubble} ${s.user}`}>{message.text}</p></div>
              : <div key={index} className={s.row}><span className={`${s.avatar} ${s.avatarSm}`} aria-hidden="true"><Mark /></span><p className={`${s.bubble} ${s.bot}`}>{message.text}</p></div>)}
            {busy && <div className={s.row}><span className={`${s.avatar} ${s.avatarSm}`} aria-hidden="true"><Mark /></span><p className={`${s.bubble} ${s.bot} ${s.typing}`} aria-label="Bella is typing"><i /><i /><i /></p></div>}
          </div>
          {visibleChips.length > 0 && !awaitingLead && <div className={s.chips}>{visibleChips.map(renderChip)}</div>}
          {awaitingLead ? (
            <form onSubmit={submitLead} className={s.lead}>
              <label>Your name<input ref={inputRef} value={leadName} onChange={(event) => setLeadName(event.target.value)} maxLength={120} autoComplete="name" required /></label>
              <label>Email<input value={leadEmail} onChange={(event) => setLeadEmail(event.target.value)} type="email" maxLength={160} autoComplete="email" required /></label>
              <label className={s.srOnly} aria-hidden="true">Website<input value={honeypot} onChange={(event) => setHoneypot(event.target.value)} tabIndex={-1} autoComplete="off" /></label>
              <button type="submit" disabled={busy} className={s.leadBtn}>{busy ? "Sending..." : "Pass this to Gavin"}</button>
            </form>
          ) : (
            <form onSubmit={submitMessage} className={s.composer}>
              <label htmlFor="bella-message" className={s.srOnly}>Message Bella</label>
              <input ref={inputRef} id="bella-message" value={input} onChange={(event) => setInput(event.target.value)} maxLength={600} placeholder={auditField ? "Type your answer..." : "Ask Bella anything..."} autoComplete="off" />
              <button type="submit" className={s.send} disabled={busy || !input.trim()} aria-label="Send"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg></button>
            </form>
          )}
          <div className={s.foot}>
            <a href="/privacy-security"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="5" y="10" width="14" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></svg>Your info stays private</a>
            <a href={calendarUrl} target="_blank" rel="noopener noreferrer">Open the calendar ↗</a>
          </div>
        </section>
      )}
    </div>
  );
}
