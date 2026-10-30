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
    "Build Smart — construction, interior design and turnkey residential projects led by founder Sanjay. Book a free consultation.",

  /** Public site URL — set NEXT_PUBLIC_SITE_URL in the environment for production. */
  url: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),

  founder: {
    name: "Sanjay",
    title: "Founder, Build Smart",
  },

  /** Contact details — shown only when filled in. */
  contact: {
    phone: "+91 77088 56606", // used for "Call" buttons
    email: "", // e.g. "hello@buildsmart.in"
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
   * Trust figures. Only real, verifiable numbers belong here.
   * `completedProjects` reflects the brief ("approximately two residential projects") — confirm before launch.
   */
  stats: {
    completedProjects: "2+",
  },

  /** Consultation popup. Disabled by default because the hero already shows the form. */
  /**
   * "Get a Free Quote" pop-up that appears in the centre of the screen after a few seconds.
   * Shown at most once per visit; never on the contact/legal pages; never while the visitor is
   * typing or has a menu/video open; and never again for someone who has already sent an enquiry.
   */
  leadPopup: {
    enabled: true,
    delayMs: 8000, // 8 seconds after the visitor arrives (8000 = 8 s, 15000 = 15 s …)
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
  },

  copyrightYear: new Date().getFullYear(),

  /** Website credit in the footer. Add GenNV's website address to `url` to make the name a link. */
  credit: {
    name: "GenNV",
    url: "",
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
