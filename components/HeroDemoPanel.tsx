"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import gsap from "gsap";

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

export default function HeroDemoPanel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const prefersReducedRef = useRef(false);

  useEffect(() => {
    prefersReducedRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
  }, []);

  const animateIn = useCallback(() => {
    const body = bodyRef.current;
    if (!body) return;

    if (prefersReducedRef.current) {
      gsap.set(body.children, { opacity: 1, y: 0 });
      return;
    }

    gsap.from(body.querySelectorAll(".demo-task, .demo-actions"), {
      y: 20,
      opacity: 0,
      stagger: 0.12,
      duration: 0.5,
      ease: "power2.out",
    });
  }, []);

  const animateOut = useCallback(() => {
    const body = bodyRef.current;
    if (!body) return;

    if (prefersReducedRef.current) {
      return Promise.resolve();
    }

    return new Promise<void>((resolve) => {
      gsap.to(body, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: resolve,
      });
    });
  }, []);

  useEffect(() => {
    animateIn();

    intervalRef.current = setInterval(() => {
      const doTransition = async () => {
        await animateOut();
        setActiveIndex((prev) => (prev + 1) % DEMO_SCENARIOS.length);
      };
      doTransition();
    }, 4000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [animateIn, animateOut]);

  useEffect(() => {
    const body = bodyRef.current;
    if (!body) return;

    gsap.set(body, { opacity: 1 });
    animateIn();
  }, [activeIndex, animateIn]);

  const scenario = DEMO_SCENARIOS[activeIndex];

  return (
    <div className="demo-panel">
      <div className="demo-panel-head">
        <span className="demo-status-dot" />
        <span>{scenario.title}</span>
      </div>
      <div className="demo-panel-body" ref={bodyRef}>
        {scenario.tasks.map((task, i) => (
          <div className="demo-task" key={`${activeIndex}-${i}`}>
            {task.status === "done" && <span className="check">&#10003;</span>}
            {task.status === "active" && <span className="pending">&#10227;</span>}
            {task.label}
          </div>
        ))}
        <div className="demo-actions">
          <button className="btn-approve">Mark Done</button>
          <button className="btn-review">View Summary</button>
        </div>
      </div>
    </div>
  );
}
