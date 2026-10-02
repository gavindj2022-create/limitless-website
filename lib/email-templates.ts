// Branded email templates for the consulting lead flow. Email-safe markup,
// inline styles, and no React or Next.js imports.

const C = {
  bg: "#F1EEE9",
  card: "#FFFFFF",
  ink: "#0B0B0A",
  ink2: "#4C4B48",
  muted: "#908E89",
  warm: "#C2997A",
  cyan: "#7A93C2",
  border: "rgba(12,12,11,0.07)",
};

function esc(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function shell(innerHtml: string, preheader = ""): string {
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="light" />
  </head>
  <body style="margin:0;padding:0;background:${C.bg};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:${C.ink};">
    <span style="display:none!important;visibility:hidden;opacity:0;height:0;width:0;overflow:hidden;mso-hide:all;">${esc(preheader)}</span>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.bg};padding:24px 12px;">
      <tr><td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:${C.card};border-radius:20px;overflow:hidden;border:1px solid ${C.border};">
          <tr><td style="height:6px;line-height:6px;font-size:6px;background:linear-gradient(90deg,${C.warm},${C.cyan});">&nbsp;</td></tr>
          <tr><td style="padding:26px 32px 6px;">
            <table role="presentation" cellpadding="0" cellspacing="0"><tr>
              <td style="vertical-align:middle;"><div style="width:34px;height:34px;border-radius:50%;background:${C.ink};color:#fff;text-align:center;line-height:34px;font-size:18px;font-weight:bold;">∞</div></td>
              <td style="vertical-align:middle;padding-left:10px;font-weight:bold;font-size:18px;letter-spacing:-0.01em;">Limitless</td>
            </tr></table>
          </td></tr>
          ${innerHtml}
          <tr><td style="padding:22px 32px;border-top:1px solid ${C.border};">
            <div style="font-size:13px;color:${C.muted};line-height:1.5;"><strong style="color:${C.ink2};">Limitless</strong>, practical AI automation for local businesses.<br />Reply to this email and a real person will get back to you.</div>
          </td></tr>
        </table>
        <div style="font-size:11px;color:${C.muted};padding:14px 0;">© ${new Date().getFullYear()} Limitless. All rights reserved.</div>
      </td></tr>
    </table>
  </body>
</html>`;
}

export function consultingLeadNotificationEmail(lead: {
  source: "book" | "bella";
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  page: string;
}): string {
  const inner = `<tr><td style="padding:18px 32px 28px;line-height:1.6;">
    <div style="font-size:12px;letter-spacing:1px;text-transform:uppercase;color:${C.muted};">New ${lead.source === "bella" ? "Bella mini audit" : "website audit"} lead</div>
    <h1 style="font-size:24px;margin:10px 0;">${esc(lead.name)}</h1>
    <p>Email: ${esc(lead.email)}<br />Phone: ${esc(lead.phone || "Not provided")}<br />Business: ${esc(lead.company || "Not provided")}<br />Page: ${esc(lead.page)}</p>
    <p style="white-space:pre-wrap;">${esc(lead.message)}</p>
  </td></tr>`;
  return shell(inner, `New ${lead.source === "bella" ? "Bella" : "website"} lead`);
}

export function consultingLeadAutoreplyEmail(name: string): string {
  const calendarUrl = "https://calendar.app.google/CaCfThGeGv6bMpXX9";
  const inner = `<tr><td style="padding:18px 32px 28px;line-height:1.6;">
    <h1 style="font-size:24px;margin:10px 0;">Got it, ${esc(name)}.</h1>
    <p>Gavin will reach out to set up your free 30-minute call. After the call, you will get a written plan in 3 business days.</p>
    <p>If you prefer, <a href="${calendarUrl}" style="color:${C.ink};">pick a time on the calendar</a>.</p>
  </td></tr>`;
  return shell(inner, "We got your request. Here is what happens next.");
}
