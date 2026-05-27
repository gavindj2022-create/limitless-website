import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[STRIPE_WEBHOOK] Signature verification failed:", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const plan = session.metadata?.plan;

        if (!userId || !session.subscription || !session.customer) break;

        const subscriptionId =
          typeof session.subscription === "string"
            ? session.subscription
            : session.subscription.id;

        const customerId =
          typeof session.customer === "string"
            ? session.customer
            : session.customer.id;

        // Fetch the Stripe subscription to get price + period info
        const sub = await stripe.subscriptions.retrieve(subscriptionId);

        await prisma.subscription.upsert({
          where: { userId },
          create: {
            userId,
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscriptionId,
            stripePriceId: sub.items.data[0]?.price.id ?? null,
            stripeCurrentPeriodEnd: new Date(
              (sub.items.data[0]?.current_period_end ?? 0) * 1000
            ),
            status: sub.status,
            plan: plan ?? "starter",
          },
          update: {
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscriptionId,
            stripePriceId: sub.items.data[0]?.price.id ?? null,
            stripeCurrentPeriodEnd: new Date(
              (sub.items.data[0]?.current_period_end ?? 0) * 1000
            ),
            status: sub.status,
            plan: plan ?? "starter",
          },
        });
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const subId = sub.id;

        const existing = await prisma.subscription.findUnique({
          where: { stripeSubscriptionId: subId },
        });

        if (existing) {
          await prisma.subscription.update({
            where: { stripeSubscriptionId: subId },
            data: {
              status: sub.status,
              stripePriceId: sub.items.data[0]?.price.id ?? null,
              stripeCurrentPeriodEnd: new Date(
                (sub.items.data[0]?.current_period_end ?? 0) * 1000
              ),
            },
          });
        }
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;

        const existing = await prisma.subscription.findUnique({
          where: { stripeSubscriptionId: sub.id },
        });

        if (existing) {
          await prisma.subscription.update({
            where: { stripeSubscriptionId: sub.id },
            data: { status: "canceled" },
          });
        }
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        const parentSub = invoice.parent?.subscription_details?.subscription;
        const subId =
          typeof parentSub === "string"
            ? parentSub
            : parentSub?.id ?? null;

        if (subId) {
          const sub = await stripe.subscriptions.retrieve(subId);
          const existing = await prisma.subscription.findUnique({
            where: { stripeSubscriptionId: subId },
          });

          if (existing) {
            await prisma.subscription.update({
              where: { stripeSubscriptionId: subId },
              data: {
                status: sub.status,
                stripeCurrentPeriodEnd: new Date(
                  (sub.items.data[0]?.current_period_end ?? 0) * 1000
                ),
              },
            });
          }
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const parentSub = invoice.parent?.subscription_details?.subscription;
        const subId =
          typeof parentSub === "string"
            ? parentSub
            : parentSub?.id ?? null;

        if (subId) {
          const existing = await prisma.subscription.findUnique({
            where: { stripeSubscriptionId: subId },
          });

          if (existing) {
            await prisma.subscription.update({
              where: { stripeSubscriptionId: subId },
              data: { status: "past_due" },
            });
          }
        }
        break;
      }
    }
  } catch (error) {
    console.error("[STRIPE_WEBHOOK] Handler error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}
