"use client";

import Link from "next/link";
import { useState } from "react";

interface DashboardClientProps {
  stripeCustomerId: string | null;
  currentPlan: string;
}

export default function DashboardClient({
  stripeCustomerId,
  currentPlan,
}: DashboardClientProps) {
  const [loading, setLoading] = useState(false);

  async function handleManage() {
    if (!stripeCustomerId) return;
    setLoading(true);

    try {
      const res = await fetch("/api/billing-portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId: stripeCustomerId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      console.error("Failed to open billing portal");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        className="btn btn-ghost"
        onClick={handleManage}
        disabled={loading || !stripeCustomerId}
      >
        {loading ? "Loading..." : "Manage Subscription"}
      </button>
      {currentPlan !== "full_ops" && (
        <Link href="/#pricing" className="btn btn-primary">
          Upgrade
        </Link>
      )}
    </>
  );
}
