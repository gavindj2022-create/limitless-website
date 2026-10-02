"use client";

import Link from "next/link";
import { useRef, useState, type ReactNode } from "react";
import styles from "@/app/consulting.module.css";
import BuildLoop, { type BuildKind } from "@/components/BuildLoops";

export function AskBellaButton({ children, className, prompt }: { children: ReactNode; className?: string; prompt?: string }) {
  return <button type="button" className={className} onClick={() => window.dispatchEvent(new CustomEvent("bella:open", { detail: prompt ? { prompt } : undefined }))}>{children}</button>;
}

const details = {
  memory: {
    title: "Memory system",
    problem: "A business loses time when its plans, notes, and numbers are scattered.",
    built: "One shared memory for the business: notes, plans, and numbers. Our agents read it, so they always know what’s going on.",
    outcome: "The owner and agents can work from the same current context.",
  },
  inbox: {
    title: "Inbox and follow-up",
    problem: "Important messages and leads are easy to miss in a busy inbox.",
    built: "A private automation that sorts incoming messages and flags the follow-up that needs a person.",
    outcome: "The owner sees what needs attention without sorting every message by hand.",
  },
} as const;

function Loop({ kind }: { kind: BuildKind }) {
  return <BuildLoop kind={kind} />;
}

export default function WorkTiles() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [activeKey, setActiveKey] = useState<keyof typeof details>("memory");

  function openDetails(which: keyof typeof details) {
    setActiveKey(which);
    dialogRef.current?.showModal();
  }

  const active = details[activeKey];

  return (
    <>
      <div className={styles.workGrid}>
        <a className={styles.workTile} href="https://jewardllc.com" target="_blank" rel="noopener noreferrer"><Loop kind="site" /><span className={styles.tileLabel}>Website</span><strong>J.E. Ward</strong><span>Made to help people find the right local team.</span><span className={styles.tileGlyph} aria-hidden="true">↗</span></a>
        <button className={styles.workTile} type="button" onClick={() => openDetails("memory")}><Loop kind="memory" /><span className={styles.tileLabel}>Connected knowledge</span><strong>Memory system</strong><span>One shared memory for the business.</span><span className={styles.tileGlyph} aria-hidden="true">+</span></button>
        <AskBellaButton className={styles.workTile}><Loop kind="bella" /><span className={styles.tileLabel}>Phone agent</span><strong>Bella, front desk</strong><span>Ask Bella what an agent can handle.</span><span className={styles.tileGlyph} aria-hidden="true">+</span></AskBellaButton>
        <button className={styles.workTile} type="button" onClick={() => openDetails("inbox")}><Loop kind="inbox" /><span className={styles.tileLabel}>Automation</span><strong>Inbox and follow-up</strong><span>Clearer next steps for incoming leads.</span><span className={styles.tileGlyph} aria-hidden="true">+</span></button>
        <a className={styles.workTile} href="https://limitless-demo-websites.pages.dev" target="_blank" rel="noopener noreferrer"><Loop kind="gallery" /><span className={styles.tileLabel}>Gallery</span><strong>Demo sites</strong><span>See different ways a site can work.</span><span className={styles.tileGlyph} aria-hidden="true">↗</span></a>
        <AskBellaButton className={styles.workTile} prompt="Tell me what you need built."><Loop kind="build" /><span className={styles.tileLabel}>Made for you</span><strong>Custom builds</strong><span>Got something unique? We build agents around how you work.</span><span className={styles.tileGlyph} aria-hidden="true">+</span></AskBellaButton>
      </div>
      <p className={styles.workPhone}>Want to hear the front desk agent? <a href="tel:+13123131478">Call (312) 313-1478</a>.</p>
      <dialog ref={dialogRef} className={styles.workDialog} aria-labelledby="work-dialog-title" onClose={() => setActiveKey("memory")}>
        <button type="button" className={styles.dialogClose} aria-label="Close details" onClick={() => dialogRef.current?.close()}>×</button>
        <span className={styles.kicker}>Our work</span>
        <h2 id="work-dialog-title">{active.title}</h2>
        <dl>
          <dt>The problem</dt><dd>{active.problem}</dd>
          <dt>What we built</dt><dd>{active.built}</dd>
          <dt>What it does for the owner</dt><dd>{active.outcome}</dd>
        </dl>
        <Link href="/book" className={styles.pill} onClick={() => dialogRef.current?.close()}>Book a free audit</Link>
      </dialog>
    </>
  );
}
