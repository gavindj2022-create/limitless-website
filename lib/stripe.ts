import Stripe from "stripe";

function createStripeClient() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    // During build or when env vars aren't set, return a proxy that warns on use
    return new Proxy({} as Stripe, {
      get(_target, prop) {
        if (prop === "then") return undefined;
        throw new Error(
          `Stripe is not configured. Set STRIPE_SECRET_KEY in .env.local. Tried to access: ${String(prop)}`
        );
      },
    });
  }
  return new Stripe(key, { typescript: true });
}

export const stripe = createStripeClient();

export const PLANS = {
  starter: {
    name: "Starter",
    priceId: process.env.STRIPE_PRICE_STARTER!,
    price: 29,
  },
  growth: {
    name: "Growth",
    priceId: process.env.STRIPE_PRICE_GROWTH!,
    price: 199,
  },
  full_ops: {
    name: "Full Ops",
    priceId: process.env.STRIPE_PRICE_FULL_OPS!,
    price: 499,
  },
} as const;

export type PlanKey = keyof typeof PLANS;
