import { Resend } from "resend";
import type { ConsultingLead } from "./validation";
import { consultingLeadAutoreplyEmail, consultingLeadNotificationEmail } from "./email-templates";
import { deliverConsultingLead, type LeadCaptureResult } from "./lead-delivery";
import { logLeadToSheet } from "./sheet-log";

export async function captureConsultingLead(lead: ConsultingLead): Promise<LeadCaptureResult> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { accepted: false, sheetLogged: false };
  const from = process.env.EMAIL_FROM || "Limitless <onboarding@resend.dev>";
  const owner = process.env.LEAD_NOTIFY_EMAIL || "limitlessgav@gmail.com";
  const resend = new Resend(key);
  return deliverConsultingLead({
    sendOwnerAlert: async () => {
      const response = await resend.emails.send({
        from,
        to: owner,
        // Hitting Reply on the alert goes straight to the lead.
        replyTo: lead.email,
        subject: `New ${lead.source === "bella" ? "Bella mini audit" : "free AI audit"} request`,
        html: consultingLeadNotificationEmail(lead),
        text: `New ${lead.source} lead\nName: ${lead.name}\nEmail: ${lead.email}\nPhone: ${lead.phone || "Not provided"}\nBusiness: ${lead.company || "Not provided"}\nPage: ${lead.page}\n\n${lead.message}`,
      });
      return !response.error && Boolean(response.data?.id);
    },
    logSheet: () => logLeadToSheet(lead),
    sendAutoreply: process.env.LEAD_AUTOREPLY === "on" ? async () => {
      await resend.emails.send({
        from,
        to: lead.email,
        subject: "We got your free AI audit request",
        html: consultingLeadAutoreplyEmail(lead.name),
        text: `Got it, ${lead.name}. Gavin will reach out to set up your free 30-minute call. After the call, you will get a written plan in 3 business days. You can also pick a time: https://calendar.app.google/CaCfThGeGv6bMpXX9`,
      });
    } : undefined,
  });
}
