import { NextResponse } from "next/server";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import { rateLimit, rateLimitConfigs } from "@/lib/rate-limit";
import { bookServices, parseBookLead } from "@/lib/book-intake";

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
    const body = await request.json().catch(() => null);
    const parsed = parseBookLead(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Please fill out the required fields." },
        { status: 400 }
      );
    }

    const { service, name, email, phone, business, message, website } = parsed.data;

    // Honeypot tripped. Pretend success, but do not save or email the lead.
    if (website) {
      return NextResponse.json({ ok: true });
    }

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

    const serviceLabel = bookServices[service];
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

    // Best-effort persistence + notification. The request only fails if BOTH
    // the database write and the email fail — so a lead still reaches us before
    // the database is wired up, as long as the Resend key is set.
    let saved = false;
    let emailed = false;

    try {
      await prisma.contactSubmission.create({
        data: {
          name,
          email,
          company: business || null,
          message: leadSummary,
        },
      });
      saved = true;
    } catch (dbError) {
      console.error("[BOOK:DB]", dbError);
    }

    try {
      const resend = getResend();
      if (resend) {
        await resend.emails.send({
          from: process.env.EMAIL_FROM || "Limitless <onboarding@resend.dev>",
          to: process.env.LEAD_NOTIFY_EMAIL || "gavindj2022@gmail.com",
          subject: `New Limitless request: ${serviceLabel}`,
          text: leadSummary,
        });
        emailed = true;
      } else {
        console.info("[BOOK] Resend not configured; lead accepted locally.");
      }
    } catch (mailError) {
      console.error("[BOOK:MAIL]", mailError);
    }

    if (!saved && !emailed) {
      return NextResponse.json(
        { error: "Failed to submit. Please try again." },
        { status: 500 }
      );
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
