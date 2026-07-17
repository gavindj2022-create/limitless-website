"use client";

import { useEffect, useRef, useState } from "react";

const SCRIPT = [
  { who: "caller" as const, text: "Hi — sorry to call so late. Do you have anything open Thursday?" },
  { who: "bella" as const, text: "No trouble at all — this is Bella, the after-hours assistant. Thursday I have 10:30 AM or 2:00 PM. Which suits you?" },
  { who: "caller" as const, text: "2 PM works. It's for a color and cut — I'm Dana." },
  { who: "bella" as const, text: "Booked: Dana, color & cut, Thursday 2:00 PM. You'll get a text confirmation in a moment. Anything else?" },
  { who: "caller" as const, text: "That was easy. No, that's all — thank you!" },
];

/**
 * The 2:47 AM conversation: types itself line by line when scrolled into
 * view, then lands the booking card. Runs once per visit; reduced-motion
 * users see the finished conversation immediately.
 */
export default function NightShift() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [visibleLines, setVisibleLines] = useState(0);
  const [typedChars, setTypedChars] = useState(0);
  const [booked, setBooked] = useState(false);
  const startedRef = useRef(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const begin = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      if (reduced) {
        setVisibleLines(SCRIPT.length);
        setTypedChars(Infinity);
        setBooked(true);
        return;
      }
      let line = 0;
      const typeLine = () => {
        if (line >= SCRIPT.length) {
          setTimeout(() => setBooked(true), 500);
          return;
        }
        setVisibleLines(line + 1);
        setTypedChars(0);
        const text = SCRIPT[line].text;
        let ch = 0;
        const iv = setInterval(() => {
          ch += 2;
          setTypedChars(ch);
          if (ch >= text.length) {
            clearInterval(iv);
            line += 1;
            setTimeout(typeLine, 550);
          }
        }, 24);
      };
      setTimeout(typeLine, 600);
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
    return () => io.disconnect();
  }, []);

  return (
    <div ref={rootRef} className="night-convo" role="img"
      aria-label="Example after-hours call: Bella answers at 2:47 AM, offers Thursday times, and books Dana for a color and cut at 2 PM.">
      <div className="night-convo-head">
        <span className="night-live" /> Incoming call · 2:47 AM
      </div>
      <div className="night-lines">
        {SCRIPT.slice(0, visibleLines).map((line, i) => {
          const isCurrent = i === visibleLines - 1;
          const text = isCurrent && typedChars !== Infinity
            ? line.text.slice(0, typedChars)
            : line.text;
          return (
            <p key={i} className={`night-bubble ${line.who}`}>
              <b>{line.who === "bella" ? "Bella" : "Caller"}</b>
              {text}
              {isCurrent && typedChars < line.text.length ? <span className="night-caret" /> : null}
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
