import { NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import { rateLimit, rateLimitConfigs } from "@/lib/rate-limit";
import { QUESTIONS, scoreAnswers, labelFor } from "@/lib/quiz";

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
    let saved = false;
    let emailed = false;

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
      await getResend().emails.send({
        from: "Limitless <noreply@dawgs-agi.com>",
        to: "gavindj2022@gmail.com",
        subject: `🧩 Build-My-AI: ${name}${business ? ` (${business})` : ""} → ${reco.title}`,
        text: [
          `New "Build Your AI" quiz lead.`,
          ``,
          `Name: ${name}`,
          `Email: ${email}`,
          business ? `Business: ${business}` : null,
          phone ? `Phone: ${phone}` : null,
          ``,
          recoBlock,
          ``,
          `--- Answers ---`,
          transcript,
          ``,
          `→ Follow up and build out the recommended ${reco.serviceKey}.`,
        ]
          .filter(Boolean)
          .join("\n"),
      });
      emailed = true;
    } catch (err) {
      console.error("[QUIZ-LEAD] email failed", err);
    }

    if (!saved && !emailed) {
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
