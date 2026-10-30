import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/ui/LegalPage";
import { isSet, site } from "@/content/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Build Smart collects, uses and protects the information you share through this website.",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPage() {
  const contactLine = isSet(site.contact.email) ? (
    <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
  ) : (
    <Link href="/contact">our contact page</Link>
  );
  return (
    <LegalPage title="Privacy Policy" updated="October 2026">
      <p>
        {site.legalName} (&ldquo;Build Smart&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) respects your privacy. This policy explains what
        information we collect through this website, why we collect it and how we look after it.
      </p>
      <h2>Information we collect</h2>
      <p>When you request a consultation, we collect the details you choose to give us:</p>
      <ul>
        <li>your name and phone / WhatsApp number;</li>
        <li>your project type and city or project location;</li>
        <li>optionally, your estimated budget, preferred contact time and message.</li>
      </ul>
      <p>
        We do not use advertising trackers on this website. Our hosting provider may keep standard technical logs (such as IP address and
        browser type) for security and reliability.
      </p>
      <h2>How we use it</h2>
      <ul>
        <li>to contact you about your enquiry by phone or WhatsApp;</li>
        <li>to prepare for and follow up on your consultation;</li>
        <li>to keep a record of enquiries we have received.</li>
      </ul>
      <p>We do not sell your information, and we do not use it for unrelated marketing without your permission.</p>
      <h2>Who can see it</h2>
      <p>
        Your enquiry is available only to the Build Smart team and the service providers we use to run this website and receive enquiries
        (for example, website hosting, a lead-management sheet or a WhatsApp Business messaging provider). These providers process data
        only on our instructions.
      </p>
      <h2>How long we keep it</h2>
      <p>We keep enquiry details for as long as needed to respond and to manage any resulting project, and then delete them.</p>
      <h2>Your choices</h2>
      <p>
        You can ask us to show, correct or delete the information you have shared with us, or to stop contacting you, at any time. Reach us
        through {contactLine}.
      </p>
      <h2>Embedded videos</h2>
      <p>
        Videos on this site are hosted by YouTube and Instagram and play in their official players. A player is loaded only when you
        press play (YouTube uses its privacy-enhanced mode). Once loaded, those services may set their own cookies and collect data under
        their own privacy policies.
      </p>
      <h2>Changes</h2>
      <p>We may update this policy from time to time. The &ldquo;last updated&rdquo; date above shows the latest version.</p>
    </LegalPage>
  );
}
