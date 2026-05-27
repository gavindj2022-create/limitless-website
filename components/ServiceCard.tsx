"use client";

import { useRef, type ReactNode } from "react";

interface ServiceCardProps {
  eyebrow: string;
  title: string;
  description: string;
  icon: ReactNode;
  features: string[];
}

export default function ServiceCard({
  eyebrow,
  title,
  description,
  icon,
  features,
}: ServiceCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    card.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  return (
    <div
      className="svc-card"
      ref={cardRef}
      onMouseMove={handleMouseMove}
    >
      <div style={{ marginBottom: 14, color: "var(--accent)", opacity: 0.7 }}>
        {icon}
      </div>
      <span className="svc-eyebrow">{eyebrow}</span>
      <h3>{title}</h3>
      <p>{description}</p>
      <ul style={{ marginTop: "auto", paddingTop: 18, display: "flex", flexDirection: "column", gap: 8 }}>
        {features.map((feat, i) => (
          <li key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--ink-2)" }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, color: "var(--accent)" }}>
              <path d="M11.5 3.5L5.5 10.5L2.5 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {feat}
          </li>
        ))}
      </ul>
    </div>
  );
}
