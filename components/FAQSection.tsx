"use client";

import { useState } from "react";
import PlusIcon from "./icons/PlusIcon";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    question: "What exactly does Olivia do?",
    answer:
      "Olivia is your AI employee. She handles invoices, appointment reminders, follow-ups, review requests, and more — automatically. You connect your tools (Google Workspace, QuickBooks, Square, etc.) and she runs your workflows in the background. You approve actions or let her handle them autonomously.",
  },
  {
    question: "Is my business data safe?",
    answer:
      "Absolutely. We use enterprise-grade encryption for all data in transit and at rest. Your business data is never shared with other clients or used to train AI models. We're SOC 2 compliant and follow strict data retention policies. You can revoke access to any connected tool at any time.",
  },
  {
    question: "I'm not technical — can I still use this?",
    answer:
      "That's exactly who we built this for. Our onboarding wizard walks you through connecting your tools in under 10 minutes. No coding, no complicated setup. If you can send an email, you can use Limitless. And our support team is always available if you get stuck.",
  },
  {
    question: "What's the difference between Olivia and Bella?",
    answer:
      "Olivia handles your back-office workflows — invoices, reminders, follow-ups, reports. She works through email and automated actions. Bella is your AI receptionist — she answers your phone 24/7 with a natural voice, books appointments, remembers repeat callers, and sends follow-up texts. Think of Olivia as your office manager and Bella as your front desk.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes, no contracts. Cancel from your dashboard with one click. Your data stays accessible for 30 days after cancellation. We don't believe in locking people in — if we're not saving you time and money, you should be free to leave.",
  },
  {
    question: "How long does setup take?",
    answer:
      "Most businesses are up and running within 15 minutes on the Starter plan. Growth and Full Ops plans include a personal onboarding call where we set everything up together. Your first workflows start running the same day.",
  },
  {
    question: "What tools do you integrate with?",
    answer:
      "We connect with Google Workspace, QuickBooks, PayPal, Square, HubSpot, Canva, DocuSign, Calendly, and more. The Starter plan includes 3 tool connections, Growth includes all 7, and Full Ops includes unlimited connections with custom integrations for industry-specific tools.",
  },
  {
    question: "What if I need something custom?",
    answer:
      "Growth plan members get 1 custom workflow per month built by our team. Full Ops members get unlimited custom workflows, custom API integrations, and a dedicated support channel. We've built custom automations for salons, gyms, plumbers, restaurants, and dozens of other local businesses.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq">
      {FAQ_DATA.map((item, i) => (
        <div className={`faq-item${openIndex === i ? " open" : ""}`} key={i}>
          <button className="faq-q" onClick={() => toggle(i)}>
            {item.question}
            <span className="faq-toggle">
              <PlusIcon />
            </span>
          </button>
          <div className="faq-a">
            <div>
              <p>{item.answer}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
