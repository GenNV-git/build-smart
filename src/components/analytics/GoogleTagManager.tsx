import Script from "next/script";
import { site } from "@/content/site";

/**
 * Google Tag Manager — loads only when a container ID is set (site.analytics.gtmId / NEXT_PUBLIC_GTM_ID).
 * Everything else (Google Analytics, Google Ads, Meta Pixel …) is then added inside Tag Manager, without touching the code.
 * The site already sends useful events to it — see src/lib/track.ts.
 */
const id = site.analytics.gtmId;
const valid = /^GTM-[A-Z0-9]{4,12}$/.test(id);

export function GoogleTagManager() {
  if (!valid) return null;
  return (
    <Script id="gtm" strategy="afterInteractive">
      {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${id}');`}
    </Script>
  );
}

/** The no-JavaScript fallback Google asks for, placed right after <body>. */
export function GoogleTagManagerNoScript() {
  if (!valid) return null;
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${id}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
        title="Google Tag Manager"
      />
    </noscript>
  );
}
