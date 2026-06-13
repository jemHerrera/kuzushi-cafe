import type { Metadata } from "next";

import { LegalPage } from "@/components/kuzushi-ui";

export const metadata: Metadata = {
  title: "Terms of Service | Kuzushi Cafe",
  description: "Terms that govern access to and use of Kuzushi Cafe.",
};

export default function TermsOfServicePage() {
  return (
    <LegalPage
      title="Terms of Service"
      description="These terms govern your access to and use of Kuzushi Cafe. By creating an account or using the service, you agree to them."
      effectiveDate="June 13, 2026"
    >
      <section>
        <h2>1. Eligibility and accounts</h2>
        <p>
          You must be at least 13 years old and legally able to agree to these
          terms. If local law requires a higher age for online services, that
          higher age applies. You are responsible for the activity on your
          account and for maintaining control of your email account and sign-in
          credentials.
        </p>
        <p>
          Provide accurate information, keep it reasonably current, and notify
          us at <a href="mailto:hello@kuzushi.cafe">hello@kuzushi.cafe</a> if
          you believe your account has been compromised.
        </p>
      </section>

      <section>
        <h2>2. The service</h2>
        <p>
          Kuzushi Cafe provides tools for grappling journaling, progress
          summaries, profile sharing, training-partner relationships,
          notifications, saved techniques, and optional donations. Features may
          change, be limited, or be discontinued.
        </p>
      </section>

      <section>
        <h2>3. Health and training disclaimer</h2>
        <p>
          Kuzushi Cafe is an organizational and reflection tool, not medical,
          coaching, safety, or professional advice. Grappling and martial arts
          involve risk of serious injury. Consult qualified coaches and health
          professionals, train within your abilities, and stop activity when
          appropriate. You are responsible for your training decisions.
        </p>
      </section>

      <section>
        <h2>4. Your content</h2>
        <p>
          You retain ownership of content you submit. You grant Kuzushi Cafe a
          non-exclusive, worldwide, royalty-free license to host, store,
          reproduce, process, display, and transmit that content only as needed
          to operate, secure, improve, and provide the service according to your
          settings.
        </p>
        <p>
          You are responsible for your content and must have the right to submit
          it. Do not include sensitive information about another person without
          an appropriate basis or permission. Your privacy settings control
          supported in-app visibility, but they cannot prevent people who can
          view content from copying it.
        </p>
      </section>

      <section>
        <h2>5. Acceptable use</h2>
        <p>You may not:</p>
        <ul>
          <li>
            Use the service unlawfully or violate another person&apos;s rights.
          </li>
          <li>
            Harass, threaten, impersonate, exploit, or expose private
            information about another person.
          </li>
          <li>
            Upload malicious code, probe security, bypass access controls, or
            interfere with the service.
          </li>
          <li>
            Scrape, automate access to, or overload the service without written
            permission.
          </li>
          <li>
            Misrepresent donation transactions or use the service for fraud.
          </li>
        </ul>
      </section>

      <section>
        <h2>6. Donations and third-party services</h2>
        <p>
          Donations are voluntary, one-time payments processed by Stripe. Unless
          required by law, completed donations are non-refundable. A donation
          does not purchase ownership, guaranteed features, service levels, or
          special treatment.
        </p>
        <p>
          The service relies on third parties such as Supabase, Google, Stripe,
          and Vercel. Their services and terms may apply separately. Kuzushi
          Cafe is not responsible for third-party products or services outside
          our control.
        </p>
      </section>

      <section>
        <h2>7. Suspension and termination</h2>
        <p>
          You may stop using the service at any time. We may suspend or
          terminate access, remove content, or limit features if reasonably
          necessary to protect the service or others, respond to legal
          requirements, address risk, or enforce these terms. Where practical,
          we will provide notice.
        </p>
      </section>

      <section>
        <h2>8. Intellectual property</h2>
        <p>
          Kuzushi Cafe, including its software, design, branding, and service
          content other than user content, is owned by or licensed to the
          service operator and is protected by applicable law. These terms do
          not grant you rights to use Kuzushi Cafe branding or proprietary
          materials outside normal use of the service.
        </p>
      </section>

      <section>
        <h2>9. Disclaimers</h2>
        <p>
          To the maximum extent permitted by law, the service is provided
          &quot;as is&quot; and &quot;as available.&quot; We disclaim implied
          warranties, including merchantability, fitness for a particular
          purpose, non-infringement, and uninterrupted or error-free operation.
          We do not guarantee that content will never be lost, so keep copies of
          information you cannot afford to lose.
        </p>
      </section>

      <section>
        <h2>10. Limitation of liability</h2>
        <p>
          To the maximum extent permitted by law, Kuzushi Cafe and its operator
          will not be liable for indirect, incidental, special, consequential,
          exemplary, or punitive damages, or for loss of data, profits,
          goodwill, or use arising from the service. Our total liability for
          claims relating to the service will not exceed the greater of USD $100
          or the amount you paid directly to Kuzushi Cafe in the 12 months
          before the claim. Some jurisdictions do not allow certain limitations,
          so parts of this section may not apply to you.
        </p>
      </section>

      <section>
        <h2>11. Changes and general terms</h2>
        <p>
          We may update these terms as the service changes. Material changes
          will be posted with a new effective date. Continued use after changes
          take effect means you accept the revised terms.
        </p>
        <p>
          If a provision is unenforceable, the remaining provisions remain in
          effect. Failure to enforce a provision is not a waiver. You may not
          transfer these terms without our consent; we may transfer them as part
          of operating or transferring the service.
        </p>
      </section>

      <section>
        <h2>12. Contact</h2>
        <p>
          Questions about these terms can be sent to{" "}
          <a href="mailto:hello@kuzushi.cafe">hello@kuzushi.cafe</a>.
        </p>
      </section>
    </LegalPage>
  );
}
