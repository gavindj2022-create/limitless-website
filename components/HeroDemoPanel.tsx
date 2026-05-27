"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import gsap from "gsap";

interface DemoTask {
  label: string;
  status: "done" | "active" | "pending";
}

const DEMO_SCENARIOS = [
  {
    title: "Olivia is working…",
    tasks: [
      { label: "Invoice #1047 sent to Studio B Hair Design", status: "done" as const },
      { label: "Payment confirmed — $320.00 deposited", status: "done" as const },
      { label: "Appointment reminder sent to 3 clients", status: "done" as const },
      { label: "Following up on overdue invoice #1038…", status: "active" as const },
    ],
  },
  {
    title: "Bella is answering…",
    tasks: [
      { label: "Incoming call from (309) 555-0142", status: "done" as const },
      { label: "Booked haircut — Sarah M, Thursday 2pm", status: "done" as const },
      { label: "Sent confirmation text to customer", status: "done" as const },
      { label: "Updating your calendar…", status: "active" as const },
    ],
  },
  {
    title: "Alfred is reporting…",
    tasks: [
      { label: "Weekly revenue: $4,820 (+12% vs last week)", status: "done" as const },
      { label: "5 new reviews collected — avg 4.8★", status: "done" as const },
      { label: "3 appointments rescheduled automatically", status: "done" as const },
      { label: "Generating insights report…", status: "active" as const },
    ],
  },
];

export default function HeroDemoPanel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const prefersReducedRef = useRef(false);

  // Check reduced motion preference once on mount
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
    // Animate initial scenario in
    animateIn();

    intervalRef.current = setInterval(() => {
      const doTransition = async () => {
        await animateOut();
        setActiveIndex((prev) => {
          const next = (prev + 1) % DEMO_SCENARIOS.length;
          return next;
        });
      };
      doTransition();
    }, 4000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [animateIn, animateOut]);

  // When activeIndex changes, animate in the new content
  useEffect(() => {
    const body = bodyRef.current;
    if (!body) return;

    // Reset body opacity to 1 (it may have been faded out)
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
          <button className="btn-approve">Approve All</button>
          <button className="btn-review">Review</button>
        </div>
      </div>
    </div>
  );
}
