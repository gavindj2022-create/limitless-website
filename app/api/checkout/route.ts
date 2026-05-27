import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { stripe, PLANS, type PlanKey } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const plan = body.plan as string;

    if (!plan || !(plan in PLANS)) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const planConfig = PLANS[plan as PlanKey];

    // Find or create the user's subscription record to get stripeCustomerId
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { subscription: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Use existing Stripe customer or let Checkout create one
    const customerParams: Record<string, string> = {};
    if (user.subscription?.stripeCustomerId) {
      customerParams.customer = user.subscription.stripeCustomerId;
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: planConfig.priceId, quantity: 1 }],
      subscription_data: {
        trial_period_days: 14,
        metadata: { plan, userId: user.id },
      },
      metadata: { plan, userId: user.id },
      customer_email: user.subscription?.stripeCustomerId
        ? undefined
        : session.user.email,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?checkout=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/#pricing`,
      ...customerParams,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("[CHECKOUT]", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
