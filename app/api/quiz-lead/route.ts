import { NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import { rateLimit, rateLimitConfigs } from "@/lib/rate-limit";
import { QUESTIONS, scoreAnswers, labelFor } from "@/lib/quiz";
import {
  customerRecommendationEmail,
  leadNotificationEmail,
} from "@/lib/email-templates";
import { generateBuildPrompt } from "@/lib/build-prompt";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not set");
  return new Resend(key);
}

const quizLeadSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  business: z.string().max(120).optional(),
  phone: z.string().max(40).optional(),
  // Honeypot — real users never fill this.
  website: z.string().max(0).optional().or(z.literal("")),
  answers: z.record(z.string(), z.string().max(2000)),
});

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const limited = rateLimit.check(`quiz-lead:${ip}`, rateLimitConfigs.contact);
    if (!limited.success) {
      return NextResponse.json(
        { error: "Too many requests. Try again in a minute." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = quizLeadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, email, business, phone, website, answers } = parsed.data;

    // Honeypot tripped — pretend success, do nothing.
    if (website) {
      return NextResponse.json({ ok: true });
    }

    // Re-derive the recommendation server-side (never trust the client).
    const reco = scoreAnswers(answers);

    // Build a readable Q/A transcript for the email + record.
    const transcript = QUESTIONS.map((q) => {
      const val = answers[q.id];
      if (!val) return null;
      return `${q.prompt}\n  → ${labelFor(q.id, val)}`;
    })
      .filter(Boolean)
      .join("\n\n");

    const recoBlock = [
      `RECOMMENDATION: ${reco.title}`,
      reco.summary,
      ``,
      `Build: ${reco.modules.map((m) => m.name).join(", ")}`,
      `Suggested tier: ${reco.suggestedTier}`,
      `Scores — Bella ${reco.scores.bella}, Website ${reco.scores.website}, Automations ${reco.scores.automations}`,
    ].join("\n");

    const recordMessage = `[Build-My-AI quiz lead]\n\n${recoBlock}\n\n--- Answers ---\n${transcript}`;

    // Best-effort persistence + notification. We only fail the request if BOTH
    // the database write and the email send fail — so once the Resend key is
    // set, leads still deliver even before the database is wired up.
    const from = process.env.EMAIL_FROM || "Limitless <onboarding@resend.dev>";
    const ownerTo = process.env.LEAD_NOTIFY_EMAIL || "gavindj2022@gmail.com";
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://limitless-website.vercel.app";
    const bookUrl = `${appUrl}/book?service=${reco.serviceKey}`;
    const contact = { name, business, email, phone };
    const qa = QUESTIONS.map((q) =>
      answers[q.id] ? { q: q.prompt, a: labelFor(q.id, answers[q.id]) } : null
    ).filter((x): x is { q: string; a: string } => x !== null);
    const buildPrompt = generateBuildPrompt({ contact, reco, qa });

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
      console.error("[QUIZ-LEAD] db save failed", err);
    }

    try {
      const resend = getResend();

      // Notify the team (works as soon as the Resend key is set).
      try {
        await resend.emails.send({
          from,
          to: ownerTo,
          subject: `🧩 Build-My-AI: ${name}${business ? ` (${business})` : ""} → ${reco.title}`,
          html: leadNotificationEmail({ contact, reco, qa, bookUrl, buildPrompt }),
          text: `New "Build Your AI" quiz lead.\n\nName: ${name}\nEmail: ${email}\n${business ? `Business: ${business}\n` : ""}${phone ? `Phone: ${phone}\n` : ""}\n${recoBlock}\n\n--- Answers ---\n${transcript}\n\n=== BUILD PROMPT (paste into your build loop) ===\n${buildPrompt}`,
        });
        emailedOwner = true;
      } catch (err) {
        console.error("[QUIZ-LEAD] owner email failed", err);
      }

      // Send the prospect their personalized recommendation. Reaching addresses
      // other than the account owner requires a verified sending domain in
      // Resend — best-effort until that's set up.
      try {
        await resend.emails.send({
          from,
          to: email,
          subject: `Here's the AI we'd build for ${business?.trim() || "your business"} 🚀`,
          html: customerRecommendationEmail({ contact, reco, bookUrl }),
          text: `Hi ${name},\n\nThanks for taking the quiz! Here's the AI we'd build for ${business?.trim() || "your business"}:\n\n${recoBlock}\n\nBook your free build call: ${bookUrl}\n\n— Limitless`,
        });
      } catch (err) {
        console.error("[QUIZ-LEAD] customer email failed", err);
      }
    } catch (err) {
      console.error("[QUIZ-LEAD] resend init failed", err);
    }

    if (!saved && !emailedOwner) {
      return NextResponse.json(
        { error: "We couldn't submit that. Please try again or email us directly." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[QUIZ-LEAD]", error);
    return NextResponse.json(
      { error: "Failed to submit. Please try again." },
      { status: 500 }
    );
  }
}
