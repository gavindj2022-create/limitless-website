"use client";

import { useEffect, useRef, useState } from "react";
import Nav from "@/components/Nav";

type Line = { who: "caller" | "bella"; text: string };

// The 2:47 AM booking call — adapted from the homepage NightShift flow so
// this preview stays self-contained.
const SCRIPT: Line[] = [
  { who: "caller", text: "Hi — sorry to call so late. Do you have anything open Thursday?" },
  { who: "bella", text: "No trouble at all — this is Bella, the after-hours assistant. Thursday I have 10:30 AM or 2:00 PM. Which suits you?" },
  { who: "caller", text: "2 PM works. It's for a color and cut — I'm Dana." },
  { who: "bella", text: "Booked: Dana, color and cut, Thursday 2:00 PM. You'll get a text confirmation in a moment. Anything else?" },
  { who: "caller", text: "That was easy. No, that's all — thank you!" },
];

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

function pickVoice(
  voices: SpeechSynthesisVoice[],
  wantFemale: boolean
): SpeechSynthesisVoice | undefined {
  if (!voices.length) return undefined;
  const en = voices.filter((v) => /^en([-_]|$)/i.test(v.lang));
  const pool = en.length ? en : voices;
  const female =
    /(female|samantha|victoria|zira|susan|karen|moira|tessa|fiona|serena|allison|ava|joanna|salli|kendra)/i;
  const male = /(male|daniel|alex|fred|david|mark|george|james|tom|matthew|guy)/i;

  if (wantFemale) {
    return (
      pool.find((v) => female.test(v.name)) ||
      pool.find((v) => /en[-_]US/i.test(v.lang)) ||
      pool[0]
    );
  }
  return (
    pool.find((v) => male.test(v.name) && !female.test(v.name)) ||
    pool.find((v, i) => i > 0 && /en[-_]US/i.test(v.lang)) ||
    pool[Math.min(1, pool.length - 1)]
  );
}

/**
 * Private preview player: types out the 2:47 AM call and, when supported,
 * speaks each line via the browser SpeechSynthesis API — a female-sounding
 * en-US voice for Bella, a contrasting voice for the caller. Falls back to
 * the typed animation only when audio is unavailable, and respects
 * prefers-reduced-motion (full conversation shown, audio still playable).
 */
export default function HearBella() {
  const [visible, setVisible] = useState(0);
  const [typed, setTyped] = useState(0);
  const [activeLine, setActiveLine] = useState(-1);
  const [booked, setBooked] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  // Default to "supported" so server and client first render match; the
  // effect flips it off only if the API is actually missing.
  const [audioSupported, setAudioSupported] = useState(true);

  const runIdRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const reducedRef = useRef(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    reducedRef.current = reduced;

    const supported = "speechSynthesis" in window;
    if (supported) {
      // Warm up the voice list (populates asynchronously in some browsers).
      window.speechSynthesis.getVoices();
    }

    // Defer initial state sync out of the effect body to avoid cascading
    // renders (matches the deferred pattern used in NightShift).
    const raf = requestAnimationFrame(() => {
      if (!supported) setAudioSupported(false);
      if (reduced) {
        setVisible(SCRIPT.length);
        setTyped(Infinity);
      }
    });

    return () => {
      cancelAnimationFrame(raf);
      runIdRef.current += 1;
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (supported) window.speechSynthesis.cancel();
    };
  }, []);

  function typeText(text: string, runId: number): Promise<void> {
    return new Promise((resolve) => {
      if (reducedRef.current) {
        setTyped(Infinity);
        resolve();
        return;
      }
      setTyped(0);
      let ch = 0;
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        if (runId !== runIdRef.current) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          resolve();
          return;
        }
        ch += 2;
        setTyped(ch);
        if (ch >= text.length) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          resolve();
        }
      }, 26);
    });
  }

  function speak(text: string, who: Line["who"], runId: number): Promise<void> {
    return new Promise((resolve) => {
      if (
        typeof window === "undefined" ||
        !("speechSynthesis" in window) ||
        runId !== runIdRef.current
      ) {
        resolve();
        return;
      }
      const u = new SpeechSynthesisUtterance(text);
      const v = pickVoice(window.speechSynthesis.getVoices(), who === "bella");
      if (v) u.voice = v;
      u.lang = v?.lang || "en-US";
      u.rate = who === "bella" ? 1 : 1.03;
      u.pitch = who === "bella" ? 1.08 : 0.92;
      u.onend = () => resolve();
      u.onerror = () => resolve();
      window.speechSynthesis.speak(u);
    });
  }

  async function play() {
    const runId = ++runIdRef.current;
    if (audioSupported) window.speechSynthesis.cancel();
    if (intervalRef.current) clearInterval(intervalRef.current);

    setStarted(true);
    setPlaying(true);
    setBooked(false);
    setActiveLine(-1);
    if (!reducedRef.current) {
      setVisible(0);
      setTyped(0);
    }

    for (let i = 0; i < SCRIPT.length; i++) {
      if (runId !== runIdRef.current) return;
      setActiveLine(i);
      if (!reducedRef.current) setVisible(i + 1);

      const line = SCRIPT[i];
      const typing = typeText(line.text, runId);
      const speaking = audioSupported
        ? speak(line.text, line.who, runId)
        : wait(reducedRef.current ? 650 : 900);
      await Promise.all([typing, speaking]);
      if (runId !== runIdRef.current) return;
      await wait(reducedRef.current ? 300 : 420);
    }

    if (runId === runIdRef.current) {
      setActiveLine(-1);
      setBooked(true);
      setPlaying(false);
    }
  }

  return (
    <>
      <a href="#main" className="skip">
        Skip to content
      </a>
      <Nav />
      <main id="main" className="hb-page">
        <section className="wrap hb-wrap">
          <div className="hb-head">
            <span className="xp-kicker">Private preview</span>
            <h1 className="hb-title">Hear Bella take a call</h1>
            <p className="hb-sub">
              A real after-hours booking, the way Bella runs it — typed out and
              spoken aloud. Press play and turn your sound on.
            </p>
            <div className="hb-controls">
              <button
                type="button"
                className="btn btn-world"
                onClick={play}
                disabled={playing}
              >
                {playing ? "Playing…" : started ? "Play again" : "Play the call"}
              </button>
              <button
                type="button"
                className="btn btn-ghost hb-replay"
                onClick={play}
                disabled={playing || !started}
              >
                Replay
              </button>
            </div>
            {!audioSupported && (
              <p className="hb-note hb-note-audio">
                Audio isn&apos;t available in this browser — showing the typed
                conversation.
              </p>
            )}
          </div>

          <div
            className="hb-convo"
            role="img"
            aria-label="After-hours call: Bella answers at 2:47 AM, offers Thursday times, and books Dana for a color and cut at 2 PM."
          >
            <div className="hb-convo-head">
              <span className="hb-live" /> Incoming call · 2:47 AM
            </div>
            <div className="hb-lines">
              {SCRIPT.slice(0, visible).map((line, i) => {
                const isCurrent = i === activeLine;
                const text =
                  isCurrent && typed !== Infinity
                    ? line.text.slice(0, typed)
                    : line.text;
                return (
                  <p key={i} className={`hb-bubble ${line.who}`}>
                    <b>{line.who === "bella" ? "Bella" : "Caller"}</b>
                    {text}
                    {isCurrent && typed < line.text.length ? (
                      <span className="hb-caret" />
                    ) : null}
                  </p>
                );
              })}
              {!started && visible === 0 && (
                <p className="hb-idle">Press play to start the call.</p>
              )}
            </div>
            <div className={`hb-booked${booked ? " on" : ""}`} aria-hidden={!booked}>
              <span className="hb-booked-tick">✓</span>
              <div>
                <b>Thursday · 2:00 PM — Dana, color &amp; cut</b>
                <small>Added to your calendar · confirmation sent · summary in your inbox</small>
              </div>
            </div>
          </div>

          <p className="hb-note">Private preview — not linked publicly.</p>
        </section>
      </main>
    </>
  );
}
