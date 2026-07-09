"use client";

import { useState } from "react";
import PlusIcon from "./icons/PlusIcon";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    question: "What does Bella do?",
    answer:
      "Bella is a receptionist agent for your business. She answers calls, asks simple questions, books appointments when possible, captures lead details, and sends you a clean summary afterward.",
  },
  {
    question: "Do I need a new website for Bella to work?",
    answer:
      "No. Bella can stand on her own as a phone receptionist. The website offer is there if you also want a cleaner online presence with a chat agent, lead capture, and a simple path for customers to contact you.",
  },
  {
    question: "I am not technical. Can I still use this?",
    answer:
      "Yes. This is built for business owners who do not want to manage tech. We keep the website, chat agent, call flow, and follow-up setup simple and explain everything in plain language.",
  },
  {
    question: "What is included in the website build?",
    answer:
      "A clean mobile-friendly site, clear business positioning, contact or booking paths, lead forms, and a chat agent if you want one. The goal is to make the business easy to understand and easy to reach.",
  },
  {
    question: "Where does Olivia fit now?",
    answer:
      "Olivia is part of the add-on automation suite. Once Bella and the website are working, Olivia can help with reminders, invoices, review requests, follow-ups, reports, and other simple workflows.",
  },
  {
    question: "How long does setup take?",
    answer:
      "The first version can move quickly. Bella setup depends on the call flow, and a simple website can be built much faster than a traditional agency project because the structure, copy, chat agent, and lead capture are handled together.",
  },
  {
    question: "Can this work for any local business?",
    answer:
      "It works best for service businesses where missed calls, weak websites, and slow follow-up cost money. Salons, trades, gyms, restaurants, clinics, real estate, and appointment-based businesses are strong fits.",
  },
  {
    question: "What if I need something custom?",
    answer:
      "Start with Bella or the website first. If there is a clear repeated task after that, we can add a custom workflow, dashboard, reminder system, or follow-up process without overbuilding from day one.",
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
