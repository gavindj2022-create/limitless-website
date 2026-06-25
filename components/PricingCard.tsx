"use client";

import Link from "next/link";
import { useState } from "react";
import CheckIcon from "./icons/CheckIcon";

interface PricingCardProps {
  tier: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  featured?: boolean;
  badge?: string;
  plan?: string;
  href?: string;
}

export default function PricingCard({
  tier,
  price,
  period,
  description,
  features,
  cta,
  featured = false,
  badge,
  plan,
  href,
}: PricingCardProps) {
  const [loading, setLoading] = useState(false);

  // Derive plan key from tier name if not explicitly provided
  const planKey =
    plan ||
    tier
      .toLowerCase()
      .replace(/\s+/g, "_");

  async function handleCheckout() {
    if (!planKey) return;
    setLoading(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planKey }),
      });
      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else if (res.status === 401) {
        // Not logged in — send to sign-in first
        window.location.href = "/api/auth/signin";
      }
    } catch {
      console.error("Checkout failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`pricing-card${featured ? " featured" : ""}`}>
      {badge && <span className="pricing-badge">{badge}</span>}
      <span className="pricing-tier">{tier}</span>
      <div className="pricing-price">
        <span className="pricing-amount">{price}</span>
        <span className="pricing-period">{period}</span>
      </div>
      <p className="pricing-desc">{description}</p>
      <div className="pricing-divider" />
      <div className="pricing-features">
        {features.map((feature, i) => (
          <div className="pricing-feature" key={i}>
            <CheckIcon />
            <span>{feature}</span>
          </div>
        ))}
      </div>
      {href ? (
        <Link
          href={href}
          className={`btn ${featured ? "btn-primary" : "btn-ghost"}`}
        >
          {cta}
        </Link>
      ) : (
        <button
          onClick={handleCheckout}
          disabled={loading}
          className={`btn ${featured ? "btn-primary" : "btn-ghost"}`}
        >
          {loading ? "Loading..." : cta}
        </button>
      )}
    </div>
  );
}
