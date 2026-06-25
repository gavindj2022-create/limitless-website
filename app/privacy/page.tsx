import Nav from "@/components/Nav";
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy - Limitless",
  description: "How Limitless collects, uses, and protects your information.",
};

export default function PrivacyPage() {
  return (
    <>
      <Nav />
      <main id="main">
        <section className="section">
          <div className="wrap" style={{ maxWidth: 760 }}>
            <div className="section-head">
              <span className="eyebrow">Legal</span>
              <h2>Privacy Policy</h2>
              <p className="lead">Last updated: June 25, 2026</p>
            </div>

            <div className="legal-body">
              <p>
                Limitless (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;)
                builds AI automation, receptionist, and website services for
                local businesses. This policy explains what information we
                collect when you visit our site or use our services, and how we
                use it.
              </p>

              <h3>Information we collect</h3>
              <p>
                When you submit a contact form, request a demo, book a call, or
                use our ROI calculator, we collect the details you provide —
                such as your name, business name, email, and phone number. When
                you create an account, we collect your login details through our
                authentication provider. If you subscribe to a plan, payment is
                processed by Stripe; we do not store your full card details.
              </p>

              <h3>How we use it</h3>
              <p>
                We use your information to respond to inquiries, deliver and
                support our services, process payments, send service-related
                messages, and improve what we offer. We do not sell your
                personal information.
              </p>

              <h3>Sharing</h3>
              <p>
                We share information only with the service providers that help
                us operate — for example, Stripe (payments), our email provider
                (transactional email), our hosting and database providers, and
                authentication providers — and only as needed to deliver the
                service. We may disclose information if required by law.
              </p>

              <h3>Data retention</h3>
              <p>
                We keep your information for as long as your account or
                engagement is active, and as needed to meet legal, tax, or
                accounting obligations. You can request deletion at any time.
              </p>

              <h3>Your choices</h3>
              <p>
                You may request access to, correction of, or deletion of your
                personal information by emailing us. You can opt out of
                non-essential communications at any time.
              </p>

              <h3>Contact</h3>
              <p>
                Questions about this policy? Email{" "}
                <a href="mailto:gavindj2022@gmail.com">gavindj2022@gmail.com</a>.
              </p>

              <p style={{ marginTop: 32 }}>
                <Link href="/">← Back to home</Link>
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
