import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2026-04-22.dahlia",
});

/**
 * Verify a Stripe webhook signature and return the parsed event.
 * Throws if verification fails.
 *
 * @param rawBody - The raw request body as a string or Buffer
 * @param signature - The `stripe-signature` header value
 * @returns The verified Stripe event
 */
export function verifyWebhookSignature(
  rawBody: string | Buffer,
  signature: string
): Stripe.Event {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    throw new Error("STRIPE_WEBHOOK_SECRET is not configured");
  }

  return stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
}
