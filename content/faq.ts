export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  keywords: readonly string[];
};

/** Shown on /faq and used by Bella. Keep every answer true and sourced from limitlessFacts. */
export const faqItems: FaqItem[] = [
  {
    id: "services",
    question: "What does Limitless do?",
    answer: "We help small-business owners put AI to work in three ways: Advise (a free audit and a written plan), Build (done-for-you agents that handle busywork like calls, follow-up, and admin), and Train (one-on-one training so your team can run them).",
    keywords: ["what do you do", "what does limitless do", "services", "service", "offer", "advise", "build", "train", "help with", "what can you do", "agentic"],
  },
  {
    id: "data",
    question: "Is my customer data safe?",
    answer: "Your data stays yours. We connect only what an agent needs, use your own accounts where possible, and you can switch it off anytime. Read our privacy and security page for the details.",
    keywords: ["data", "privacy", "private", "safe", "secure", "security", "customer information"],
  },
  {
    id: "technical",
    question: "Do I need to be techy?",
    answer: "No. We set things up for you and train you one-on-one, in plain English. Your team gets a hand-off after every build.",
    keywords: ["techy", "technical", "tech savvy", "computers", "code", "coding", "training", "learn", "not good with", "set up"],
  },
  {
    id: "cost",
    question: "How much does it cost?",
    answer: "The audit is free. After it you get a written plan with a clear quote.",
    keywords: ["cost", "price", "pricing", "charge", "fee", "expensive"],
  },
  {
    id: "start",
    question: "How do I get started?",
    answer: "Book a free 30-minute audit with Gavin on the Book page, or I can run a quick mini audit right here and pass it to him.",
    keywords: ["get started", "getting started", "start", "sign up", "next step", "book", "schedule", "appointment"],
  },
  {
    id: "timing",
    question: "How long does setup take?",
    answer: "It depends on what we build. Your written plan gives you the timeline before any work starts.",
    keywords: ["setup time", "how long", "timeline", "duration", "how fast", "how quickly"],
  },
  {
    id: "bella",
    question: "What can a front desk agent like Bella do?",
    answer: "On the phone, a front desk agent answers calls, handles common questions, and hands off to a person when one should take over. Call (312) 313-1478 to hear ours. Here in chat I can answer questions and run a free mini audit, but I can't book appointments or see a calendar.",
    keywords: ["bella", "front desk", "receptionist", "answer my calls", "answer calls", "missed calls", "phone agent", "phone", "voice agent", "who are you"],
  },
  {
    id: "natural",
    question: "Will the agents sound robotic?",
    answer: "No. We design agents to talk naturally and hand off to you when a person should take over.",
    keywords: ["robotic", "robot", "sound", "natural", "human sounding", "handoff"],
  },
  {
    id: "websites",
    question: "Do you build websites?",
    answer: "Yes. We build websites that work with your agents, like the J.E. Ward site on our Our work page. You can also browse our demo sites there.",
    keywords: ["website", "websites", "web site", "site", "web design", "landing page"],
  },
  {
    id: "industries",
    question: "What kinds of businesses do you work with?",
    answer: "Small businesses, starting with local service businesses in Central Illinois: trades, salons, rentals, and more. If your week is full of calls, follow-up, and admin, we can probably help.",
    keywords: ["what businesses", "kind of business", "kinds of business", "industries", "industry", "salon", "salons", "plumbing", "plumber", "hvac", "contractor", "trades", "restaurant", "rental", "small business"],
  },
  {
    id: "tools",
    question: "Which tools do you use?",
    answer: "We work with Claude, ChatGPT, n8n, Zapier, Retell, Google Workspace, and other tools when they fit. We are independent and not affiliated with those companies.",
    keywords: ["tools", "software", "claude", "chatgpt", "zapier", "n8n", "retell", "google", "openai"],
  },
  {
    id: "remote",
    question: "Do we need to meet in person?",
    answer: "No. We're based in Central Illinois and meet by Zoom or Google Meet, so we can work with owners anywhere.",
    keywords: ["in person", "remote", "zoom", "meet", "location", "located", "where are you", "based", "illinois", "peoria", "online", "outside"],
  },
  {
    id: "audit",
    question: "What happens on the free audit?",
    answer: "We have a 30-minute call to learn how your business works. Gavin then sends a written plan within 3 business days, with no pressure.",
    keywords: ["audit", "audit call", "written plan", "consultation", "what happens", "free call"],
  },
];

/** Bella-only replies that do not belong on the FAQ page. */
export const bellaExtraItems: FaqItem[] = [
  {
    id: "gavin",
    question: "Who is Gavin?",
    answer: "Gavin Johnson is the founder of Limitless. He has a business degree from Eureka College, runs a rental business where we test every tool first, and leads every audit personally.",
    keywords: ["gavin", "who is", "founder", "owner", "who runs", "about you"],
  },
  {
    id: "human",
    question: "Can I talk to a person?",
    answer: "Yes. Book a free audit to talk with Gavin, or email limitlessgav@gmail.com.",
    keywords: ["human", "person", "real person", "talk to someone", "speak to", "contact", "email"],
  },
  {
    id: "results",
    question: "Can you guarantee results?",
    answer: "We won't promise results we can't back up. Your written plan spells out what we would build and what to expect, and we test tools in our own business first.",
    keywords: ["guarantee", "guaranteed", "results", "roi", "promise", "more sales"],
  },
];

export const limitlessFacts = [
  "Limitless is a founder-led AI consulting firm based in Central Illinois. Gavin Johnson leads each free audit.",
  "We advise, build done-for-you agentic solutions, and train owners and teams.",
  "The free audit is a 30-minute Zoom or Google Meet call followed by a written plan in 3 business days.",
  "Work is quoted after the audit. Bella cannot book appointments or see a calendar.",
  "Visitors can book a free audit at /book or call our Front Desk Agent at (312) 313-1478.",
] as const;
