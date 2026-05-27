"use client";

import { useState, useEffect, useRef } from "react";

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
  const [isVisible, setIsVisible] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setActiveIndex((prev) => (prev + 1) % DEMO_SCENARIOS.length);
        setIsVisible(true);
      }, 400);
    }, 4000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const scenario = DEMO_SCENARIOS[activeIndex];

  return (
    <div className="demo-panel">
      <div className="demo-panel-head">
        <span className="demo-status-dot" />
        <span>{scenario.title}</span>
      </div>
      <div
        className="demo-panel-body"
        style={{
          opacity: isVisible ? 1 : 0,
          transition: "opacity 0.4s ease",
        }}
      >
        {scenario.tasks.map((task, i) => (
          <div className="demo-task" key={i}>
            {task.status === "done" && <span className="check">✓</span>}
            {task.status === "active" && <span className="pending">⟳</span>}
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
