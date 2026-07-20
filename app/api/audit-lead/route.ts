import { NextResponse } from "next/server";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import { rateLimit, rateLimitConfigs } from "@/lib/rate-limit";
import {
  parseAuditLead,
  computeLeak,
  usd,
  REPLY_TIME_LABELS,
} from "@/lib/leak-audit";
import {
  auditReportEmail,
  auditLeadNotificationEmail,
} from "@/lib/email-templates";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not set");
  return new Resend(key);
}

export async function POST(request: Request) {
  try {
    // Validate before spending the strict contact rate limit.
    const body = await request.json();
    const parsed = parseAuditLead(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const limited = rateLimit.check(`audit-lead:${ip}`, rateLimitConfigs.contact);
    if (!limited.success) {
      return NextResponse.json(
        { error: "Too many requests. Try again in a minute." },
        { status: 429 }
      );
    }

    const {
      name,
      email,
      business,
      phone,
      vertical,
      website,
      missedCallsPerWeek,
      avgCustomerValue,
      replyTime,
      hasAIReceptionist,
      hasOnlineBooking,
    } = parsed.data;

    // Honeypot tripped — pretend success, do nothing.
    if (website) {
      return NextResponse.json({ ok: true });
    }

    // Re-derive the result server-side (never trust the client math).
    const inputs = {
      vertical,
      missedCallsPerWeek,
      avgCustomerValue,
      replyTime,
      hasAIReceptionist,
      hasOnlineBooking,
    };
    const result = computeLeak(inputs);

    const summary = [
      `Business type: ${vertical || "—"}`,
      `Missed calls/week: ${missedCallsPerWeek}`,
      `Avg customer value: ${usd(avgCustomerValue)}`,
      `Reply speed: ${REPLY_TIME_LABELS[replyTime] ?? replyTime}`,
      `Has AI receptionist: ${hasAIReceptionist ? "Yes" : "No"}`,
      `Has online booking: ${hasOnlineBooking ? "Yes" : "No"}`,
      ``,
      `Grade: ${result.grade} (score ${result.score}/100)`,
      `Leaking/month: ${usd(result.totalMonthly)}`,
      `Leaking/year: ${usd(result.totalYearly)}`,
      `  · Missed calls: ${usd(result.missedCallLeak)}`,
      `  · Slow replies: ${usd(result.slowReplyLeak)}`,
      `  · After hours: ${usd(result.afterHoursLeak)}`,
      phone ? `Phone: ${phone}` : null,
    ]
      .filter((l) => l !== null)
      .join("\n");

    const recordMessage = `[Leak Audit lead]\n${summary}`;

    // Best-effort persistence + notification. We only fail the request if BOTH
    // the database write and the owner email fail — so leads still deliver even
    // before the database is wired up (mirrors the quiz-lead route).
    const from = process.env.EMAIL_FROM || "Limitless <onboarding@resend.dev>";
    const ownerTo = process.env.LEAD_NOTIFY_EMAIL || "gavindj2022@gmail.com";
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://golimitlessagi.com";
    const bookUrl = `${appUrl}/book?service=bella`;
    const contact = { name, business, email, phone };

    let saved = false;
    let emailedOwner = false;

    try {
      await prisma.contactSubmission.create({
        data: {
          name,
          email,
          company: business ?? null,
          message: recordMessage,
        },
      });
      saved = true;
    } catch (err) {
      console.error("[AUDIT-LEAD] db save failed", err);
    }

    try {
      const resend = getResend();

      // Notify the team (works as soon as the Resend key is set).
      try {
        await resend.emails.send({
          from,
          to: ownerTo,
          subject: `💧 Leak Audit: ${name}${business ? ` (${business})` : ""} — ${usd(
            result.totalMonthly
          )}/mo · Grade ${result.grade}`,
          html: auditLeadNotificationEmail({ contact, inputs, result, bookUrl }),
          text: `New Leak Audit lead.\n\nName: ${name}\nEmail: ${email}\n${business ? `Business: ${business}\n` : ""}${phone ? `Phone: ${phone}\n` : ""}\n${summary}\n\n→ Follow up with the free fix plan.`,
        });
        emailedOwner = true;
      } catch (err) {
        console.error("[AUDIT-LEAD] owner email failed", err);
      }

      // Send the prospect their scorecard. Reaching addresses other than the
      // account owner requires a verified sending domain in Resend —
      // best-effort until that's set up.
      try {
        await resend.emails.send({
          from,
          to: email,
          subject: `Your leak audit: ~${usd(result.totalMonthly)}/mo (Grade ${result.grade})`,
          html: auditReportEmail({ contact, result, bookUrl }),
          text: `Hi ${name},\n\nHere's your 60-second leak audit:\n\n${summary}\n\nGet your free fix plan: ${bookUrl}\n\n— Limitless`,
        });
      } catch (err) {
        console.error("[AUDIT-LEAD] customer email failed", err);
      }
    } catch (err) {
      console.error("[AUDIT-LEAD] resend init failed", err);
    }

    if (!saved && !emailedOwner) {
      return NextResponse.json(
        { error: "We couldn't submit that. Please try again or email us directly." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[AUDIT-LEAD]", error);
    return NextResponse.json(
      { error: "Failed to submit. Please try again." },
      { status: 500 }
    );
  }
}
