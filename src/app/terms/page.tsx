import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/ui/LegalPage";
import { isSet, site } from "@/content/site";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "The terms for using the Build Smart website, sending an enquiry and requesting a consultation or quotation.",
  alternates: { canonical: "/terms" },
};

/** Edit this line if the terms change. */
const LAST_UPDATED = "30 October 2026";

export default function TermsPage() {
  const tel = site.contact.phone.replace(/[^\d+]/g, "");
  return (
    <LegalPage title="Terms & Conditions" updated={LAST_UPDATED}>
      <p>
        These terms apply to your use of this website, which is operated by {site.legalName}, owned by {site.founder.fullName}{" "}
        (&ldquo;Build Smart&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;). By using the website or sending us an enquiry, you agree to them. If you don&rsquo;t agree, please don&rsquo;t use
        the website.
      </p>
      <p>
        These terms cover the <strong>website only</strong>. Any construction, interior or digital-solutions work we carry out for you is
        governed by a separate written proposal and agreement signed by both of us; if anything in that agreement differs from these terms,
        the agreement applies.
      </p>

      <h2>1. About the information on this website</h2>
      <ul>
        <li>
          The website gives general information about Build Smart and our services. It is not an offer, quotation or guarantee for any
          particular project.
        </li>
        <li>
          Photographs, videos and descriptions show our work and approach. Finishes, materials, colours, sizes and layouts in a real project
          depend on the site, the design you approve, the budget and material availability, and may differ from what is shown.
        </li>
        <li>
          Budget ranges on the enquiry form are only to help us understand your plans. Prices, scope, payment terms and timelines are fixed
          only in a written proposal and agreement.
        </li>
        <li>
          We try to keep everything accurate and up to date, but information can change and may occasionally contain errors. Please confirm
          anything important with us directly.
        </li>
      </ul>

      <h2>2. Enquiries, consultations and quotations</h2>
      <ul>
        <li>
          Sending an enquiry or booking a consultation does not create a contract and does not oblige you or us to go ahead with a project.
        </li>
        <li>
          By sending an enquiry, you confirm the details are accurate, that the phone number is yours (or that you are allowed to share it),
          and you agree that we may contact you by phone or WhatsApp about your enquiry. Normal call and data charges from your provider may
          apply.
        </li>
        <li>
          Any quotation we give is valid for the period stated on it and is based on the information available at the time; it may change
          if the scope, design, site conditions or material prices change.
        </li>
        <li>
          Advice given informally (for example in a video, a message or a first conversation) is general guidance. Decisions about your
          property should be based on a site assessment and, where needed, the advice of the qualified professionals and approvals your
          project requires.
        </li>
      </ul>

      <h2>3. Using the website</h2>
      <p>You agree not to:</p>
      <ul>
        <li>send false, misleading, abusive or spam enquiries, or enquiries in someone else&rsquo;s name without permission;</li>
        <li>try to disrupt, overload, hack or gain unauthorised access to the website or its systems;</li>
        <li>copy or collect content from the website in bulk by automated means;</li>
        <li>use the website for anything unlawful.</li>
      </ul>
      <p>We may block access or ignore enquiries that break these rules.</p>

      <h2>4. Our content and brand</h2>
      <p>
        The Build Smart name and logo, and the photographs, videos, designs and text on this website, belong to Build Smart or are used with
        the permission of their owners. You may view and share links to
        our pages for personal, non-commercial purposes. Please don&rsquo;t copy, edit, republish or use our content or designs commercially
        without our written permission.
      </p>

      <h2>5. Client stories and reviews</h2>
      <p>
        Client videos and comments shown on this website are shared with the clients&rsquo; permission and reflect their own experience.
        Every project is different, so they are not a promise of the same result, cost or timeline for your project.
      </p>

      <h2>6. Other websites and services</h2>
      <p>
        The website links to and plays content from services such as YouTube, Instagram, Google Drive, Facebook, LinkedIn and WhatsApp.
        Those services have their own terms and privacy policies, and we are not responsible for their content, availability or practices.
      </p>

      <h2>7. Availability and liability</h2>
      <ul>
        <li>
          We aim to keep the website available and working correctly, but we can&rsquo;t guarantee it will always be uninterrupted, secure or
          free from errors, and we may change or pause it at any time.
        </li>
        <li>
          To the extent permitted by law, we are not liable for any loss or damage arising from your use of, or reliance on, the website or
          its general information. Nothing in these terms limits any liability that cannot be limited under Indian law, or your rights as a
          consumer.
        </li>
        <li>Our responsibilities for an actual project are those set out in the written agreement for that project.</li>
      </ul>

      <h2>8. Privacy</h2>
      <p>
        How we collect, use and protect your personal data is explained in our <Link href="/privacy-policy">Privacy Policy</Link>, which
        forms part of these terms.
      </p>

      <h2>9. Changes to these terms</h2>
      <p>
        We may update these terms from time to time. The &ldquo;last updated&rdquo; date at the top shows the current version; changes apply
        from the date they are published here.
      </p>

      <h2>10. Governing law</h2>
      <p>
        These terms are governed by the laws of India. Any dispute about the website will first be discussed with us in good faith; if it
        can&rsquo;t be resolved, it will be subject to the jurisdiction of the competent courts in India.
      </p>

      <h2>11. Contact us</h2>
      <p>
        Questions about these terms? Call or WhatsApp us on <a href={`tel:${tel}`}>{site.contact.phone}</a>
        {isSet(site.contact.email) && (
          <>
            , email <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
          </>
        )}
        , or use our <Link href="/contact">contact page</Link>.
      </p>
    </LegalPage>
  );
}
