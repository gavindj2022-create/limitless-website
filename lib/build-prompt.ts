// Generates a self-contained "build order" prompt from a quiz lead — the kind
// of prompt Gav can paste straight into a Claude Code loop to autonomously
// build, deploy, and hand off that client's full AI solution (point A -> B).
// Pure module (no React/Next imports).

import type { Recommendation } from "./quiz";

interface Contact {
  name: string;
  business?: string;
  email: string;
  phone?: string;
}

/** Build instructions keyed by the module names produced in lib/quiz.ts. */
function deliverableFor(moduleName: string): string {
  const n = moduleName.toLowerCase();
  if (n.includes("bella") || n.includes("receptionist")) {
    return "Bella AI receptionist — provision a Retell voice agent (use the DAWGS Retell API key), persona tuned to this business. It must answer calls 24/7, book appointments, text back missed callers, and send the owner a summary after each call. Provision a phone number and place a live test call.";
  }
  if (n.includes("website") || n.includes("web")) {
    return "AI website — build a fast, mobile-first site on-brand for this business with an AI chat widget, a lead form, and an easy booking path. Deploy it to a live URL (Cloudflare Pages) and confirm the form + chat work.";
  }
  if (n.includes("automation") || n.includes("follow")) {
    return "Follow-up automations — set up review requests, appointment reminders, rebooking nudges, and invoice follow-ups (Olivia / n8n). Trigger one end-to-end to verify.";
  }
  if (n.includes("dashboard")) {
    return "Owner dashboard — a simple weekly snapshot of calls, bookings, and leads so the owner always knows what's working.";
  }
  return `${moduleName} — build and deploy.`;
}

export function generateBuildPrompt(opts: {
  contact: Contact;
  reco: Recommendation;
  /** The lead's answered questions, already paired prompt -> chosen label. */
  qa: { q: string; a: string }[];
}): string {
  const { contact, reco, qa } = opts;
  const business = contact.business?.trim() || "this business";

  const profile = qa.map((item) => `- ${item.q} ${item.a}`).join("\n");

  const deliverables = reco.modules
    .map((m, i) => `${i + 1}. ${deliverableFor(m.name)}`)
    .join("\n");

  return `ROLE: You are an autonomous build agent for Limitless. Build the COMPLETE, deployed AI solution for the client below — end to end, point A to point B, where point B is a client-ready handoff product. Work autonomously and do not stop until it is live and verified.

CLIENT
- Business: ${business}
- Contact: ${contact.name} · ${contact.email}${contact.phone ? ` · ${contact.phone}` : ""}

WHAT THEY TOLD US (Build-Your-AI quiz)
${profile}

RECOMMENDED BUILD: ${reco.title}
${reco.summary}
Suggested plan: ${reco.suggestedTier}

DELIVERABLES (build every one that applies)
${deliverables}

REQUIREMENTS
- Everything must be DEPLOYED and live (real URLs / a real phone number) — not local mockups.
- Verify each piece actually works: place the test call, submit the form, trigger an automation.
- Keep it simple, professional, and business-friendly. Match the client's vibe.
- Reuse existing Limitless assets/skills where they fit (e.g. the website factory, Bella/Retell setup, deploy pipeline).

DEFINITION OF DONE (Point B — the handoff product)
- A live, working system for ${business} with all recommended modules running.
- A one-page client handoff: what was built, every live link/login, how to use it, and the monthly price (${reco.suggestedTier}).
- Saved to the vault at Projects/Clients/${business}/.

Begin now. Move through each deliverable in order until the handoff is complete.`;
}
