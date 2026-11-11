/**
 * SITE-WIDE BUSINESS DETAILS
 * ---------------------------------------------------------------
 * Fill in the empty strings below with real details. Anything left
 * empty is hidden on the live site (or replaced with a sensible,
 * working fallback) — nothing fake is ever displayed.
 */

export const site = {
  name: "Build Smart",
  legalName: "Build Smart", // TODO: registered business name, if different
  descriptor: "Construction | Interior | Digital Solutions",
  tagline: "Design. Build. Live Better.",
  shortDescription:
    "Build Smart designs and builds homes and interiors with care — from the first sketch to the final handover.",
  seoDescription:
    "Build Smart builds homes and designs interiors — home construction, interior design and turnkey projects led by civil engineer Sanjay K. Book a free consultation.",
  /** Search phrases this business should be found for. Add your city/area names here once the service area is confirmed. */
  seoKeywords: [
    "Build Smart",
    "home construction",
    "house construction company",
    "interior design",
    "interior designers",
    "turnkey home projects",
    "residential construction",
    "home interiors",
    "construction and interiors",
  ],

  /**
   * Public address of the live site — used for Google (canonical links, sitemap) and sharing previews.
   * NEXT_PUBLIC_SITE_URL in the hosting settings overrides it; a forgotten or placeholder value falls back to the real domain.
   */
  url: (/^https?:\/\/(?!.*your-domain\.com)/.test(process.env.NEXT_PUBLIC_SITE_URL || "")
    ? (process.env.NEXT_PUBLIC_SITE_URL as string)
    : "https://www.buildsmart.org.in"
  ).replace(/\/$/, ""),

  founder: {
    name: "Sanjay", // used across the site ("About Sanjay")
    fullName: "Sanjay K", // owner — used on the Privacy Policy / Terms and in Google's business details
    title: "Founder, Build Smart",
  },

  /** Contact details — shown only when filled in. */
  contact: {
    phone: "+91 77088 56606", // used for "Call" buttons
    email: "sanjay@buildsmart.org.in", // shown in the footer, contact page and legal pages
    address: "", // studio / office address
    serviceArea: "", // e.g. "Chennai and surrounding areas" — only once confirmed
    hours: "", // e.g. "Mon – Sat, 9:30 am – 7:00 pm"
  },

  /**
   * Business WhatsApp number in international format, digits only (e.g. "9198XXXXXXXX").
   * Prefer setting NEXT_PUBLIC_WHATSAPP_NUMBER in the environment.
   * While empty, the floating WhatsApp button opens the consultation form instead.
   */
  whatsapp: {
    number: (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "917708856606").replace(/\D/g, ""),
    greeting: "Hi Build Smart, I'd like to discuss a project.",
  },

  /**
   * Build Smart's own profiles — footer, menu, contact page.
   * A profile left empty ("") is simply not shown anywhere on the site.
   */
  social: {
    instagram: "https://www.instagram.com/_build_smart_/",
    youtube: "https://www.youtube.com/@buildwithsanjay-11.11",
    facebook: "https://www.facebook.com/share/1Pr3LJAmoy/",
    linkedin: "https://www.linkedin.com/company/build-smart-interior-construction/",
  },

  /** Sanjay's personal creator profiles — About page, Videos page and the reels section. */
  founderSocial: {
    instagram: "https://www.instagram.com/buildwithsanjay/",
    instagramHandle: "@buildwithsanjay",
    youtube: "https://www.youtube.com/@buildwithsanjay-11.11",
  },

  /**
   * The offer shown beside "Free Consultation" buttons and on the quote pop-up.
   * Change `value` to change the amount everywhere; set enabled: false to hide it.
   * Only advertise a value the business genuinely stands behind.
   */
  offer: {
    enabled: true,
    value: "₹5,000",
    /** Short line used on badges. */
    label: "Free consultation worth ₹5,000",
    /** Longer line used under headings. */
    line: "Book a personal project consultation worth ₹5,000 — free, with no obligation.",
  },

  /**
   * Google Tag Manager. Paste your container ID (looks like "GTM-XXXXXXX") here, or set
   * NEXT_PUBLIC_GTM_ID in the hosting settings. While empty, no tracking code is loaded at all.
   */
  analytics: {
    gtmId: (process.env.NEXT_PUBLIC_GTM_ID || "").trim(),
    /** Google Search Console "HTML tag" verification code (only the content="…" value). Optional. */
    googleSiteVerification: (process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "").trim(),
  },

  /**
   * "Get a Free Quote" pop-up that appears in the centre of the screen after a few seconds.
   * Shown at most once per visit; never on the contact/legal pages; never while the visitor is
   * typing or has a menu/video open; and not again for someone who has already sent an enquiry.
   * To see it any time while testing, open the site with ?show-quote at the end,
   * e.g. http://localhost:3000/?show-quote or https://www.buildsmart.org.in/?show-quote
   */
  leadPopup: {
    enabled: true,
    delayMs: 15000, // 15 seconds after the visitor arrives (8000 = 8 s, 15000 = 15 s …)
    title: "Get a Free Quote",
    intro: "Tell us a little about your project — we'll call you back to plan it together.",
    /** Days to stay quiet after someone sends an enquiry. */
    quietDaysAfterEnquiry: 60,
  },

  /** Options used by the consultation form (and validated on the server). */
  form: {
    projectTypes: [
      "Home Construction",
      "Interior Design",
      "Turnkey Project",
      "Digital Solutions",
      "Other",
    ],
    budgets: [
      "Under ₹10 Lakh",
      "₹10 – 25 Lakh",
      "₹25 – 50 Lakh",
      "₹50 Lakh – ₹1 Crore",
      "Above ₹1 Crore",
      "Not sure yet",
    ],
    contactTimes: ["Morning (9 am – 12 pm)", "Afternoon (12 – 4 pm)", "Evening (4 – 8 pm)", "Any time"],
    /**
     * Save "started but not sent" enquiries: when a visitor has typed a name and a valid phone number
     * but leaves without pressing the button, those details go to the Google Sheet marked "Not submitted".
     * If they send the form later, the same row is completed instead of adding a second one.
     * Set to false to switch this off. (It is disclosed in the Privacy Policy.)
     */
    saveIncomplete: true,
  },

  copyrightYear: new Date().getFullYear(),

  /** Website credit in the footer ("Designed & developed by GenNV") — the name links to `url` (opens in a new tab). */
  credit: {
    name: "GenNV",
    url: "https://www.instagram.com/gennv.official/",
  },
} as const;

export const navigation = [
  { label: "Home", href: "/" },
  { label: "About Sanjay", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "Videos", href: "/videos" },
  { label: "Testimonials", href: "/#testimonials" },
  { label: "Contact", href: "/contact" },
] as const;

/** true when a content value has been filled in. */
export const isSet = (value?: string | null): value is string => !!value && value.trim().length > 0;

export function whatsappLink(message: string = site.whatsapp.greeting): string | null {
  if (!isSet(site.whatsapp.number)) return null;
  return `https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(message)}`;
}
