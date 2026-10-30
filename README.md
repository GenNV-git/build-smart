# Build Smart — Website

Premium marketing website for **Build Smart** (Construction | Interior | Digital Solutions), led by founder **Sanjay**.

Built with **Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Zod**. Fonts are self-hosted (Cormorant + Manrope via Fontsource), so the site makes no calls to Google Fonts.

| Page | Route |
| --- | --- |
| Home (long-form landing page, 11 sections) | `/` |
| About Sanjay (incl. curved zig-zag career timeline) | `/about` |
| Services | `/services` (anchors: `#home-construction`, `#interior-design`, …) |
| Projects portfolio | `/projects` |
| Project case studies | `/projects/project-01`, `/projects/project-02` |
| Videos, Reels & Shorts | `/videos` |
| Contact & consultation form | `/contact` |
| Privacy Policy / Terms | `/privacy-policy`, `/terms` |
| SEO | `/sitemap.xml`, `/robots.txt`, Open Graph image, favicon |

---

## 1. Run it locally

Requirements: **Node.js 20.9 or newer** (22 LTS recommended).

```bash
npm install
cp .env.example .env.local      # then edit values (all optional for local dev)
npm run dev                     # http://localhost:3000
```

Production build:

```bash
npm run build
npm start                       # http://localhost:3000
```

In development you'll see small yellow **✎ notes** and **"temp image"** tags. They show exactly which file to edit for anything still missing real content. They never appear in a production build (unless `NEXT_PUBLIC_SHOW_CONTENT_NOTES=true`).

---

## 2. Editing content (no design changes needed)

All business content lives in **`src/content/`**. Edit these files — not the components.

| What | File |
| --- | --- |
| Company name, tagline, contact details, WhatsApp, social links, project count, form options, popup setting | `src/content/site.ts` |
| Page images (hero, about collage, banners) | `src/content/images.ts` |
| Services (title, copy, inclusions, image) | `src/content/services.ts` |
| Projects & case studies (name, location, scope, gallery, before/after, walkthrough video) | `src/content/projects.ts` |
| Sanjay's bio, values, portrait, "Watch My Story" video, **career timeline** | `src/content/founder.ts` |
| Reels / Shorts / videos | `src/content/videos.ts` |
| Client testimonials | `src/content/testimonials.ts` |

Rules built into the site:

- **Empty values are hidden**, never faked. A missing location simply doesn't show; a social profile without a URL shows as "soon" and isn't clickable.
- **Videos without a URL show "Coming soon"** and are never presented as playable.
- **Testimonials:** only real quotes and only verified star ratings — leave `quote` empty and `rating` undefined otherwise.

### Videos

Paste the public URL into `url`:

- YouTube Shorts / videos → plays in an on-page lightbox (the YouTube player only loads when the visitor presses play, using the privacy-enhanced `youtube-nocookie.com` domain). Thumbnails are fetched from YouTube automatically if you don't supply one.
- Instagram Reels → opens the original Reel on Instagram. Instagram doesn't allow thumbnail hot-linking, so save a still into `public/images/videos/` and set `thumbnail.src`.

### Images

Every picture has its own named file in `public/images/` (hero, about, banners, services, projects, journey, videos, testimonials). **To change a photo, replace the file with your own using the same name**, then set `temporary: false` for it in `src/content/`. Full step-by-step instructions — including adding more photos, the founder portrait and the timeline photos — are in **`docs/HOW-TO-UPDATE.md`**.

The current pictures are **temporary stand-ins** derived from the approved design mockup. Replace them all before launch.

Page-level images (home hero, about collage, banners) are listed in `src/content/images.ts`.

### Logo

`public/images/brand/` contains the official logo (`logo-original.jpg`) and transparent versions extracted from it with proportions preserved: `logo-mark.png` (cream, for dark backgrounds), `logo-mark-dark.png` (espresso, for light backgrounds) and `logo-full.png` (with tagline). If a vector (SVG) logo becomes available, drop it in and update `src/components/ui/Logo.tsx`.

---

## 3. Consultation form & leads

The form appears in the home hero, on `/contact`, and in an accessible modal opened by every "Get a Quote" / "Get a Free Consultation" button. Optional auto-popup: set `leadPopup.enabled` in `site.ts` (shown once per browsing session, never on `/contact`).

**Flow:** browser validation → `POST /api/leads` → server validation (Zod, same rules) → spam checks (honeypot field, same-origin check, rate limit) → **store** → optional **WhatsApp notification** → success message.

Storage is automatic — the Google Sheet when `LEAD_WEBHOOK_URL` is set, otherwise a file — or forced with `LEAD_STORAGE`:

| Value | Where leads go | Use for |
| --- | --- | --- |
| `file` (when no webhook URL) | `data/leads.jsonl` on the server (one JSON object per line, file mode 600, git-ignored) | Local development, a VPS |
| `webhook` | `LEAD_WEBHOOK_URL` (Google Sheets via Apps Script, Make, Zapier, n8n, a CRM) | **Vercel / Netlify / any serverless host** |
| `mock` | Nowhere — the visitor sees success but nothing is saved | Demos / UI testing only |

A ready-to-use Google Sheets receiver: `docs/GOOGLE-SHEETS-SETUP.md` (script in `docs/google-sheets/`, check with `npm run test-sheet`).

Form data is never put in URLs, never logged to the browser console, and never stored in browser storage. Server logs only record lead IDs and errors, not customer details.

**Phase 2 — WhatsApp alerts to the owner** are prepared but switched off (`WHATSAPP_NOTIFY_PROVIDER=none`). See `docs/WHATSAPP-INTEGRATION.md`. The code has not been tested against a live WhatsApp account — enable and verify it before relying on it.

---

## 4. Project structure

```
src/
  app/                    routes (pages, API, sitemap, robots, icons)
    api/leads/route.ts    secure lead handler
  components/
    layout/               Header, Footer, WhatsApp button, CTA banner, social links
    home/                 homepage sections
    about/                zig-zag journey timeline, story button
    forms/                consultation form, modal provider, CTA button
    video/                video cards, lightbox, testimonial card, gallery, before/after
    ui/                   logo, headings, page hero, icons, dev notes, reveal-on-scroll
  content/                ← all editable business content
  lib/                    validation schema, YouTube helpers, lead storage & WhatsApp notifier
public/images/            brand logo + one named file per photo slot, og image
photo-originals/          full-size originals of photos that were shrunk automatically (not deployed)
scripts/                  optimize-photos (auto-shrinks heavy photos), image-versions (cache-busting fingerprints)
docs/                     deployment, WhatsApp phase 2, content checklist
```

Design tokens (colours, fonts, radii, shadows) are in `src/app/globals.css` under `@theme`.

---

## 5. Quality notes

- Mobile-first: tested at 320, 360, 390, 430 and 768 px (no sideways scrolling) and on desktop. Phones get a sticky Call / WhatsApp / Get a Quote bar, a bottom-sheet enquiry form, swipeable videos and testimonials, compact service cards and 16 px form fields (no iOS zoom).
- Semantic landmarks, one `h1` per page, skip link, visible focus rings, labelled form fields with linked error messages, native `<dialog>` modals (focus trap + Esc), keyboard-operable carousel, filters and before/after slider.
- `prefers-reduced-motion` respected (reveal animations, WhatsApp pulse and timeline drawing switch off).
- Content stays visible without JavaScript; animations only hide content when JS is running.
- Images: `next/image` via `src/components/ui/Image.tsx` (WebP, lazy below the fold, hero preloaded). Every local photo gets a content fingerprint (`?v=`), so replaced photos show immediately and can be cached for 31 days. Heavy photos are shrunk automatically before `dev`/`build` (`npm run photos`). Video players load only on demand.
- Security headers (`nosniff`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy`), `X-Powered-By` removed.
- Per-page titles, descriptions, canonical URLs, Open Graph/Twitter cards, JSON-LD (`HomeAndConstructionBusiness`), sitemap and robots.

See **`docs/HOW-TO-UPDATE.md`** for photos, video links and reading enquiries, **`docs/DEPLOYMENT.md`** to go live and **`docs/CONTENT-CHECKLIST.md`** for everything that still needs real business information.
#   b u i l d - s m a r t  
 #   b u i l d - s m a r t  
 