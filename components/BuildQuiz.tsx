"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  QUESTIONS,
  scoreAnswers,
  type Answers,
  type Recommendation,
} from "@/lib/quiz";

type Phase = "intro" | "quiz" | "result";
type SubmitStatus = "idle" | "sending" | "ok" | "error";

const TOTAL_STEPS = QUESTIONS.length + 1; // questions + contact step

const emptyContact = {
  name: "",
  email: "",
  business: "",
  phone: "",
  website: "", // honeypot
};

export default function BuildQuiz() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [otherOpen, setOtherOpen] = useState<Record<string, boolean>>({});
  const [contact, setContact] = useState(emptyContact);
  const [reco, setReco] = useState<Recommendation | null>(null);
  const [submit, setSubmit] = useState<SubmitStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const onContactStep = step === QUESTIONS.length;
  const question = onContactStep ? null : QUESTIONS[step];
  const progress = Math.round(((step + (phase === "result" ? 1 : 0)) / TOTAL_STEPS) * 100);

  function pickOption(value: string) {
    if (!question) return;
    setOtherOpen((o) => ({ ...o, [question.id]: false }));
    setAnswers((a) => ({ ...a, [question.id]: value }));
    // brief highlight before advancing
    window.setTimeout(goNext, 220);
  }

  function pickOther() {
    if (!question) return;
    // Open the free-text field and clear any prior selection for this question.
    setOtherOpen((o) => ({ ...o, [question.id]: true }));
    setAnswers((a) => ({ ...a, [question.id]: "" }));
  }

  function goNext() {
    setStep((s) => Math.min(s + 1, QUESTIONS.length));
  }

  function goBack() {
    if (step === 0) {
      setPhase("intro");
      return;
    }
    setStep((s) => Math.max(s - 1, 0));
  }

  async function finish(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const recommendation = scoreAnswers(answers);
    setReco(recommendation);
    setPhase("result");
    setSubmit("sending");

    try {
      const res = await fetch("/api/quiz-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: contact.name,
          email: contact.email,
          business: contact.business,
          phone: contact.phone,
          website: contact.website,
          answers,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Submission failed");
      }
      setSubmit("ok");
    } catch (err) {
      setSubmit("error");
      setErrorMsg(
        err instanceof Error ? err.message : "We couldn't send your answers."
      );
    }
  }

  function restart() {
    setPhase("intro");
    setStep(0);
    setAnswers({});
    setContact(emptyContact);
    setReco(null);
    setSubmit("idle");
    setErrorMsg("");
  }

  // ---- Intro ----
  if (phase === "intro") {
    return (
      <div className="quiz-shell">
        <div className="quiz-intro">
          <span className="eyebrow">Build Your Agent</span>
          <h1>Let&apos;s find the agent worth building for your business.</h1>
          <p className="lead">
            {`Answer ${QUESTIONS.length} quick questions about how your business runs. We'll show you exactly what we'd build — and where it pays off first. Takes about 2 minutes.`}
          </p>
          <button className="btn btn-world" onClick={() => setPhase("quiz")}>
            Start the quiz
            <Arrow />
          </button>
        </div>
      </div>
    );
  }

  // ---- Result ----
  if (phase === "result" && reco) {
    const who = contact.business?.trim() || "your business";
    const bookHref = `/book?service=${reco.serviceKey}`;
    return (
      <div className="quiz-shell">
        <div className="quiz-result">
          <span className="eyebrow">Your agent build</span>
          <h2>Here&apos;s the agent we&apos;d build for {who}.</h2>
          <p className="result-title">{reco.title}</p>
          <p className="lead">{reco.summary}</p>

          <div className="result-modules">
            {reco.modules.map((m) => (
              <div className="result-module" key={m.name}>
                <h3>{m.name}</h3>
                <p>{m.detail}</p>
              </div>
            ))}
          </div>

          <p className="result-why">{reco.why}</p>

          <div className="result-foot">
            <span className="result-tier">Suggested start: {reco.suggestedTier}</span>
            <a href={bookHref} className="btn btn-world">
              Book your build call
              <Arrow />
            </a>
          </div>

          {submit === "error" && (
            <p className="quiz-note">
              Heads up: we saved your result here, but couldn&apos;t send it to
              the team just now. {errorMsg}
            </p>
          )}

          <button className="quiz-restart" onClick={restart}>
            Start over
          </button>
        </div>
      </div>
    );
  }

  // ---- Quiz (questions + contact) ----
  return (
    <div className="quiz-shell">
      <div className="quiz-progress" aria-hidden="true">
        <div className="quiz-progress-bar" style={{ width: `${progress}%` }} />
      </div>
      <div className="quiz-step-count">
        Step {step + 1} of {TOTAL_STEPS}
      </div>

      <div className="quiz-card" key={step}>
        {question ? (
          <>
            <h2 className="quiz-prompt">{question.prompt}</h2>
            {question.helper && <p className="quiz-helper">{question.helper}</p>}

            {question.type === "single" ? (
              <div className="quiz-options">
                {question.options!.map((opt) => {
                  const selected =
                    answers[question.id] === opt.value && !otherOpen[question.id];
                  return (
                    <button
                      key={opt.value}
                      className={`quiz-option${selected ? " is-selected" : ""}`}
                      onClick={() => pickOption(opt.value)}
                    >
                      <span className="quiz-option-dot" />
                      {opt.label}
                    </button>
                  );
                })}

                {question.allowOther && (
                  <button
                    className={`quiz-option${
                      otherOpen[question.id] ? " is-selected" : ""
                    }`}
                    onClick={pickOther}
                  >
                    <span className="quiz-option-dot" />
                    Something else — let me type it
                  </button>
                )}

                {question.allowOther && otherOpen[question.id] && (
                  <div className="quiz-other">
                    <input
                      autoFocus
                      value={answers[question.id] ?? ""}
                      placeholder="Type your answer..."
                      onChange={(e) =>
                        setAnswers((a) => ({
                          ...a,
                          [question.id]: e.target.value,
                        }))
                      }
                      onKeyDown={(e) => {
                        if (
                          e.key === "Enter" &&
                          (answers[question.id] ?? "").trim()
                        ) {
                          e.preventDefault();
                          goNext();
                        }
                      }}
                    />
                    <button
                      className="btn btn-world"
                      onClick={goNext}
                      disabled={(answers[question.id] ?? "").trim().length === 0}
                    >
                      Continue
                      <Arrow />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <QuizText
                value={answers[question.id] ?? ""}
                placeholder={question.placeholder}
                onChange={(v) =>
                  setAnswers((a) => ({ ...a, [question.id]: v }))
                }
                onNext={goNext}
                optional={question.optional}
              />
            )}
          </>
        ) : (
          <form className="quiz-contact" onSubmit={finish}>
            <h2 className="quiz-prompt">Where do we send your AI build?</h2>
            <p className="quiz-helper">
              We&apos;ll show your result on the next screen and follow up with
              your tailored plan.
            </p>

            <div className="quiz-field-grid">
              <label>
                <span>Your name</span>
                <input
                  value={contact.name}
                  onChange={(e) => setContact({ ...contact, name: e.target.value })}
                  autoComplete="name"
                  required
                />
              </label>
              <label>
                <span>Business</span>
                <input
                  value={contact.business}
                  onChange={(e) =>
                    setContact({ ...contact, business: e.target.value })
                  }
                  autoComplete="organization"
                />
              </label>
            </div>
            <div className="quiz-field-grid">
              <label>
                <span>Email</span>
                <input
                  type="email"
                  value={contact.email}
                  onChange={(e) => setContact({ ...contact, email: e.target.value })}
                  autoComplete="email"
                  required
                />
              </label>
              <label>
                <span>Phone</span>
                <input
                  value={contact.phone}
                  onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                  autoComplete="tel"
                />
              </label>
            </div>

            <label className="honeypot" aria-hidden="true">
              <span>Website</span>
              <input
                value={contact.website}
                onChange={(e) => setContact({ ...contact, website: e.target.value })}
                tabIndex={-1}
                autoComplete="off"
              />
            </label>

            <button className="btn btn-world" disabled={submit === "sending"}>
              {submit === "sending" ? "Building..." : "See my AI build"}
              <Arrow />
            </button>
          </form>
        )}
      </div>

      <button className="quiz-back" onClick={goBack}>
        ← Back
      </button>
    </div>
  );
}

function QuizText({
  value,
  placeholder,
  onChange,
  onNext,
  optional,
}: {
  value: string;
  placeholder?: string;
  onChange: (v: string) => void;
  onNext: () => void;
  optional?: boolean;
}) {
  return (
    <div className="quiz-text">
      <textarea
        value={value}
        placeholder={placeholder}
        rows={3}
        onChange={(e) => onChange(e.target.value)}
      />
      <button
        className="btn btn-world"
        onClick={onNext}
        disabled={!optional && value.trim().length === 0}
      >
        Continue
        <Arrow />
      </button>
    </div>
  );
}

function Arrow() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
