import { NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import { rateLimit, rateLimitConfigs } from "@/lib/rate-limit";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not set");
  return new Resend(key);
}

const roiLeadSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  business: z.string().max(120).optional(),
  phone: z.string().max(40).optional(),
  vertical: z.string().max(60).optional(),
  // Calculator figures (already computed client-side, re-derived here for the email)
  callsMissedPerDay: z.number().min(0).max(1000),
  avgTicket: z.number().min(0).max(1_000_000),
  conversionPct: z.number().min(0).max(100),
  businessDays: z.number().min(1).max(31),
});

export async function POST(request: Request) {
  try {
    // Light rate limit on a public endpoint
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "unknown";
    const limited = rateLimit.check(`roi-lead:${ip}`, rateLimitConfigs.contact);
    if (!limited.success) {
      return NextResponse.json(
        { error: "Too many requests. Try again in a minute." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = roiLeadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const {
      name,
      email,
      business,
      phone,
      vertical,
      callsMissedPerDay,
      avgTicket,
      conversionPct,
      businessDays,
    } = parsed.data;

    // Server-side re-computation (never trust client math for the email/record)
    const lostPerDay = callsMissedPerDay * (conversionPct / 100) * avgTicket;
    const lostPerMonth = lostPerDay * businessDays;
    const lostPerYear = lostPerMonth * 12;
    const usd = (n: number) =>
      "$" + Math.round(n).toLocaleString("en-US");

    const summary = [
      `Vertical: ${vertical || "—"}`,
      `Calls missed/day: ${callsMissedPerDay}`,
      `Avg ticket: ${usd(avgTicket)}`,
      `Assumed conversion: ${conversionPct}%`,
      `Business days/mo: ${businessDays}`,
      ``,
      `Estimated lost/month: ${usd(lostPerMonth)}`,
      `Estimated lost/year: ${usd(lostPerYear)}`,
      phone ? `Phone: ${phone}` : null,
    ]
      .filter((l) => l !== null)
      .join("\n");

    // Reuse the existing ContactSubmission table (no migration needed)
    await prisma.contactSubmission.create({
      data: {
        name,
        email,
        company: business ?? null,
        message: `[Missed-Call ROI lead]\n${summary}`,
      },
    });

    await getResend().emails.send({
      from: "Limitless <noreply@dawgs-agi.com>",
      to: "gavindj2022@gmail.com",
      subject: `🔥 ROI lead: ${name}${business ? ` (${business})` : ""} — ${usd(
        lostPerMonth
      )}/mo leak`,
      text: [
        `New missed-call ROI lead from the calculator.`,
        ``,
        `Name: ${name}`,
        `Email: ${email}`,
        business ? `Business: ${business}` : null,
        phone ? `Phone: ${phone}` : null,
        ``,
        summary,
        ``,
        `→ Follow up with the free 2-week Bella pilot.`,
      ]
        .filter(Boolean)
        .join("\n"),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[ROI-LEAD]", error);
    return NextResponse.json(
      { error: "Failed to submit. Please try again." },
      { status: 500 }
    );
  }
}
