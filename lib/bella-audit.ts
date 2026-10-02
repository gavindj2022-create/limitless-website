export const auditFields = ["businessType", "timeSink", "leadHandling", "currentTools"] as const;
export type AuditField = (typeof auditFields)[number];
export type AuditAnswers = Record<AuditField, string>;

export const auditQuestions: Record<AuditField, string> = {
  businessType: "What kind of business do you run?",
  timeSink: "What takes up the most time each week?",
  leadHandling: "How do you handle calls and new leads today?",
  currentTools: "Which tools do you already use?",
};

export function nextAuditField(answers: Partial<AuditAnswers>): AuditField | null {
  return auditFields.find((field) => !answers[field]?.trim()) ?? null;
}

export function scriptedAuditSummary(answers: AuditAnswers): string {
  const text = `${answers.timeSink} ${answers.leadHandling}`.toLowerCase();
  const suggestions: string[] = [];
  if (/\b(?:calls?|phones?|voicemails?|answer(?:ing)?|miss(?:ed|ing)?)\b/.test(text)) suggestions.push("a front desk agent to handle calls and hand off when needed");
  if (/\b(?:leads?|follow(?:ing)?(?:[- ]up)?|inquir(?:y|ies)|messages?|text(?:s|ing)?|repl(?:y|ies))\b/.test(text)) suggestions.push("a lead follow-up flow so people hear back promptly");
  if (/\b(?:e-?mails?|inbox|admin|paperwork|papers?|reports?|scheduling|schedules?|booking|bookkeeping|invoices?|invoicing|quotes?|estimates?)\b/.test(text)) suggestions.push("a simple workflow for the repetitive admin work");
  if (suggestions.length === 0) suggestions.push("a practical workflow for the task that takes the most time");
  return `Based on what you shared, we could explore ${suggestions.slice(0, 3).join(", ")}. Gavin can check the fit on a free 30-minute audit and send you a written plan in 3 business days. What name and email should we use to pass this to him?`;
}

export function renderSelectedSolutions(services: string[]): string | null {
  const labels: Record<string, string> = {
    advise: "an AI strategy and audit plan",
    build: "a done-for-you agentic solution",
    train: "one-on-one training for you and your team",
  };
  const selected = [...new Set(services)].filter((service) => service in labels).slice(0, 3);
  if (selected.length === 0) return null;
  return `Based on what you shared, we could explore ${selected.map((service) => labels[service]).join(", ")}. Gavin can check the fit on a free 30-minute audit and send you a written plan in 3 business days. What name and email should we use to pass this to him?`;
}
