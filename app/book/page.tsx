import Nav from "@/components/Nav";
import LeadIntakeForm, { type ServiceKey } from "@/components/LeadIntakeForm";

const serviceCopy: Record<
  ServiceKey,
  { eyebrow: string; title: string; copy: string }
> = {
  bella: {
    eyebrow: "Bella Receptionist",
    title: "Let's get Bella ready to answer.",
    copy: "Tell me where calls are getting missed, how appointments should be handled, and what a good first week would look like.",
  },
  website: {
    eyebrow: "AI Website Build",
    title: "Let's build the website front door.",
    copy: "Share the business, what customers need to do next, and whether AI chat or a booking path should be included from day one.",
  },
  system: {
    eyebrow: "Full Presence System",
    title: "Let's connect the whole front office.",
    copy: "Website, Bella, AI chat, follow-ups, and the simple automations that help the business respond faster.",
  },
};

function normalizeService(value: unknown): ServiceKey {
  if (value === "website" || value === "system" || value === "bella") {
    return value;
  }

  return "bella";
}

type BookPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function BookPage({ searchParams }: BookPageProps) {
  const params = searchParams ? await searchParams : {};
  const serviceParam = Array.isArray(params.service)
    ? params.service[0]
    : params.service;
  const service = normalizeService(serviceParam);
  const active = serviceCopy[service];

  return (
    <>
      <Nav />
      <main>
        <section className="book-page">
          <div className="wrap book-wrap">
            <div className="book-copy">
              <span className="eyebrow">{active.eyebrow}</span>
              <h1>{active.title}</h1>
              <p className="lead">{active.copy}</p>
              <div className="book-visual" aria-hidden="true">
                <span className="book-pulse" />
                <span className="book-phone" />
                <span className="book-site" />
                <span className="book-check" />
              </div>
            </div>

            <LeadIntakeForm key={service} defaultService={service} />
          </div>
        </section>
      </main>
    </>
  );
}
