import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/ui/LegalPage";
import { isSet, site, whatsappLink } from "@/content/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Build Smart collects, uses, stores and protects the information you share through this website, and how to exercise your rights.",
  alternates: { canonical: "/privacy-policy" },
};

/** Edit these two lines if the policy changes. */
const LAST_UPDATED = "30 October 2026";
/** How long enquiries that don't become a project are kept after the last contact. */
const ENQUIRY_RETENTION = "two years";

const telHref = (n: string) => `tel:${n.replace(/[^\d+]/g, "")}`;

function ContactDetails() {
  const wa = whatsappLink("Hi Build Smart, I have a question about my personal data.");
  return (
    <ul>
      {isSet(site.contact.email) && (
        <li>
          Email: <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
        </li>
      )}
      <li>
        Phone: <a href={telHref(site.contact.phone)}>{site.contact.phone}</a>
        {wa && (
          <>
            {" "}(call or{" "}
            <a href={wa} target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>
            )
          </>
        )}
      </li>
      {isSet(site.contact.address) && <li>Post: {site.contact.address}</li>}
      <li>
        Or use the form on our <Link href="/contact">contact page</Link> and mention &ldquo;Privacy request&rdquo;.
      </li>
    </ul>
  );
}

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated={LAST_UPDATED}>
      <p>
        {site.legalName} (&ldquo;Build Smart&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) designs and builds homes and interiors. This policy
        explains, in plain language, what personal data we collect through this website, why we collect it, who can see it, how long we
        keep it and how you can control it. We follow India&rsquo;s Digital Personal Data Protection Act, 2023 and the rules made under it.
      </p>

      <h2>In short</h2>
      <ul>
        <li>We only collect what you type into our enquiry form, and we use it only to reply to your enquiry and plan your project.</li>
        <li>We don&rsquo;t sell your data, and we don&rsquo;t use advertising or tracking cookies.</li>
        <li>You can ask us to show, correct or delete your data, or to stop contacting you, at any time.</li>
      </ul>

      <h2>1. What we collect</h2>
      <p>When you send an enquiry (on the home page, the contact page, the &ldquo;Get a Free Quote&rdquo; pop-up or any &ldquo;Get a Quote&rdquo; button), we collect:</p>
      <ul>
        <li>your name;</li>
        <li>your phone / WhatsApp number;</li>
        <li>your project type and city or project location;</li>
        <li>if you choose to give them: your estimated budget, preferred contact time and message;</li>
        <li>
          the date and time of the enquiry, which form you used, and a record that you agreed to be contacted.
        </li>
      </ul>
      <p>
        Please don&rsquo;t include sensitive information (such as financial account details or health information) in your message &mdash; we
        don&rsquo;t need it to prepare a consultation.
      </p>
      <p>
        <strong>Technical data.</strong> Like any website, our hosting provider automatically processes basic technical information
        (such as your IP address, browser type and the pages requested) to deliver the site, keep it secure and block spam. We use your IP
        address briefly to limit repeated form submissions; we do not combine it with your enquiry or use it to identify you.
      </p>

      <h2>2. Why we use it</h2>
      <p>We use your enquiry details only to:</p>
      <ul>
        <li>contact you by phone or WhatsApp about your enquiry, at your preferred time where possible;</li>
        <li>understand your requirements and prepare for a consultation, site visit or quotation;</li>
        <li>keep a record of enquiries and follow up on them;</li>
        <li>if you go ahead with a project, manage that project (the project itself is covered by its written agreement).</li>
      </ul>
      <p>
        We rely on the <strong>consent</strong> you give when you tick the box on the form. We will not send you unrelated marketing
        messages unless you separately agree to receive them.
      </p>

      <h2>3. Where it is stored and who can see it</h2>
      <p>
        Your enquiry is sent securely (HTTPS) from the website to our private enquiry register in <strong>Google Sheets</strong>, and we may
        receive an email alert about it in <strong>Gmail</strong>. Only the Build Smart team members who handle enquiries can open it.
      </p>
      <p>We use a small number of service providers who process data on our behalf and only on our instructions:</p>
      <ul>
        <li>our website hosting provider &mdash; to run this website and deliver your enquiry;</li>
        <li>Google (Google Sheets and Gmail) &mdash; to store enquiries and notify our team;</li>
        <li>WhatsApp (Meta) &mdash; only if you choose to chat with us on WhatsApp.</li>
      </ul>
      <p>
        These providers may store data on servers outside India. Where they do, it is protected by their security measures and
        contractual commitments, and such transfers are made only as permitted under Indian law.
      </p>
      <p>
        We do <strong>not</strong> sell, rent or trade your personal data. We disclose it to others only if required by law or to protect
        our legal rights.
      </p>

      <h2>4. How long we keep it</h2>
      <ul>
        <li>
          <strong>Enquiries that don&rsquo;t become a project:</strong> deleted within {ENQUIRY_RETENTION} of our last contact with you,
          or sooner if you ask us to delete them.
        </li>
        <li>
          <strong>Enquiries that become a project:</strong> kept for the duration of the project and afterwards for as long as needed for
          warranty, accounting and legal requirements.
        </li>
        <li>
          Where the law requires us to keep certain records or logs for a minimum period, we keep them for that period and then delete
          them.
        </li>
      </ul>

      <h2>5. How we protect it</h2>
      <ul>
        <li>The website is served over HTTPS, so the form is encrypted in transit.</li>
        <li>Form details are checked on our server, never placed in web addresses and never written to the browser console.</li>
        <li>Our enquiry register is private and protected by account sign-in; access is limited to the people who need it.</li>
        <li>Spam protection blocks automated submissions.</li>
      </ul>
      <p>
        No system is completely secure. If a personal-data breach ever affects you, we will inform you and the Data Protection Board of
        India as the law requires.
      </p>

      <h2>6. Your rights</h2>
      <p>You can, at any time:</p>
      <ul>
        <li><strong>Access</strong> &mdash; ask what personal data we hold about you and who we have shared it with;</li>
        <li><strong>Correct or update</strong> &mdash; ask us to fix inaccurate, incomplete or out-of-date details;</li>
        <li>
          <strong>Erase</strong> &mdash; ask us to delete your data (unless we must keep it for an ongoing project or by law);
        </li>
        <li>
          <strong>Withdraw consent</strong> &mdash; tell us to stop contacting you. This is as easy as giving consent: just send us a
          message. It doesn&rsquo;t affect anything we did before you withdrew it;
        </li>
        <li><strong>Nominate</strong> &mdash; name a person who may exercise these rights for you in case of death or incapacity;</li>
        <li><strong>Raise a grievance</strong> &mdash; complain to us about how we handle your data.</li>
      </ul>
      <p>
        <strong>How to ask:</strong> email or call us using the details below, and tell us the phone number you used in your enquiry so we
        can find your record and confirm it&rsquo;s you. We will acknowledge your request and resolve it as quickly as
        possible, and in any case within the time allowed by law (currently up to 90 days).
      </p>
      <p>
        If you are not satisfied with our response, you may complain to the <strong>Data Protection Board of India</strong>, after first
        contacting us.
      </p>

      <h2>7. Contact for privacy questions and grievances</h2>
      <p>
        <strong>{site.founder.fullName}</strong>, {site.founder.title}
      </p>
      <ContactDetails />

      <h2>8. Cookies and browser storage</h2>
      <p>
        This website does <strong>not</strong> use advertising, analytics or tracking cookies. It saves two small, anonymous notes in your
        own browser so it doesn&rsquo;t pester you:
      </p>
      <ul>
        <li>
          that the &ldquo;Get a Free Quote&rdquo; pop-up has already been shown during this visit (cleared when you close the tab);
        </li>
        <li>
          the date you last sent an enquiry, so the pop-up stays hidden for a while afterwards.
        </li>
      </ul>
      <p>
        These notes contain no personal details, never leave your device and are not used to identify you. You can clear them at any time
        in your browser settings.
      </p>

      <h2>9. Videos and links to other services</h2>
      <p>
        Our videos are hosted by YouTube, Instagram or Google Drive and play in their official players. A player loads only when you
        press play (YouTube in its privacy-enhanced mode). Once loaded, that service may set its own cookies and collect data under its
        own privacy policy. The same applies when you follow our links to Instagram, YouTube, Facebook, LinkedIn or WhatsApp. We are not
        responsible for those services&rsquo; practices.
      </p>

      <h2>10. Children</h2>
      <p>
        Our services are meant for adults. We do not knowingly collect personal data from anyone under 18. If you believe a child has sent
        us their details, please contact us and we will delete them.
      </p>

      <h2>11. Changes to this policy</h2>
      <p>
        We may update this policy when our practices or the law change. The &ldquo;last updated&rdquo; date at the top shows the current
        version. If a change significantly affects how we use data you have already given us, we will ask for your consent again where
        required.
      </p>
      <p>
        See also our <Link href="/terms">Terms &amp; Conditions</Link>.
      </p>
    </LegalPage>
  );
}
