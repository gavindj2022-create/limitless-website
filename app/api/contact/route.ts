import { NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not set");
  return new Resend(key);
}

const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  company: z.string().max(100).optional(),
  message: z.string().min(10, "Message must be at least 10 characters").max(5000),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, email, company, message } = parsed.data;

    // Best-effort persistence + notification. The request only fails if BOTH
    // the database write and the email fail — so a lead still reaches us before
    // the database is wired up, as long as the Resend key is set.
    let saved = false;
    let emailed = false;

    try {
      await prisma.contactSubmission.create({
        data: { name, email, company, message },
      });
      saved = true;
    } catch (dbError) {
      console.error("[CONTACT:DB]", dbError);
    }

    try {
      await getResend().emails.send({
        from: process.env.EMAIL_FROM || "Limitless <onboarding@resend.dev>",
        to: process.env.LEAD_NOTIFY_EMAIL || "gavindj2022@gmail.com",
        subject: `New contact: ${name}${company ? ` (${company})` : ""}`,
        text: [
          `Name: ${name}`,
          `Email: ${email}`,
          company ? `Company: ${company}` : null,
          `\nMessage:\n${message}`,
        ]
          .filter(Boolean)
          .join("\n"),
      });
      emailed = true;
    } catch (mailError) {
      console.error("[CONTACT:MAIL]", mailError);
    }

    if (!saved && !emailed) {
      return NextResponse.json(
        { error: "Failed to process contact form" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[CONTACT]", error);
    return NextResponse.json(
      { error: "Failed to process contact form" },
      { status: 500 }
    );
  }
}
