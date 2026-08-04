"use client";

import { useEffect, useRef, useState } from "react";

const SCRIPT = [
  { who: "caller" as const, text: "Hi — sorry to call so late. Do you have anything open Thursday?" },
  { who: "bella" as const, text: "No trouble at all — this is Bella, the after-hours assistant. Thursday I have 10:30 AM or 2:00 PM. Which suits you?" },
  { who: "caller" as const, text: "2 PM works. It's for a color and cut — I'm Dana." },
  { who: "bella" as const, text: "Booked: Dana, color & cut, Thursday 2:00 PM. You'll get a text confirmation in a moment. Anything else?" },
  { who: "caller" as const, text: "That was easy. No, that's all — thank you!" },
];

const FRAME_MS = 33;   // ~30fps
const CHARS_PER_FRAME = 3; // keeps the original typing speed at fewer frames

/**
 * The 2:47 AM conversation: types itself line by line when scrolled into
 * view, then lands the booking card. Runs once per visit; reduced-motion
 * users see the finished conversation immediately.
 *
 * Only line changes go through React state (6 renders total). The
 * character-by-character typing writes to a text node through a ref, because
 * putting it in state cost ~200 renders of this subtree for one playthrough.
 */
export default function NightShift() {
  const rootRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const caretRef = useRef<HTMLSpanElement>(null);
  const [visibleLines, setVisibleLines] = useState(0);
  const [booked, setBooked] = useState(false);
  const [instant, setInstant] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    let timer: ReturnType<typeof setTimeout> | null = null;
    let started = false;
    let cancelled = false;

    const begin = () => {
      if (started) return;
      started = true;

      if (reduced) {
        setInstant(true);
        setVisibleLines(SCRIPT.length);
        setBooked(true);
        return;
      }

      let line = 0;

      const typeLine = () => {
        if (cancelled) return;
        if (line >= SCRIPT.length) {
          timer = setTimeout(() => setBooked(true), 500);
          return;
        }
        // Advancing the line count is the only React render in this loop.
        setVisibleLines(line + 1);

        const text = SCRIPT[line].text;
        let ch = 0;
        let last = 0;

        const type = (now: number) => {
          if (cancelled) return;
          if (now - last >= FRAME_MS) {
            last = now;
            ch += CHARS_PER_FRAME;
            if (textRef.current) textRef.current.textContent = text.slice(0, ch);
            if (ch >= text.length) {
              if (caretRef.current) caretRef.current.style.display = "none";
              line += 1;
              timer = setTimeout(typeLine, 550);
              return;
            }
          }
          raf = requestAnimationFrame(type);
        };
        raf = requestAnimationFrame(type);
      };

      timer = setTimeout(typeLine, 600);
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          begin();
          io.disconnect();
        }
      },
      { threshold: 0.45 }
    );
    io.observe(root);

    // The original interval was never cleared on unmount, which leaked a
    // running timer plus setState calls into an unmounted tree.
    return () => {
      cancelled = true;
      io.disconnect();
      cancelAnimationFrame(raf);
      if (timer) clearTimeout(timer);
    };
  }, []);

  return (
    <div ref={rootRef} className="night-convo" role="img"
      aria-label="Example after-hours call: Bella answers at 2:47 AM, offers Thursday times, and books Dana for a color and cut at 2 PM.">
      <div className="night-convo-head">
        <span className="night-live" /> Incoming call · 2:47 AM
      </div>
      <div className="night-lines">
        {SCRIPT.slice(0, visibleLines).map((line, i) => {
          const isCurrent = i === visibleLines - 1 && !instant;
          return (
            <p key={i} className={`night-bubble ${line.who}`}>
              <b>{line.who === "bella" ? "Bella" : "Caller"}</b>
              {/* The current line's text is filled in by the typing loop. */}
              <span ref={isCurrent ? textRef : null}>
                {isCurrent ? "" : line.text}
              </span>
              {isCurrent ? (
                <span className="night-caret" ref={caretRef} />
              ) : null}
            </p>
          );
        })}
      </div>
      <div className={`night-booked${booked ? " on" : ""}`} aria-hidden={!booked}>
        <span className="night-booked-tick">✓</span>
        <div>
          <b>Thursday · 2:00 PM — Dana, color &amp; cut</b>
          <small>Added to your calendar · confirmation sent · summary in your inbox</small>
        </div>
      </div>
    </div>
  );
}
