// Branded HTML email templates for Limitless. Email-safe markup: tables,
// inline styles, web-safe fonts, no external CSS. Pure (no React/Next imports)
// so the API routes and preview scripts can both use them.

import type { Recommendation, RecoModule } from "./quiz";

interface Contact {
  name: string;
  business?: string;
  email: string;
  phone?: string;
}

const C = {
  bg: "#F1EEE9",
  card: "#FFFFFF",
  soft: "#F6F4F1",
  ink: "#0B0B0A",
  ink2: "#4C4B48",
  muted: "#908E89",
  warm: "#C2997A",
  cyan: "#7A93C2",
  border: "rgba(12,12,11,0.07)",
};

/** Escape user-provided text before injecting into HTML. */
function esc(s: unknown): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function moduleEmoji(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("bella") || n.includes("receptionist")) return "📞";
  if (n.includes("website") || n.includes("web")) return "🌐";
  if (n.includes("dashboard")) return "📊";
  if (n.includes("automation") || n.includes("follow")) return "⚙️";
  return "✨";
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
    <span style="display:none!important;visibility:hidden;opacity:0;height:0;width:0;overflow:hidden;mso-hide:all;">${preheader}</span>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.bg};padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:${C.card};border-radius:20px;overflow:hidden;border:1px solid ${C.border};">
            <tr><td style="height:6px;line-height:6px;font-size:6px;background:linear-gradient(90deg,${C.warm},${C.cyan});">&nbsp;</td></tr>
            <tr>
              <td style="padding:26px 32px 6px;">
                <table role="presentation" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="vertical-align:middle;">
                      <div style="width:34px;height:34px;border-radius:50%;background:${C.ink};color:#fff;text-align:center;line-height:34px;font-size:18px;font-weight:bold;">∞</div>
                    </td>
                    <td style="vertical-align:middle;padding-left:10px;font-weight:bold;font-size:18px;letter-spacing:-0.01em;">Limitless</td>
                  </tr>
                </table>
              </td>
            </tr>
            ${innerHtml}
            <tr>
              <td style="padding:22px 32px;border-top:1px solid ${C.border};">
                <div style="font-size:13px;color:${C.muted};line-height:1.5;">
                  <strong style="color:${C.ink2};">Limitless</strong> — practical AI automation for local businesses.<br/>
                  Just reply to this email and a real person will get back to you.
                </div>
              </td>
            </tr>
          </table>
          <div style="font-size:11px;color:${C.muted};padding:14px 0;">© ${new Date().getFullYear()} Limitless. All rights reserved.</div>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function moduleRows(modules: RecoModule[]): string {
  return modules
    .map(
      (m) => `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.soft};border:1px solid ${C.border};border-radius:14px;margin-bottom:10px;">
        <tr>
          <td style="padding:16px 18px;vertical-align:top;width:42px;font-size:22px;">${moduleEmoji(m.name)}</td>
          <td style="padding:16px 18px 16px 0;vertical-align:top;">
            <div style="font-weight:bold;font-size:15px;color:${C.ink};">${m.name}</div>
            <div style="font-size:14px;color:${C.ink2};line-height:1.5;margin-top:3px;">${m.detail}</div>
          </td>
        </tr>
      </table>`
    )
    .join("");
}

/** Email the prospect receives after finishing the Build-Your-AI quiz. */
export function customerRecommendationEmail(opts: {
  contact: Contact;
  reco: Recommendation;
  bookUrl: string;
}): string {
  const { contact, reco, bookUrl } = opts;
  const who = esc(contact.business?.trim() || "your business");
  const inner = `
    <tr>
      <td style="padding:14px 32px 0;">
        <div style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:${C.muted};font-weight:bold;">Your AI build</div>
        <h1 style="font-size:26px;line-height:1.2;margin:10px 0 6px;color:${C.ink};">Hi ${esc(contact.name)} 👋</h1>
        <p style="font-size:16px;color:${C.ink2};margin:0;line-height:1.55;">Thanks for taking the quiz! Here's the agent we'd build for <strong>${who}</strong>:</p>
      </td>
    </tr>
    <tr>
      <td style="padding:18px 32px 0;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.soft};border:1px solid ${C.border};border-radius:16px;">
          <tr><td style="padding:20px 22px;">
            <div style="font-size:20px;font-weight:bold;color:${C.ink};">${reco.title}</div>
            <div style="font-size:15px;color:${C.ink2};margin-top:6px;line-height:1.55;">${reco.summary}</div>
          </td></tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding:22px 32px 0;">
        <div style="font-size:13px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;color:${C.muted};margin-bottom:12px;">What we'd build for you 🛠️</div>
        ${moduleRows(reco.modules)}
      </td>
    </tr>
    <tr>
      <td style="padding:8px 32px 0;">
        <p style="font-size:15px;color:${C.ink};line-height:1.6;margin:0;">💡 ${reco.why}</p>
      </td>
    </tr>
    <tr>
      <td style="padding:24px 32px 6px;" align="center">
        <a href="${bookUrl}" style="display:inline-block;background:${C.ink};color:#ffffff;text-decoration:none;padding:15px 30px;border-radius:999px;font-weight:bold;font-size:15px;">📅 Book your free build call →</a>
        <div style="font-size:13px;color:${C.muted};margin-top:12px;">Suggested starting point: <strong style="color:${C.ink2};">${reco.suggestedTier}</strong></div>
      </td>
    </tr>
    <tr><td style="height:6px;line-height:6px;font-size:6px;">&nbsp;</td></tr>`;
  return shell(inner, `Your AI build for ${who}: ${reco.title}`);
}

/** Internal notification Gav receives for each new quiz lead. */
export function leadNotificationEmail(opts: {
  contact: Contact;
  reco: Recommendation;
  qa: { q: string; a: string }[];
  bookUrl: string;
  buildPrompt: string;
}): string {
  const { contact, reco, qa, buildPrompt } = opts;
  const business = contact.business?.trim();
  const qaRows = qa
    .map(
      (item) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid ${C.border};">
          <div style="font-size:13px;color:${C.muted};">${esc(item.q)}</div>
          <div style="font-size:15px;color:${C.ink};font-weight:600;margin-top:2px;">${esc(item.a)}</div>
        </td>
      </tr>`
    )
    .join("");

  const inner = `
    <tr>
      <td style="padding:14px 32px 0;">
        <div style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:${C.muted};font-weight:bold;">🔔 New quiz lead</div>
        <h1 style="font-size:24px;line-height:1.2;margin:10px 0 4px;color:${C.ink};">${esc(contact.name)}${business ? ` · ${esc(business)}` : ""}</h1>
      </td>
    </tr>
    <tr>
      <td style="padding:14px 32px 0;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.soft};border:1px solid ${C.border};border-radius:14px;">
          <tr><td style="padding:16px 18px;font-size:15px;color:${C.ink};line-height:1.7;">
            ✉️ <a href="mailto:${esc(contact.email)}" style="color:${C.cyan};text-decoration:none;">${esc(contact.email)}</a><br/>
            ${contact.phone ? `📱 <a href="tel:${esc(contact.phone)}" style="color:${C.cyan};text-decoration:none;">${esc(contact.phone)}</a>` : `📱 <span style="color:${C.muted};">no phone given</span>`}
          </td></tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding:18px 32px 0;">
        <div style="background:linear-gradient(90deg,${C.warm},${C.cyan});border-radius:14px;padding:1px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.card};border-radius:13px;">
            <tr><td style="padding:16px 18px;">
              <div style="font-size:12px;letter-spacing:1px;text-transform:uppercase;color:${C.muted};font-weight:bold;">Recommendation</div>
              <div style="font-size:18px;font-weight:bold;color:${C.ink};margin-top:4px;">${reco.title}</div>
              <div style="font-size:14px;color:${C.ink2};margin-top:6px;">🛠️ ${reco.modules.map((m) => m.name).join(" · ")}</div>
              <div style="font-size:14px;color:${C.ink2};margin-top:4px;">💵 ${reco.suggestedTier} &nbsp;·&nbsp; Scores: Bella ${reco.scores.bella} / Web ${reco.scores.website} / Auto ${reco.scores.automations}</div>
            </td></tr>
          </table>
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding:22px 32px 0;">
        <div style="font-size:13px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;color:${C.muted};margin-bottom:4px;">Their answers 📋</div>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${qaRows}</table>
      </td>
    </tr>
    <tr>
      <td style="padding:24px 32px 0;">
        <div style="font-size:13px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;color:${C.muted};margin-bottom:6px;">🤖 Build prompt — paste into your build loop</div>
        <div style="font-size:13px;color:${C.muted};margin-bottom:10px;line-height:1.5;">Select all → copy → drop into a Claude Code loop to build, deploy &amp; hand off their full solution (point A → B).</div>
        <pre style="margin:0;white-space:pre-wrap;word-break:break-word;font-family:'SFMono-Regular',Consolas,'Liberation Mono',Menlo,monospace;font-size:12px;line-height:1.6;color:#E8E6E2;background:${C.ink};padding:16px 18px;border-radius:12px;">${esc(buildPrompt)}</pre>
      </td>
    </tr>
    <tr><td style="height:10px;line-height:10px;font-size:10px;">&nbsp;</td></tr>`;
  return shell(inner, `New lead: ${esc(contact.name)}${business ? ` (${esc(business)})` : ""} — ${reco.title}`);
}
