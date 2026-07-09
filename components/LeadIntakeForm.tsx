"use client";

import { FormEvent, useState } from "react";

export type ServiceKey = "bella" | "website" | "system";

const services: Array<{ value: ServiceKey; label: string }> = [
  { value: "bella", label: "Bella — receptionist agent" },
  { value: "website", label: "Agent-powered website" },
  { value: "system", label: "Full presence system" },
];

type FormState = {
  service: ServiceKey;
  name: string;
  email: string;
  phone: string;
  business: string;
  message: string;
  website: string;
};

type LeadIntakeFormProps = {
  defaultService: ServiceKey;
};

const initialTextFields = {
  name: "",
  email: "",
  phone: "",
  business: "",
  message: "",
  website: "",
};

export default function LeadIntakeForm({
  defaultService,
}: LeadIntakeFormProps) {
  const [form, setForm] = useState<FormState>({
    service: defaultService,
    ...initialTextFields,
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const [error, setError] = useState("");

  function updateField(
    field: keyof FormState,
    value: FormState[keyof FormState]
  ) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setError("");

    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setStatus("sent");
      setForm((current) => ({
        service: current.service,
        ...initialTextFields,
      }));
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof Error
          ? err.message
          : "The form did not send. Please try again."
      );
    }
  }

  return (
    <form className="lead-form" onSubmit={submit}>
      <div className="lead-form-head">
        <span>Quick intake</span>
        <h2>Tell me what to build first.</h2>
      </div>

      <label>
        <span>Start with</span>
        <select
          value={form.service}
          onChange={(event) =>
            updateField("service", event.target.value as ServiceKey)
          }
        >
          {services.map((service) => (
            <option key={service.value} value={service.value}>
              {service.label}
            </option>
          ))}
        </select>
      </label>

      <div className="lead-form-grid">
        <label>
          <span>Your name</span>
          <input
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            autoComplete="name"
            required
          />
        </label>
        <label>
          <span>Email</span>
          <input
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
            autoComplete="email"
            type="email"
            required
          />
        </label>
      </div>

      <div className="lead-form-grid">
        <label>
          <span>Phone</span>
          <input
            value={form.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            autoComplete="tel"
          />
        </label>
        <label>
          <span>Business</span>
          <input
            value={form.business}
            onChange={(event) => updateField("business", event.target.value)}
            autoComplete="organization"
          />
        </label>
      </div>

      <label>
        <span>What should this help with?</span>
        <textarea
          value={form.message}
          onChange={(event) => updateField("message", event.target.value)}
          rows={5}
          placeholder="Missed calls, a cleaner website, bookings, a chat agent, follow-ups..."
          required
        />
      </label>

      <label className="honeypot" aria-hidden="true">
        <span>Website</span>
        <input
          value={form.website}
          onChange={(event) => updateField("website", event.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </label>

      <button className="btn btn-primary" disabled={status === "sending"}>
        {status === "sending" ? "Sending..." : "Send My Build Request"}
      </button>

      {status === "sent" && (
        <p className="lead-form-note success">
          Got it. I will review the request and follow up with the next step.
        </p>
      )}
      {status === "error" && <p className="lead-form-note">{error}</p>}
    </form>
  );
}
