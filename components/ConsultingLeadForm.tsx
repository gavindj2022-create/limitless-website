"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import styles from "@/app/consulting.module.css";

type Field = "name" | "email" | "phone" | "message";
type Issues = Partial<Record<Field, string[]>>;

export default function ConsultingLeadForm() {
  const [values, setValues] = useState({ name: "", email: "", phone: "", message: "", website: "" });
  const [issues, setIssues] = useState<Issues>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const local: Issues = {};
    if (!values.name.trim()) local.name = ["Name is required"];
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) local.email = ["Enter a valid email address"];
    if (!values.message.trim()) local.message = ["Tell us what you need help with"];
    if (Object.keys(local).length) {
      setIssues(local);
      setStatus("error");
      setError("Please fix the highlighted fields.");
      document.getElementById(Object.keys(local)[0])?.focus();
      return;
    }
    setStatus("sending");
    setIssues({});
    setError("");
    try {
      const response = await fetch("/api/audit-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, company: "", source: "book", page: "/book" }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        if (result.issues) {
          setIssues(result.issues as Issues);
          throw new Error("Please fix the highlighted fields.");
        }
        throw new Error(result.error || "Your request could not be sent. Please try again.");
      }
      setStatus("sent");
      setValues({ name: "", email: "", phone: "", message: "", website: "" });
    } catch (cause) {
      setStatus("error");
      setError(cause instanceof Error ? cause.message : "Your request could not be sent. Please try again.");
    }
  }

  if (status === "sent") return <div className={styles.formSuccess} role="status"><h2>Got it.</h2><p>Gavin will reach out soon.</p></div>;

  const fields: { key: Field; label: string; type?: string; required?: boolean; autoComplete?: string }[] = [
    { key: "name", label: "Name", required: true, autoComplete: "name" },
    { key: "email", label: "Email", type: "email", required: true, autoComplete: "email" },
    { key: "phone", label: "Phone (optional)", type: "tel", autoComplete: "tel" },
  ];

  return <form className={styles.leadForm} onSubmit={submit} noValidate>
    {fields.map((field) => <div className={styles.formField} key={field.key}>
      <label htmlFor={field.key}>{field.label}</label>
      <input id={field.key} name={field.key} type={field.type || "text"} required={field.required} autoComplete={field.autoComplete} maxLength={field.key === "phone" ? 40 : 200} value={values[field.key]} aria-invalid={Boolean(issues[field.key])} aria-describedby={issues[field.key] ? `${field.key}-error` : undefined} onChange={(event) => setValues((current) => ({ ...current, [field.key]: event.target.value }))} />
      {issues[field.key] && <p id={`${field.key}-error`} className={styles.fieldError}>{issues[field.key]?.[0]}</p>}
    </div>)}
    <div className={styles.formField}>
      <label htmlFor="message">What would you like help with?</label>
      <textarea id="message" name="message" required rows={5} maxLength={2000} value={values.message} aria-invalid={Boolean(issues.message)} aria-describedby={issues.message ? "message-error" : undefined} onChange={(event) => setValues((current) => ({ ...current, message: event.target.value }))} />
      {issues.message && <p id="message-error" className={styles.fieldError}>{issues.message[0]}</p>}
    </div>
    <div className={styles.honeypot} aria-hidden="true"><label htmlFor="website">Website</label><input id="website" name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={(event) => setValues((current) => ({ ...current, website: event.target.value }))} /></div>
    {status === "error" && <p className={styles.formError} role="alert">{error}</p>}
    <button className={styles.pill} type="submit" disabled={status === "sending"}>{status === "sending" ? "Sending…" : "Book my free audit"}</button>
    <p className={styles.formNote}>Goes straight to Gavin. He’ll reach out soon.</p>
    <p className={styles.privacyNote}>
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <rect x="5" y="10" width="14" height="10" rx="2" />
        <path d="M8.5 10V7.5a3.5 3.5 0 0 1 7 0V10" />
      </svg>
      <span>Your info stays private. <Link href="/privacy-security">Privacy and security</Link></span>
    </p>
  </form>;
}
