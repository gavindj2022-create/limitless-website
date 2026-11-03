import { NextResponse } from "next/server";
import { Resend } from "resend";
import { rateLimit, rateLimitConfigs } from "@/lib/rate-limit";
import { getClientIp, isSameOrigin, readLimitedJson } from "@/lib/request-guards";
import { callbackSchema } from "@/lib/validation";

const response = (body: Record<string, unknown>, status = 200) =>
  NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });

const escape = (value: string) =>
  value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char] as string);

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return response({ error: "Request not allowed." }, 403);

  const body = await readLimitedJson(request);
  if (!body.ok) return response({ error: "Invalid request." }, body.status);

  const parsed = callbackSchema.safeParse(body.value);
  if (!parsed.success) return response({ error: "Add your name and a 10-digit phone number." }, 400);
  const lead = parsed.data;

  // Quietly drop bot submissions.
  if (lead.website) return response({ ok: true });

  const ip = getClientIp(request);
  const allowed = rateLimit.check(`callback:${ip}`, rateLimitConfigs.contact);
  if (!allowed.success) return response({ error: "Too many requests. Try again later." }, 429);

  const key = process.env.RESEND_API_KEY;
  if (!key) return response({ error: "That didn't go through. Please text me instead." }, 503);

  const resend = new Resend(key);
  const sent = await resend.emails.send({
    from: process.env.EMAIL_FROM || "Limitless <onboarding@resend.dev>",
    to: process.env.LEAD_NOTIFY_EMAIL || "limitlessgav@gmail.com",
    subject: `Call back: ${lead.name} (${lead.bestTime})`,
    text: `Call back request from /gavin\nName: ${lead.name}\nPhone: ${lead.phone}\nBest time: ${lead.bestTime}`,
    html: `<p><strong>Call back request</strong> from golimitlessagi.com/gavin</p><p>Name: ${escape(lead.name)}<br>Phone: <a href="tel:${escape(lead.phone)}">${escape(lead.phone)}</a><br>Best time: ${escape(lead.bestTime)}</p>`,
  });
  if (sent.error) return response({ error: "That didn't go through. Please text me instead." }, 503);
  return response({ ok: true });
}
