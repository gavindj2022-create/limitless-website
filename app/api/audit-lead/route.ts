import { NextResponse } from "next/server";
import { rateLimit, rateLimitConfigs } from "@/lib/rate-limit";
import { captureConsultingLead } from "@/lib/lead-capture";
import { getClientIp, isSameOrigin, readLimitedJson } from "@/lib/request-guards";
import { consultingLeadSchema } from "@/lib/validation";

const response = (body: Record<string, unknown>, status = 200) =>
  NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return response({ error: "Request not allowed." }, 403);

  const body = await readLimitedJson(request);
  if (!body.ok) {
    return response({ error: body.status === 413 ? "Request too large." : "Invalid request." }, body.status);
  }

  const parsed = consultingLeadSchema.safeParse(body.value);
  if (!parsed.success) {
    return response(
      { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
      400
    );
  }
  const lead = parsed.data;

  // Quietly discard bot submissions without mailing or writing personal data.
  if (lead.website) return response({ ok: true });

  const ip = getClientIp(request);
  const allowed = rateLimit.check(`consulting-lead:${ip}`, rateLimitConfigs.contact);
  if (!allowed.success) return response({ error: "Too many requests. Try again later." }, 429);

  const result = await captureConsultingLead(lead);
  if (!result.accepted) return response({ error: "We could not send this yet. Please try again or email Gavin directly." }, 503);
  return response({ ok: true });
}
