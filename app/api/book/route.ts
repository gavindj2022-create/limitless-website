import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { rateLimit, rateLimitConfigs } from "@/lib/rate-limit";

const services = {
  bella: "Bella AI receptionist",
  website: "AI website build",
  system: "Full presence system",
} as const;

const bookSchema = z.object({
  service: z.enum(["bella", "website", "system"]),
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z.string().trim().email("Invalid email address").max(160),
  phone: z.string().trim().max(40).optional(),
  business: z.string().trim().max(160).optional(),
  message: z.string().trim().min(8, "Message is required").max(2000),
  website: z.string().max(0).optional(),
});

function getLeadIp(request: Request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function getResend() {
  const key = process.env.RESEND_API_KEY;
  return key ? new Resend(key) : null;
}

export async function POST(request: Request) {
  try {
    const limited = rateLimit.check(
      `book:${getLeadIp(request)}`,
      rateLimitConfigs.contact
    );
    if (!limited.success) {
      return NextResponse.json(
        { error: "Too many requests. Try again in a minute." },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => null);
    const parsed = bookSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Please fill out the required fields." },
        { status: 400 }
      );
    }

    const { service, name, email, phone, business, message } = parsed.data;
    const serviceLabel = services[service];
    const leadSummary = [
      `[Website intake: ${serviceLabel}]`,
      `Name: ${name}`,
      `Email: ${email}`,
      phone ? `Phone: ${phone}` : null,
      business ? `Business: ${business}` : null,
      "",
      message,
    ]
      .filter((line) => line !== null)
      .join("\n");

    try {
      await prisma.contactSubmission.create({
        data: {
          name,
          email,
          company: business || null,
          message: leadSummary,
        },
      });
    } catch (dbError) {
      console.error("[BOOK:DB]", dbError);
    }

    const resend = getResend();
    if (resend) {
      await resend.emails.send({
        from: "Limitless <noreply@dawgs-agi.com>",
        to: process.env.LEAD_NOTIFY_EMAIL || "gavindj2022@gmail.com",
        subject: `New Limitless request: ${serviceLabel}`,
        text: leadSummary,
      });
    } else {
      console.info("[BOOK] Resend not configured; lead accepted locally.");
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[BOOK]", error);
    return NextResponse.json(
      { error: "Failed to submit. Please try again." },
      { status: 500 }
    );
  }
}
