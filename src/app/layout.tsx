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

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | Construction, Interiors & Turnkey Homes`,
    template: `%s | ${site.name}`,
  },
  description: site.seoDescription,
  applicationName: site.name,
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} | Construction, Interiors & Turnkey Homes`,
    description: site.seoDescription,
    images: [{ url: "/images/og-image.jpg", width: 1200, height: 630, alt: "Build Smart — Construction | Interior | Digital Solutions" }],
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} | Construction, Interiors & Turnkey Homes`,
    description: site.seoDescription,
    images: ["/images/og-image.jpg"],
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#24170F",
  width: "device-width",
  initialScale: 1,
};

const sameAs = [site.social.instagram, site.social.youtube, site.social.facebook, site.social.linkedin].filter(isSet);
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HomeAndConstructionBusiness",
  name: site.name,
  url: site.url,
  logo: `${site.url}/images/brand/logo-full.png`,
  image: `${site.url}/images/og-image.jpg`,
  description: site.seoDescription,
  founder: {
    "@type": "Person",
    name: site.founder.fullName,
    sameAs: [site.founderSocial.instagram, site.founderSocial.youtube].filter(isSet),
  },
  ...(isSet(site.contact.phone) ? { telephone: site.contact.phone } : {}),
  ...(isSet(site.contact.email) ? { email: site.contact.email } : {}),
  ...(isSet(site.contact.address) ? { address: site.contact.address } : {}),
  ...(sameAs.length ? { sameAs } : {}),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" suppressHydrationWarning>
      <head>
        {/* Enables reveal animations only when JS runs — content is never hidden without it. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>
        <ConsultationProvider>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <WhatsAppButton />
          <MobileActionBar />
        </ConsultationProvider>
        <RevealObserver />
      </body>
    </html>
  );
}
