import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PLANS } from "@/lib/stripe";
import DashboardClient from "./DashboardClient";

export const metadata = {
  title: "Dashboard — Limitless",
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  const user = session?.user?.email
    ? await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { subscription: true },
      })
    : null;

  const sub = user?.subscription;

  return (
    <>
      <div className="dash-header">
        <h1>
          Welcome back{session?.user?.name ? `, ${session.user.name}` : ""}
        </h1>
        <p>{session?.user?.email}</p>
      </div>

      {sub ? (
        <div className="dash-grid">
          {/* Current plan */}
          <div className="dash-card">
            <h3>Current Plan</h3>
            <div className="dash-value">
              {sub.plan === "full_ops"
                ? "Full Ops"
                : sub.plan.charAt(0).toUpperCase() + sub.plan.slice(1)}
            </div>
            <div className="dash-status">
              <span className={`dash-status-dot ${sub.status}`} />
              {sub.status === "active" && "Active"}
              {sub.status === "trialing" && "Trial"}
              {sub.status === "canceled" && "Canceled"}
              {sub.status === "past_due" && "Past Due"}
            </div>
          </div>

          {/* Billing */}
          <div className="dash-card">
            <h3>Billing</h3>
            <div className="dash-value">
              ${PLANS[sub.plan as keyof typeof PLANS]?.price ?? "—"}
              <span style={{ fontSize: 15, color: "var(--muted)", fontWeight: 400 }}>
                /mo
              </span>
            </div>
            {sub.stripeCurrentPeriodEnd && (
              <p className="dash-meta">
                Next billing:{" "}
                {new Date(sub.stripeCurrentPeriodEnd).toLocaleDateString(
                  "en-US",
                  { month: "long", day: "numeric", year: "numeric" }
                )}
              </p>
            )}
            <div className="dash-actions">
              <DashboardClient
                stripeCustomerId={sub.stripeCustomerId}
                currentPlan={sub.plan}
              />
            </div>
          </div>

          {/* Upgrade options */}
          <div className="dash-card" style={{ gridColumn: "1 / -1" }}>
            <h3>Plans</h3>
            <div className="dash-upgrade-grid">
              {(Object.entries(PLANS) as [string, (typeof PLANS)[keyof typeof PLANS]][]).map(
                ([key, plan]) => (
                  <div
                    key={key}
                    className={`dash-upgrade-option${key === sub.plan ? " current" : ""}`}
                  >
                    <div className="dash-upgrade-name">{plan.name}</div>
                    <div className="dash-upgrade-price">${plan.price}</div>
                    <div className="dash-upgrade-period">/month</div>
                    {key === sub.plan && (
                      <p
                        style={{
                          fontSize: 11,
                          color: "var(--accent)",
                          marginTop: 8,
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                        }}
                      >
                        Current
                      </p>
                    )}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="dash-grid">
          <div className="dash-empty">
            <h2>No active subscription</h2>
            <p>
              Choose a plan to get started with Olivia, your AI employee.
            </p>
            <Link href="/#pricing" className="btn btn-primary">
              View Plans
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
