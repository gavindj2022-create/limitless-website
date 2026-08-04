"use client";

import { useState, useEffect, useRef, type CSSProperties } from "react";

const CYCLE_MS = 4000;
const FADE_MS = 300;

const DEMO_SCENARIOS = [
  {
    title: "Bella answers",
    tasks: [
      { label: "Call answered before voicemail", status: "done" as const },
      { label: "Service and preferred time collected", status: "done" as const },
      { label: "Appointment booked for Thursday at 2:00 PM", status: "done" as const },
      { label: "Summary sent to the owner", status: "active" as const },
    ],
  },
  {
    title: "Website chat",
    tasks: [
      { label: "Visitor asks about pricing and availability", status: "done" as const },
      { label: "AI answers from your business details", status: "done" as const },
      { label: "Lead form completed with phone and email", status: "done" as const },
      { label: "Consultation request saved", status: "active" as const },
    ],
  },
  {
    title: "Owner summary",
    tasks: [
      { label: "3 calls answered after hours", status: "done" as const },
      { label: "2 bookings added to the calendar", status: "done" as const },
      { label: "4 website leads captured", status: "done" as const },
      { label: "Follow-up queue ready for review", status: "active" as const },
    ],
  },
];

/**
 * Rotating "what an agent handled" panel.
 *
 * The crossfade and the staggered row entry are pure CSS (keyframes keyed on
 * the row index), and the rotation timer only runs while the panel is on
 * screen and the tab is visible. It previously ran a GSAP timeline on a
 * forever-ticking interval, even with the panel scrolled well out of view.
 */
export default function HeroDemoPanel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    let interval: ReturnType<typeof setInterval> | null = null;
    let fade: ReturnType<typeof setTimeout> | null = null;
    let onScreen = false;

    const advance = () => {
      setLeaving(true);
      fade = setTimeout(() => {
        setActiveIndex((prev) => (prev + 1) % DEMO_SCENARIOS.length);
        setLeaving(false);
      }, FADE_MS);
    };

    const start = () => {
      if (interval || document.hidden) return;
      interval = setInterval(advance, CYCLE_MS);
    };
    const stop = () => {
      if (interval) clearInterval(interval);
      interval = null;
      if (fade) clearTimeout(fade);
      fade = null;
      setLeaving(false);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          onScreen = entry.isIntersecting;
          if (onScreen) start();
          else stop();
        }
      },
      { threshold: 0.3 }
    );
    io.observe(panel);

    const onVisibility = () => {
      if (document.hidden) stop();
      else if (onScreen) start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const scenario = DEMO_SCENARIOS[activeIndex];

  return (
    <div className="demo-panel" ref={panelRef}>
      <div className="demo-panel-head">
        <span className="demo-status-dot" />
        <span>{scenario.title}</span>
      </div>
      <div className={`demo-panel-body${leaving ? " is-leaving" : ""}`}>
        {scenario.tasks.map((task, i) => (
          <div
            className="demo-task"
            key={`${activeIndex}-${i}`}
            style={{ "--i": i } as CSSProperties}
          >
            {task.status === "done" && <span className="check">&#10003;</span>}
            {task.status === "active" && <span className="pending">&#10227;</span>}
            {task.label}
          </div>
        ))}
        <div
          className="demo-actions"
          key={`${activeIndex}-actions`}
          style={{ "--i": scenario.tasks.length } as CSSProperties}
        >
          <button className="btn-approve">Mark Done</button>
          <button className="btn-review">View Summary</button>
        </div>
      </div>
    </div>
  );
}
