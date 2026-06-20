import type { Metadata } from "next";

import { LegalPage } from "@/components/kuzushi-ui";

export const metadata: Metadata = {
  title: "Privacy Policy | Kuzushi Cafe",
  description:
    "How Kuzushi Cafe collects, uses, shares, and protects personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      description="This policy explains what information Kuzushi Cafe handles when you use the grappling journal, social features, and donation tools."
      effectiveDate="June 13, 2026"
    >
      <section>
        <h2>1. Information we collect</h2>
        <p>
          We collect information you provide or generate while using Kuzushi
          Cafe, including:
        </p>
        <ul>
          <li>
            Account information, such as your email address, authentication
            provider, first and last name, and profile photo.
          </li>
          <li>
            Optional profile information, such as your belt, weight class,
            birthday, and bio.
          </li>
          <li>
            Journal and training information, including techniques, setups,
            notes, training dates, intensity, gi or no-gi selection, outcomes,
            and training-partner details.
          </li>
          <li>
            Social information, such as training-partner requests,
            relationships, blocks, notifications, and the profile or journal
            information you choose to share.
          </li>
          <li>
            Donation records, such as the amount, currency, checkout session,
            and payment status. Kuzushi Cafe does not directly store full
            payment-card details.
          </li>
          <li>
            Technical information required to operate and secure the service,
            such as authentication cookies, request data, and basic server logs.
          </li>
        </ul>
      </section>

      <section>
        <h2>2. How we use information</h2>
        <p>We use information to:</p>
        <ul>
          <li>Provide, maintain, secure, and improve Kuzushi Cafe.</li>
          <li>Authenticate you and keep you signed in.</li>
          <li>
            Save your journal, calculate training summaries, and personalize
            your experience.
          </li>
          <li>
            Enable profile search, training-partner relationships, sharing, and
            notifications according to your privacy settings.
          </li>
          <li>Process donations and confirm their status.</li>
          <li>
            Diagnose errors, prevent abuse, enforce our terms, and comply with
            legal obligations.
          </li>
        </ul>
      </section>

      <section>
        <h2>3. Visibility and your choices</h2>
        <p>
          Your profile is public by default. Entries and category statistics
          are limited to accepted training partners by default. You can change
          supported visibility settings to public, training-partners only, or
          private from the app&apos;s Privacy settings.
        </p>
        <p>
          Information you make public can be viewed by other people and may be
          copied or shared outside Kuzushi Cafe. Removing a training partner may
          preserve limited snapshot details in existing journal records so those
          records remain understandable.
        </p>
      </section>

      <section>
        <h2>4. Service providers and disclosure</h2>
        <p>
          We use service providers to run Kuzushi Cafe. These currently include
          Supabase for authentication and database services, Google when you
          choose Google sign-in, Stripe for donation checkout, and Vercel for
          application hosting. Those providers process information under their
          own terms and privacy policies.
        </p>
        <p>
          We may also disclose information when reasonably necessary to comply
          with law, protect users or the service, investigate fraud or abuse, or
          complete a merger, financing, acquisition, or transfer of the service.
          We do not sell personal information.
        </p>
      </section>

      <section>
        <h2>5. Cookies</h2>
        <p>
          Kuzushi Cafe uses cookies and similar browser storage that are
          necessary for authentication, security, and core application
          functionality. We do not currently use third-party advertising
          cookies.
        </p>
      </section>

      <section>
        <h2>6. Retention and security</h2>
        <p>
          We retain information while your account is active and as reasonably
          necessary to provide the service, maintain transaction and security
          records, resolve disputes, and meet legal obligations. No system is
          completely secure, but we use reasonable technical and organizational
          measures intended to protect your information.
        </p>
      </section>

      <section>
        <h2>7. Your rights</h2>
        <p>
          Depending on where you live, you may have rights to access, correct,
          delete, or receive a copy of your personal information, or to object
          to or restrict certain processing. You may update profile and privacy
          settings in the app. For other requests, email{" "}
          <a href="mailto:hello@kuzushi.cafe">hello@kuzushi.cafe</a>. We may
          need to verify your identity before completing a request.
        </p>
      </section>

      <section>
        <h2>8. Children</h2>
        <p>
          Kuzushi Cafe is not directed to children under 13, and we do not
          knowingly collect personal information from children under 13. If you
          believe a child has provided personal information, contact us so we
          can investigate and take appropriate action.
        </p>
      </section>

      <section>
        <h2>9. International use and policy changes</h2>
        <p>
          Your information may be processed in countries other than the one
          where you live. Those countries may have different data-protection
          laws. We may update this policy as the service or legal requirements
          change. We will post the revised policy here and update its effective
          date.
        </p>
      </section>

      <section>
        <h2>10. Contact</h2>
        <p>
          Questions or privacy requests can be sent to{" "}
          <a href="mailto:hello@kuzushi.cafe">hello@kuzushi.cafe</a>.
        </p>
      </section>
    </LegalPage>
  );
}
