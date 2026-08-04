import Nav from "@/components/Nav";
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy - Limitless",
  description:
    "How Limitless collects, uses, and protects your information, including how our AI receptionist handles phone calls, recordings, and transcripts.",
};

const SECTIONS = [
  ["who-we-are", "1. Who we are"],
  ["information-we-collect", "2. Information we collect"],
  ["ai-receptionist", "3. Calls handled by our AI receptionist"],
  ["how-we-use", "4. How we use information"],
  ["sharing", "5. How we share information"],
  ["subprocessors", "6. Service providers we use"],
  ["client-data", "7. If you are a Limitless client"],
  ["cookies", "8. Cookies and analytics"],
  ["retention", "9. How long we keep information"],
  ["security", "10. Security"],
  ["your-rights", "11. Your choices and rights"],
  ["children", "12. Children's privacy"],
  ["changes", "13. Changes to this policy"],
  ["contact", "14. Contact us"],
];

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
              <p className="lead">Last updated: July 30, 2026</p>
            </div>

            <div className="legal-body">
              <nav className="legal-toc" aria-label="On this page">
                <p className="legal-toc-title">On this page</p>
                <ul>
                  {SECTIONS.map(([id, label]) => (
                    <li key={id}>
                      <a href={`#${id}`}>{label}</a>
                    </li>
                  ))}
                </ul>
              </nav>

              <h3 id="who-we-are">1. Who we are</h3>
              <p>
                Limitless (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;)
                builds AI receptionist, website, and automation services for
                local businesses. We are based in Metamora, Illinois.
              </p>
              <p>
                This policy explains what we collect when you visit this site,
                contact us, or become a client. It also explains what happens to
                phone calls answered by our AI receptionist, which is the part
                most people want to understand, so we have given it its own
                section below.
              </p>

              <h3 id="information-we-collect">2. Information we collect</h3>
              <p>
                <strong>Information you give us.</strong> When you submit a
                contact form, request a demo, book a call, run the ROI
                calculator, or use the leak audit tool, we collect what you
                enter, typically your name, business name, email address, phone
                number, and anything you write in a message field.
              </p>
              <p>
                <strong>Account and billing information.</strong> If you create
                an account, we collect your login details through our
                authentication provider. If you subscribe to a plan, your
                payment is processed by Stripe. We never receive or store your
                full card number.
              </p>
              <p>
                <strong>Information collected automatically.</strong> Our
                hosting provider logs standard technical information such as IP
                address, browser type, pages requested, and timestamps. This is
                used to keep the site running and secure.
              </p>
              <p>
                <strong>Call information.</strong> If you call a phone number
                operated by us, including our demo line, see section 3.
              </p>

              <h3 id="ai-receptionist">
                3. Calls handled by our AI receptionist
              </h3>
              <p>
                Our AI receptionist product (&quot;Bella&quot;) answers phone
                calls. This section applies both to our own demo line and to
                calls answered on behalf of a client business.
              </p>
              <p>
                <strong>Calls are recorded and transcribed.</strong> When Bella
                answers a call, the audio of that call is recorded and stored, a
                written transcript is generated and stored, and a summary of the
                call may be produced and sent to the business owner. This
                happens on every call, not on a sample.
              </p>
              <p>
                <strong>What is captured.</strong> A recording and transcript
                will contain whatever the caller says, which commonly includes
                their name, phone number, address, the reason for their call,
                and scheduling details. Callers should not share payment card
                numbers, government identification numbers, or medical details
                with an AI receptionist, and Bella is not designed to request
                them.
              </p>
              <p>
                <strong>Consent to recording.</strong> Illinois and several
                other states require that all parties to a call consent to it
                being recorded. Where we operate a number, we are responsible
                for disclosing recording at the start of the call. Where we
                configure Bella for a client business, the client is responsible
                for ensuring calls to their number are disclosed and handled in
                line with the laws that apply to them, and we will help
                configure that disclosure. If you are on a call and do not
                consent to being recorded, say so and end the call, and you may
                contact us using section 14 to request deletion.
              </p>
              <p>
                <strong>Where call data goes.</strong> Call audio, transcripts,
                and logs are processed and stored by our voice infrastructure
                provider, Retell AI, and the voice itself is generated by
                ElevenLabs. Calls are carried by our telephony provider. These
                providers process this information so we can deliver the
                service. See section 6.
              </p>
              <p>
                <strong>How we use call data.</strong>{" "}
                We use it to deliver the
                service, pass messages and bookings to the business, monitor
                call quality and uptime, and diagnose faults. We do not sell
                call recordings or transcripts, and we do not use a client
                business&apos;s call recordings to train third-party AI models
                for our own benefit.
              </p>

              <h3 id="how-we-use">4. How we use information</h3>
              <p>
                We use information to respond to inquiries, deliver and support
                our services, process payments, send service-related messages,
                meet legal and accounting obligations, and improve what we
                offer. We do not sell your personal information.
              </p>
              <p>
                We will only send you marketing email if you asked us to or
                enquired about our services, and every such message includes a
                way to opt out.
              </p>

              <h3 id="sharing">5. How we share information</h3>
              <p>
                We share information with the service providers listed in
                section 6, and only as far as they need it to do their job for
                us. We may also disclose information where we are legally
                required to, or to protect our rights, safety, or property. If
                our business is ever sold or merged, information may transfer as
                part of that transaction, and we will say so here first.
              </p>
              <p>We do not sell your personal information to anyone.</p>

              <h3 id="subprocessors">6. Service providers we use</h3>
              <p>
                These are the third parties that may process information on our
                behalf:
              </p>
              <p>
                <strong>Retell AI</strong> — voice agent orchestration, call
                recording, transcription, and call logs.
                <br />
                <strong>ElevenLabs</strong> — synthetic voice generation for
                calls.
                <br />
                <strong>Our telephony provider</strong> — carrying phone calls
                and text messages.
                <br />
                <strong>Vercel</strong> — website hosting and request logs.
                <br />
                <strong>Stripe</strong> — subscription and payment processing.
                <br />
                <strong>Resend</strong> — transactional and notification email.
                <br />
                <strong>Our database provider</strong> — storing leads, bookings,
                and account records.
                <br />
                <strong>Google</strong> — optional sign-in, if you choose to use
                it.
              </p>
              <p>
                We may change providers as the product develops. Material
                changes will be reflected here.
              </p>

              <h3 id="client-data">7. If you are a Limitless client</h3>
              <p>
                When we run an AI receptionist, website, or automation for your
                business, information about <em>your</em> customers belongs to
                you, not to us. We process it to deliver the service you have
                asked for, on your instructions.
              </p>
              <p>
                You can ask us at any time to export your call recordings,
                transcripts, and lead records, or to delete them. If you stop
                working with us, we will delete or return your customer data on
                request, other than what we must retain for legal, tax, or
                accounting reasons.
              </p>
              <p>
                You are responsible for telling your own customers that calls to
                your business are answered by an AI assistant and recorded,
                where the law requires it. We will help you configure that
                disclosure, but we cannot give you legal advice, and you should
                confirm your obligations with your own attorney.
              </p>

              <h3 id="cookies">8. Cookies and analytics</h3>
              <p>
                This site uses cookies that are necessary for it to function,
                such as keeping you signed in and securing form submissions. We
                do not use advertising cookies or sell browsing data. Your
                browser settings let you block or delete cookies, though parts of
                the site may stop working if you do.
              </p>

              <h3 id="retention">9. How long we keep information</h3>
              <p>
                Leads and enquiries are kept while we are in contact with you and
                for a reasonable period afterwards. Account and billing records
                are kept for as long as your account is active and then as long
                as tax and accounting rules require. Call recordings and
                transcripts are kept for as long as the client business needs
                them for its own records, and are deleted on request. You can ask
                us to delete your information sooner at any time.
              </p>

              <h3 id="security">10. Security</h3>
              <p>
                We use encrypted connections, access controls, and reputable
                infrastructure providers to protect information. No system is
                perfectly secure, and we cannot guarantee absolute security, but
                if a breach affects your information we will tell you and the
                relevant authorities as the law requires.
              </p>

              <h3 id="your-rights">11. Your choices and rights</h3>
              <p>
                You can ask us to give you a copy of the personal information we
                hold about you, correct it if it is wrong, delete it, or stop
                using it for a particular purpose. You can also opt out of
                non-essential email at any time. Email us using section 14 and we
                will respond within a reasonable period, and within any deadline
                the law sets.
              </p>
              <p>
                Depending on where you live, you may have additional rights under
                laws such as the CCPA or GDPR. We honor those requests regardless
                of where you are.
              </p>

              <h3 id="children">12. Children&apos;s privacy</h3>
              <p>
                Our services are for businesses and are not directed at children
                under 13. We do not knowingly collect their information. If you
                believe a child has given us information, contact us and we will
                delete it.
              </p>

              <h3 id="changes">13. Changes to this policy</h3>
              <p>
                We will update this page when our practices change, and we will
                change the &quot;last updated&quot; date at the top. If a change
                is significant, we will make that clear rather than quietly
                editing the text.
              </p>

              <h3 id="contact">14. Contact us</h3>
              <p>
                Questions about this policy, or a request about your information?
                Email{" "}
                <a href="mailto:gavindj2022@gmail.com">gavindj2022@gmail.com</a>.
              </p>
              <p>
                This page explains our practices in plain language. It is not
                legal advice, and it is not a substitute for advice from your own
                attorney about your obligations.
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
