/**
 * Sends an event to Google Tag Manager's dataLayer (does nothing until GTM is set up — see site.analytics).
 * Never pass names, phone numbers or messages here: events carry no personal details.
 *
 * Events the site sends:
 *   generate_lead       an enquiry was sent            { form_source, project_type }
 *   lead_form_start     a visitor started typing       { form_source }
 *   quote_popup_view    the timed quote pop-up opened
 *   quote_form_open     a "Get a Quote" button opened the form   { form_source }
 *   contact_click       a Call / WhatsApp / Email link was tapped { method, link_location }
 */
type Params = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function track(event: string, params: Params = {}): void {
  if (typeof window === "undefined") return;
  try {
    (window.dataLayer = window.dataLayer || []).push({ event, ...params });
  } catch {
    /* analytics must never break the page */
  }
}
