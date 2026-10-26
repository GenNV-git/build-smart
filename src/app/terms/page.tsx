import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/ui/LegalPage";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms for using the Build Smart website.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms & Conditions" updated="October 2026">
      <p>
        These terms apply to your use of this website, operated by {site.legalName}. By using the site you agree to them. Terms for any
        construction or interior project are set out separately in the written agreement for that project.
      </p>
      <h2>Website content</h2>
      <p>
        The content on this website is for general information about our services. Images, descriptions and videos illustrate our work and
        approach; they are not an offer, quotation or guarantee for a specific project. Scope, cost and timelines are confirmed only in a
        written proposal.
      </p>
      <h2>Consultation requests</h2>
      <p>
        Submitting the consultation form does not create a contract. We will contact you to discuss your requirements. Please make sure the
        details you submit are accurate and that you are entitled to share them.
      </p>
      <h2>Intellectual property</h2>
      <p>
        The Build Smart name, logo, photographs, videos and text on this site belong to Build Smart or are used with permission. Please do
        not reuse them without written consent.
      </p>
      <h2>Third-party links</h2>
      <p>The site links to and embeds content from services such as YouTube, Instagram and WhatsApp. We are not responsible for their content or policies.</p>
      <h2>Liability</h2>
      <p>
        We take care to keep this website accurate and available, but we cannot guarantee it will always be error-free or uninterrupted. To
        the extent permitted by law, we are not liable for losses arising from use of the website.
      </p>
      <h2>Privacy</h2>
      <p>
        How we handle your information is described in our <Link href="/privacy-policy">Privacy Policy</Link>.
      </p>
      <h2>Governing law</h2>
      <p>These terms are governed by the laws of India.</p>
    </LegalPage>
  );
}
