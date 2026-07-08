// Pure definition + scoring for the "Build Your AI" consulting quiz.
// Imported by the API route, the client component, and the unit test, so it
// must stay free of React / Next / server-only imports.

export type ServiceKey = "bella" | "website" | "system";
export type Bucket = "bella" | "website" | "automations";

export interface QuizOption {
  value: string;
  label: string;
  weights?: Partial<Record<Bucket, number>>;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  helper?: string;
  type: "single" | "text";
  options?: QuizOption[];
  placeholder?: string;
  optional?: boolean;
  /** When true, a single-choice question also offers a "type your own" answer. */
  allowOther?: boolean;
}

export type Answers = Record<string, string>;

export interface RecoModule {
  name: string;
  detail: string;
}

export interface Recommendation {
  serviceKey: ServiceKey;
  title: string;
  summary: string;
  modules: RecoModule[];
  why: string;
  suggestedTier: string;
  scores: Record<Bucket, number>;
}

export const QUESTIONS: QuizQuestion[] = [
  {
    id: "industry",
    prompt: "What kind of business do you run?",
    helper: "So we tailor the build to how your customers actually behave.",
    type: "single",
    allowOther: true,
    options: [
      { value: "salon", label: "Salon / barber / spa" },
      { value: "gym", label: "Gym / fitness studio" },
      { value: "medspa", label: "Med-spa / aesthetics" },
      { value: "contractor", label: "Home services / contractor" },
      { value: "dental", label: "Dental / clinic / practice" },
      { value: "realestate", label: "Real estate / property" },
      { value: "restaurant", label: "Restaurant / hospitality" },
    ],
  },
  {
    id: "reach",
    prompt: "How do most of your customers reach you today?",
    type: "single",
    allowOther: true,
    options: [
      { value: "phone", label: "Phone calls", weights: { bella: 2 } },
      { value: "website", label: "My website", weights: { website: 2 } },
      { value: "social", label: "Social DMs", weights: { website: 1, automations: 1 } },
      { value: "walkins", label: "Walk-ins", weights: { bella: 1 } },
      { value: "referrals", label: "Word of mouth / referrals", weights: { automations: 1 } },
    ],
  },
  {
    id: "callHandling",
    prompt: "When a call comes in and you're busy, what usually happens?",
    type: "single",
    allowOther: true,
    options: [
      { value: "voicemail", label: "It goes to voicemail", weights: { bella: 2 } },
      { value: "ringout", label: "It just rings out", weights: { bella: 3 } },
      { value: "staff", label: "A staff member grabs it", weights: { bella: 0 } },
      { value: "missed", label: "Honestly, we miss it", weights: { bella: 3 } },
    ],
  },
  {
    id: "callsMissed",
    prompt: "Roughly how many calls do you miss in a typical week?",
    type: "single",
    options: [
      { value: "0-2", label: "0–2", weights: { bella: 0 } },
      { value: "3-5", label: "3–5", weights: { bella: 2 } },
      { value: "6-10", label: "6–10", weights: { bella: 3 } },
      { value: "10plus", label: "10+", weights: { bella: 4 } },
    ],
  },
  {
    id: "website",
    prompt: "What's your website situation right now?",
    type: "single",
    allowOther: true,
    options: [
      { value: "none", label: "I don't really have one", weights: { website: 4 } },
      { value: "old", label: "Old and outdated", weights: { website: 3 } },
      { value: "okay", label: "Decent, but it doesn't convert", weights: { website: 2 } },
      { value: "modern", label: "Modern and working well", weights: { website: 0 } },
    ],
  },
  {
    id: "siteAction",
    prompt: "How easy is it for someone to take action on your site (book, quote, contact)?",
    type: "single",
    allowOther: true,
    options: [
      { value: "nosite", label: "There's nowhere to do that", weights: { website: 3 } },
      { value: "hard", label: "Hard — they have to dig", weights: { website: 3 } },
      { value: "okay", label: "It's okay", weights: { website: 1 } },
      { value: "easy", label: "Easy and obvious", weights: { website: 0 } },
    ],
  },
  {
    id: "booking",
    prompt: "How do you handle booking and appointments?",
    type: "single",
    allowOther: true,
    options: [
      { value: "phoneonly", label: "Phone only", weights: { bella: 2, automations: 1 } },
      { value: "manual", label: "Manually (texts, paper, back-and-forth)", weights: { automations: 2, bella: 1 } },
      { value: "tool", label: "A booking tool", weights: { automations: 0 } },
      { value: "none", label: "We don't really book ahead", weights: { automations: 1 } },
    ],
  },
  {
    id: "followUp",
    prompt: "After a new customer, do you follow up — reviews, reminders, rebooking?",
    type: "single",
    allowOther: true,
    options: [
      { value: "never", label: "Almost never", weights: { automations: 3 } },
      { value: "manual", label: "Sometimes, manually", weights: { automations: 2 } },
      { value: "automated", label: "It's automated", weights: { automations: 0 } },
    ],
  },
  {
    id: "timeSink",
    prompt: "Which of these eats the most of your time?",
    type: "single",
    allowOther: true,
    options: [
      { value: "phones", label: "Answering phones", weights: { bella: 3 } },
      { value: "leads", label: "Chasing leads & follow-ups", weights: { automations: 2, website: 1 } },
      { value: "scheduling", label: "Scheduling", weights: { bella: 1, automations: 2 } },
      { value: "admin", label: "Admin & invoicing", weights: { automations: 3 } },
      { value: "marketing", label: "Marketing & getting found", weights: { website: 2 } },
    ],
  },
  {
    id: "goal",
    prompt: "What's your main goal for the next 90 days?",
    type: "single",
    allowOther: true,
    options: [
      { value: "leads", label: "More leads", weights: { website: 2, automations: 1 } },
      { value: "calls", label: "Stop missing calls", weights: { bella: 3 } },
      { value: "professional", label: "Look more professional", weights: { website: 3 } },
      { value: "savetime", label: "Save time", weights: { automations: 3 } },
      { value: "scale", label: "Scale the team", weights: { automations: 2, bella: 1 } },
    ],
  },
  {
    id: "tools",
    prompt: "What tools do you already use?",
    helper: "Optional — e.g. Google, QuickBooks, Square, a CRM, or nothing yet.",
    type: "text",
    placeholder: "Google Calendar, Square, QuickBooks...",
    optional: true,
  },
  {
    id: "automateOne",
    prompt: "What's the one task you'd love to stop doing yourself?",
    helper: "Optional — it just helps us know where to start.",
    type: "text",
    placeholder: "Type here…",
    optional: true,
  },
  {
    id: "budget",
    prompt: "What monthly budget feels comfortable for a tool that pays for itself?",
    type: "single",
    options: [
      { value: "under100", label: "Under $100" },
      { value: "100-300", label: "$100–300" },
      { value: "300-600", label: "$300–600" },
      { value: "600plus", label: "$600+" },
      { value: "notsure", label: "Not sure yet" },
    ],
  },
];

const TIER_BY_SERVICE: Record<ServiceKey, string> = {
  bella: "Bella Receptionist — $199/mo",
  website: "Website Starter — $29/mo",
  system: "Full Presence — $499/mo",
};

const BELLA_MODULE: RecoModule = {
  name: "Bella — AI receptionist",
  detail: "Answers calls 24/7, books appointments, texts back missed callers, and sends you a summary after every call.",
};
const WEBSITE_MODULE: RecoModule = {
  name: "AI-powered website",
  detail: "A fast, clean site with an AI chatbot and lead forms so visitors can ask, quote, and book in seconds.",
};
const AUTOMATIONS_MODULE: RecoModule = {
  name: "Follow-up automations",
  detail: "Automatic review requests, reminders, rebooking, and invoice nudges so nothing slips through the cracks.",
};
const DASHBOARD_MODULE: RecoModule = {
  name: "Owner dashboard",
  detail: "A weekly snapshot of calls, bookings, and leads — so you always know what's working.",
};

export function scoreAnswers(answers: Answers): Recommendation {
  const scores: Record<Bucket, number> = { bella: 0, website: 0, automations: 0 };

  for (const q of QUESTIONS) {
    if (q.type !== "single" || !q.options) continue;
    const val = answers[q.id];
    if (!val) continue;
    const opt = q.options.find((o) => o.value === val);
    if (!opt?.weights) continue;
    for (const [bucket, weight] of Object.entries(opt.weights) as [Bucket, number][]) {
      scores[bucket] += weight;
    }
  }

  const ranked = (Object.entries(scores) as [Bucket, number][]).sort(
    (a, b) => b[1] - a[1]
  );
  const [topBucket, topScore] = ranked[0];
  const secondScore = ranked[1][1];

  const painAreas = ranked.filter(([, s]) => s >= 3).length;
  const closeTop = topScore > 0 && topScore - secondScore <= 2;

  let serviceKey: ServiceKey;
  if (topScore === 0) {
    serviceKey = "system";
  } else if (topBucket === "automations") {
    serviceKey = "system";
  } else if (closeTop || painAreas >= 2) {
    serviceKey = "system";
  } else {
    serviceKey = topBucket === "bella" ? "bella" : "website";
  }

  return buildRecommendation(serviceKey, scores, answers);
}

function buildRecommendation(
  serviceKey: ServiceKey,
  scores: Record<Bucket, number>,
  answers: Answers
): Recommendation {
  const modules: RecoModule[] = [];
  const wantBella = serviceKey === "bella" || serviceKey === "system" || scores.bella >= 2;
  const wantWebsite = serviceKey === "website" || serviceKey === "system" || scores.website >= 2;
  const wantAutomations = serviceKey === "system" || scores.automations >= 2;

  if (wantBella) modules.push(BELLA_MODULE);
  if (wantWebsite) modules.push(WEBSITE_MODULE);
  if (wantAutomations) {
    modules.push(AUTOMATIONS_MODULE);
    modules.push(DASHBOARD_MODULE);
  }
  if (modules.length === 0) modules.push(BELLA_MODULE, WEBSITE_MODULE);

  const reasons: string[] = [];
  if (scores.bella >= 3) reasons.push("calls are slipping past you");
  if (scores.website >= 3) reasons.push("your website isn't pulling its weight");
  if (scores.automations >= 3) reasons.push("too much follow-up is still manual");
  const why = reasons.length
    ? `Based on your answers, ${reasons.join(", and ")} — that's where AI moves the needle first.`
    : "Based on your answers, here's the cleanest place for AI to start working for you.";

  const titleByService: Record<ServiceKey, string> = {
    bella: "Start with Bella, your AI receptionist.",
    website: "Start with an AI-powered website.",
    system: "Build the full AI front office.",
  };
  const summaryByService: Record<ServiceKey, string> = {
    bella: "Stop losing customers to missed calls and voicemail — Bella picks up, books, and follows up for you.",
    website: "Give people a fast, clean place to find you, ask questions, and book — with AI doing the talking.",
    system: "Bella answers, your site captures, and automations handle the follow-up — one connected front office.",
  };

  return {
    serviceKey,
    title: titleByService[serviceKey],
    summary: summaryByService[serviceKey],
    modules,
    why,
    suggestedTier: TIER_BY_SERVICE[serviceKey],
    scores,
  };
}

/** Human label for an answer value, for the email summary. */
export function labelFor(questionId: string, value: string): string {
  const q = QUESTIONS.find((question) => question.id === questionId);
  if (!q) return value;
  if (q.type === "text") return value;
  return q.options?.find((o) => o.value === value)?.label ?? value;
}
