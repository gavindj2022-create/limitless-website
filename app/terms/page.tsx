import Nav from "@/components/Nav";
import Link from "next/link";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Terms of Service - Limitless",
  description: "The terms that govern use of Limitless services.",
};

export default function TermsPage() {
  return (
    <>
      <a href="#main" className="skip">Skip to content</a>
      <Nav />
      <main id="main">
        <section className="section">
          <div className="wrap" style={{ maxWidth: 760 }}>
            <div className="section-head">
              <span className="eyebrow">Legal</span>
              <h1>Terms of Service</h1>
              <p className="lead">Last updated: October 1, 2026</p>
            </div>

            <div className="legal-body">
              <p>
                These terms govern your use of the Limitless website and
                services. By using our site or agreeing to an engagement, you agree
                to them.
              </p>

              <h3>Our services</h3>
              <p>
                Limitless provides AI strategy, done-for-you agentic solutions,
                training, websites, and related services for businesses. The
                specific scope of an engagement is what we agree with you in writing.
              </p>

              <h3>Scope and payment</h3>
              <p>
                The free audit is followed by a written plan and clear quote.
                Work starts only after we agree on the scope, timing, and fees in
                writing. Payment terms for that work appear in the proposal or
                service agreement.
              </p>

              <h3>Acceptable use</h3>
              <p>
                You agree not to misuse the services, including by attempting to
                disrupt them, using them for unlawful purposes, or infringing
                the rights of others. You are responsible for the accuracy of
                the information you provide and for how you use delivered work.
              </p>

              <h3>Disclaimers</h3>
              <p>
                Our services are provided &quot;as is.&quot; We work hard to keep
                them reliable, but we do not guarantee specific business results,
                uninterrupted availability, or that the services will be
                error-free.
              </p>

              <h3>Limitation of liability</h3>
              <p>
                To the extent permitted by law, Limitless is not liable for
                indirect, incidental, or consequential damages. Our total
                liability for any claim is limited to the amount you paid us in
                the three months before the claim arose.
              </p>

              <h3>Changes</h3>
              <p>
                We may update these terms from time to time. Continued use after
                changes take effect means you accept the updated terms.
              </p>

              <h3>Contact</h3>
              <p>
                Questions? Email{" "}
                <a href="mailto:limitlessgav@gmail.com">limitlessgav@gmail.com</a>.
              </p>

              <p style={{ marginTop: 32 }}>
                <Link href="/">← Back to home</Link>
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
