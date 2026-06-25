import Nav from "@/components/Nav";
import Link from "next/link";

export const metadata = {
  title: "Terms of Service - Limitless",
  description: "The terms that govern use of Limitless services.",
};

export default function TermsPage() {
  return (
    <>
      <Nav />
      <main id="main">
        <section className="section">
          <div className="wrap" style={{ maxWidth: 760 }}>
            <div className="section-head">
              <span className="eyebrow">Legal</span>
              <h2>Terms of Service</h2>
              <p className="lead">Last updated: June 25, 2026</p>
            </div>

            <div className="legal-body">
              <p>
                These terms govern your use of the Limitless website and
                services. By using our site or signing up for a plan, you agree
                to them.
              </p>

              <h3>Our services</h3>
              <p>
                Limitless provides AI automation, AI receptionist (Bella),
                website, and related services for businesses. The specific scope
                of any engagement is what we agree with you in writing or what
                your selected plan includes.
              </p>

              <h3>Plans and payment</h3>
              <p>
                Paid plans are billed monthly through Stripe at the price shown
                at checkout. Subscriptions renew automatically until canceled.
                You can cancel at any time; access continues through the end of
                the current billing period. Fees already paid are
                non-refundable except where required by law.
              </p>

              <h3>Acceptable use</h3>
              <p>
                You agree not to misuse the services, including by attempting to
                disrupt them, using them for unlawful purposes, or infringing
                the rights of others. You are responsible for the accuracy of
                the information you provide and for activity under your account.
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
