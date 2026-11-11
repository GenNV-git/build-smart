import type { Metadata, Viewport } from "next";
import "@fontsource-variable/cormorant";
import "@fontsource-variable/manrope";
import "./globals.css";
import { site, isSet } from "@/content/site";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { MobileActionBar } from "@/components/layout/MobileActionBar";
import { ConsultationProvider } from "@/components/forms/ConsultationProvider";
import { RevealObserver } from "@/components/ui/RevealObserver";
import { Splash } from "@/components/ui/Splash";
import { JsonLd } from "@/components/ui/JsonLd";
import { services } from "@/content/services";
import { homeTitle, withArea } from "@/lib/seo";
import { GoogleTagManager, GoogleTagManagerNoScript } from "@/components/analytics/GoogleTagManager";
import { TrackClicks } from "@/components/analytics/TrackClicks";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: homeTitle, template: `%s | ${site.name}` },
  description: withArea(site.seoDescription),
  applicationName: site.name,
  keywords: [...site.seoKeywords],
  authors: [{ name: site.founder.fullName }],
  creator: site.name,
  publisher: site.name,
  category: "Construction & Interior Design",
  openGraph: {
    type: "website",
    siteName: site.name,
    title: homeTitle,
    description: withArea(site.seoDescription),
    url: "/",
    images: [{ url: "/images/og-image.jpg", width: 1200, height: 630, alt: `${site.name} — ${site.descriptor}` }],
    locale: "en_IN",
  },
  twitter: { card: "summary_large_image", title: homeTitle, description: withArea(site.seoDescription), images: ["/images/og-image.jpg"] },
  // Let Google show large photo previews and full text snippets.
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  ...(isSet(site.analytics.googleSiteVerification) ? { verification: { google: site.analytics.googleSiteVerification } } : {}),
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#24170F",
  width: "device-width",
  initialScale: 1,
};

const sameAs = [site.social.instagram, site.social.youtube, site.social.facebook, site.social.linkedin].filter(isSet);
/** What Google knows about the business and the website (schema.org). Only real details from site.ts. */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "HomeAndConstructionBusiness",
      "@id": `${site.url}/#business`,
      name: site.name,
      ...(site.legalName !== site.name ? { legalName: site.legalName } : {}),
      url: site.url,
      logo: `${site.url}/images/brand/logo-full.png`,
      image: `${site.url}/images/og-image.jpg`,
      description: site.seoDescription,
      slogan: site.tagline,
      founder: {
        "@type": "Person",
        name: site.founder.fullName,
        jobTitle: "Founder",
        url: `${site.url}/about`,
        sameAs: [site.founderSocial.instagram, site.founderSocial.youtube].filter(isSet),
      },
      ...(isSet(site.contact.phone) ? { telephone: site.contact.phone.replace(/\s/g, "") } : {}),
      ...(isSet(site.contact.email) ? { email: site.contact.email } : {}),
      ...(isSet(site.contact.address) ? { address: site.contact.address } : {}),
      ...(isSet(site.contact.serviceArea) ? { areaServed: site.contact.serviceArea } : { areaServed: { "@type": "Country", name: "India" } }),
      ...(isSet(site.contact.phone)
        ? {
            contactPoint: {
              "@type": "ContactPoint",
              telephone: site.contact.phone.replace(/\s/g, ""),
              contactType: "customer service",
            },
          }
        : {}),
      knowsAbout: services.map((s) => s.title),
      makesOffer: services.map((s) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: s.title, description: s.summary } })),
      ...(sameAs.length ? { sameAs } : {}),
    },
    {
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      url: site.url,
      name: site.name,
      description: site.seoDescription,
      inLanguage: "en-IN",
      publisher: { "@id": `${site.url}/#business` },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" suppressHydrationWarning>
      <head>
        {/* Enables reveal animations only when JS runs — content is never hidden without it. */}
        {/* "splash-on" holds the first reveal animations until the opening screen lifts (see Splash). */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(d){d.classList.add('js','splash-on');setTimeout(function(){d.classList.remove('splash-on')},950)})(document.documentElement)",
          }}
        />
        <JsonLd data={jsonLd} />
      </head>
      <body>
        <GoogleTagManagerNoScript />
        <Splash />
        <ConsultationProvider>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <WhatsAppButton />
          <MobileActionBar />
        </ConsultationProvider>
        <RevealObserver />
        <TrackClicks />
        <GoogleTagManager />
      </body>
    </html>
  );
}
