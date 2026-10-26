# How to update photos, videos and read enquiries

A plain-language guide. You don't need to know how to code — you only replace files and paste links into a few clearly marked places.

**Tools you need:** [VS Code](https://code.visualstudio.com/) (free editor) to open the project folder, and Node.js to preview the site.

To preview your changes on your computer:

```bash
npm install      # first time only
npm run dev      # then open http://localhost:3000
```

In this preview mode, photos that are still temporary show a small yellow **"temp image"** tag, and yellow **✎ notes** tell you which file to edit. Visitors never see these.

---

## Part 1 — Photos

### The easy way: replace the file, keep the name

Every picture on the site already has its own file with a clear name. Put your photo in the same folder **with exactly the same file name**, replacing the old one. That's it — no code changes needed.

| Folder (inside `public/images/`) | File | Where it appears | Best shape |
| --- | --- | --- | --- |
| `hero/` | `home-hero.jpg` | Big photo at the top of the home page | Landscape, 2400 px wide |
| `about/` | `collage-large.jpg` | Home "About Build Smart" — tall photo | Portrait |
| `about/` | `collage-small.jpg` | Home "About Build Smart" — small photo | Landscape |
| `banners/` | `cta.jpg` | "Ready to Transform Your Space?" banner | Landscape, wide |
| `banners/` | `services.jpg`, `videos.jpg`, `contact.jpg` | Top of the Services, Videos and Contact pages | Landscape |
| `services/` | `home-construction.jpg`, `interior-design.jpg`, `turnkey-projects.jpg`, `digital-solutions.jpg` | Service cards (home + Services page) | Landscape 4:3 |
| `projects/project-01/` | `cover.jpg`, `gallery-1.jpg`, `gallery-2.jpg`, `gallery-3.jpg` | Project 01 card and case-study page | Landscape |
| `projects/project-02/` | `cover.jpg`, `gallery-1.jpg`, `gallery-2.jpg`, `gallery-3.jpg` | Project 02 card and case-study page | Landscape |
| `journey/` | `milestone-01.jpg`, `milestone-01-a.jpg`, `milestone-02-a.jpg` … (see *Timeline photos* below) | Sanjay's timeline on the About page | Any shape — the frame adapts |
| `videos/` | `team.jpg`, `handover.jpg`, `site-visit.jpg`, … | Video card thumbnails | Portrait 3:4 (main video: landscape) |
| `testimonials/` | `testimonial-01.jpg`, `testimonial-02.jpg` | Client testimonial cards | Portrait 4:5 |

After replacing a photo, open the matching file in `src/content/` and change `temporary: true` to `temporary: false` for it. (This only removes the yellow preview tag.)

**Photo tips**
- Use **JPG** where you can. Big photos straight from a phone or designer (2–5 MB) are fine: **they are shrunk automatically** every time you run `npm run dev` or `npm run build` (to fit 2000 px, high quality — no visible difference). The untouched originals are kept in the `photo-originals` folder. You can also run it any time with `npm run photos`.
- File names: lowercase, no spaces (`living-room-2.jpg`, not `Living Room (2).JPG`).
- The site automatically creates smaller, faster versions for phones — you only upload one size.
- **Replacing a photo with the same name shows the new one straight away** — the site gives every photo a version code based on its contents, so no old copy is ever reused. Just refresh the page.
- `npm run dev` is a *preview* mode and is always slower (it prepares each page the first time you open it). To see the real speed of the live site, run `npm run build` then `npm start`.

### Changing the description of a photo (alt text)

Each photo has an `alt` text — a short description read aloud to blind visitors and used by Google. Example in `src/content/projects.ts`:

```ts
cover: { src: "/images/projects/project-01/cover.jpg", alt: "Living room with walnut panelling and cove lighting", temporary: false },
```

### Adding *more* photos

**More project photos** — `src/content/projects.ts`, inside `gallery: [ … ]`. Copy one line, paste it below, change the file name and room:

```ts
gallery: [
  { src: "/images/projects/project-01/gallery-1.jpg", alt: "Living room overview", room: "Living", temporary: false },
  { src: "/images/projects/project-01/gallery-2.jpg", alt: "Dining area", room: "Dining", temporary: false },
  { src: "/images/projects/project-01/gallery-4.jpg", alt: "Master bedroom wardrobe wall", room: "Bedroom", temporary: false }, // ← new
],
```

**Timeline photos (About Sanjay) — added automatically.** Just put the photos in `public/images/journey/`, named by chapter number. No code needed.

| Chapter | File names |
| --- | --- |
| 1 | `milestone-01.jpg` (main photo), `milestone-01-a.jpg`, `milestone-01-b.jpg`, … |
| 2 | `milestone-02.jpg`, `milestone-02-a.jpg`, `milestone-02-b.jpg`, … |
| 3 | `milestone-03.jpg`, `milestone-03-a.jpg`, … |

- Any number of photos per chapter: **1** shows one large frame with a gold outline, **2** an overlapping pair, **3** one tall frame with two stacked beside it, **4 or more** a staggered gallery (up to 6 on computers and 4 on phones; the rest appear behind a "+2 more" tile, and every photo opens in the full-screen viewer).
- Each frame takes the shape of its photo (portrait, square or landscape), and photos are **centred** in their frames, so very little is cropped.
- The order is: the photo without a letter first, then `-a`, `-b`, `-c` …
- A file that doesn't follow this pattern (for example `extra 04.jpg`) is ignored. Rename it to `milestone-04-a.jpg` to show it in chapter 4.

**Optional — describe a photo, pick its frame, or move the crop.** Open `src/content/founder.ts` and find `journeyPhotoDetails`. One line per photo:

```ts
export const journeyPhotoDetails: Record<string, JourneyPhotoDetails> = {
  "milestone-02-a.jpg": { alt: "Sanjay pouring concrete for a foundation on site", frame: "rounded" },
  "milestone-02-b.jpg": { alt: "Pouring concrete over steel reinforcement", frame: "circle" },
  "milestone-02-c.jpg": { alt: "Site team at the end of the day", frame: "square", position: "50% 20%" }, // ← new photo
};
```

| Setting | Choices |
| --- | --- |
| `frame` | `"rounded"` (rectangle with curved corners) · `"square"` (sharp corners) · `"circle"` · `"arch"` (rounded top — lovely for tall portrait photos) · `"auto"` (the site picks) |
| `position` | Which part stays visible when a photo is cropped. `"50% 50%"` = centre (default). `"50% 20%"` = keep the top in view (useful when faces get cut), `"30% 50%"` = keep the left side. |
| `hide` | `hide: true` keeps the file in the folder but doesn't show it. |

A photo without a line here still shows, with the chapter title as its description.

**Chapter text** (years, company, role, story) is in the `milestones` list just below, in the same file:

```ts
{
  id: "m2",
  period: "2018 – 2021",                        // ← the years
  title: "Site Engineer",                        // ← heading
  organisation: "Company name, City",            // ← company or stage
  role: "What Sanjay was responsible for",       // ← role
  story: "A few lines about this chapter and what he learnt…",
  // delete the line `placeholder: true,` once the real details are in
},
```

(The example values are only an illustration — use Sanjay's real details.) To add a chapter, copy a whole `{ … },` block, give it a new `id` (e.g. `"m7"`), and name its photos `milestone-07…`.

**Sanjay's portrait (About page)** — already set up: `public/images/founder/sanjay.png`, configured in `src/content/founder.ts`:

```ts
portrait: { src: "/images/founder/sanjay.png", alt: "Sanjay" } as ImageAsset,
```

To use a different photo, replace the file (same name) or change the path. Add `position: "50% 20%"` inside the `{ … }` if the face needs to sit higher in the frame.

**Cropping any other photo** — services, projects and page images accept the same `position` setting, e.g. in `src/content/projects.ts`:

```ts
cover: { src: "/images/projects/project-02/cover.jpg", alt: "Handing over the completed home", position: "50% 30%", temporary: false },
```

**Social-share image** — `public/images/og-image.jpg` (exactly 1200 × 630 px) is the picture shown when someone shares the site on WhatsApp/Facebook.

---

## Part 2 — Video links

### 1. Copy the link

- **YouTube Short / video:** open it → **Share** → **Copy link**. Looks like `https://youtube.com/shorts/AbCdEf12345` or `https://youtu.be/AbCdEf12345`.
- **Instagram Reel:** open it → **⋯** (three dots) → **Copy link**. Looks like `https://www.instagram.com/reel/C1a2B3c4D5e/`.

### 2. Paste it in the right place

| Video | File | Field |
| --- | --- | --- |
| Reels & Shorts gallery (home + Videos page + About page) | `src/content/videos.ts` | `url` |
| Client testimonial videos | `src/content/testimonials.ts` | `videoUrl` |
| Project walkthrough on a case-study page | `src/content/projects.ts` | `walkthroughVideoUrl` |
| "Watch My Story" button on About page | `src/content/founder.ts` | `storyVideoUrl` |

Example — `src/content/videos.ts`:

```ts
{
  id: "site-visit",
  title: "Site Visit",
  subtitle: "On site with Sanjay",
  category: "site-visit",
  platform: "youtube",                                   // "youtube" or "instagram" — must match the link
  url: "https://youtube.com/shorts/AbCdEf12345",         // ← paste here, inside the quotes
  thumbnail: { src: "/images/videos/site-visit.jpg", alt: "", temporary: false },
  orientation: "portrait",
},
```

What happens:
- **YouTube** links play right on the website in a pop-up player (the player loads only when tapped, so the site stays fast). If you remove the `thumbnail` line, YouTube's own thumbnail is used automatically.
- **Instagram** links open the Reel in the Instagram app/site. Instagram doesn't share thumbnails, so **take a screenshot of the Reel**, crop it, and save it as the card's thumbnail file in `public/images/videos/`.
- Cards with an empty `url` show **"Coming soon"** — they never pretend to play.

For **testimonials** use YouTube (you can upload them as *Unlisted* so they don't appear on your channel). Also fill in the client's name/label, and their exact quote only if you have it:

```ts
{
  id: "testimonial-01",
  clientLabel: "Mr. & Mrs. Kumar",        // or keep "Homeowner"
  projectSlug: "project-01",
  quote: "",                               // their exact words, or leave empty
  videoUrl: "https://youtu.be/XyZ987abc12",
  thumbnail: { src: "/images/testimonials/testimonial-01.jpg", alt: "", temporary: false },
  duration: "1:42",                        // optional
},
```

### 3. Add a new video card

Copy a whole `{ … },` block in `videos.ts`, paste it, and change the `id` (must be unique, e.g. `"handover-2"`), title, link and thumbnail file name. To choose which video is the big one on the home page, put `featured: true` on it (and remove it from the other).

Categories you can use: `site-visit`, `progress`, `client`, `handover`, `behind-the-scenes`, `milestone`, `insights` — these become the filter buttons on the Videos page.

### Social profile links and WhatsApp number

All in `src/content/site.ts` — already filled in:

```ts
contact: {
  phone: "+91 77088 56606",           // "Call" buttons, footer, contact page
  ...
},
whatsapp: {
  number: (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "917708856606")...,   // country code + number, digits only
},
social: {                           // Build Smart's own profiles — footer, menu, contact page
  instagram: "https://www.instagram.com/_build_smart_/",
  youtube: "https://www.youtube.com/@buildwithsanjay-11.11",
  facebook: "https://www.facebook.com/share/1Pr3LJAmoy/",
  linkedin: "https://www.linkedin.com/company/build-smart-interior-construction/",
},
founderSocial: {                    // Sanjay's own profiles — About page, Videos page, reels section
  instagram: "https://www.instagram.com/buildwithsanjay/",
  instagramHandle: "@buildwithsanjay",
  youtube: "https://www.youtube.com/@buildwithsanjay-11.11",
},
```

A profile left empty (`""`) is simply not shown.

To change the WhatsApp number, edit `917708856606` above (91 = India, then the 10-digit number). Every WhatsApp button, the green floating button and the phone bottom bar use it.

---

## The "Get a Free Quote" pop-up

A few seconds after someone arrives, a "Get a Free Quote" form appears in the middle of the screen (on phones and computers). Settings are in `src/content/site.ts`:

```ts
leadPopup: {
  enabled: true,              // false = never show it
  delayMs: 8000,              // when it appears: 8000 = 8 seconds, 15000 = 15 seconds …
  title: "Get a Free Quote",
  intro: "Tell us a little about your project — we'll call you back to plan it together.",
  quietDaysAfterEnquiry: 60,  // after someone sends an enquiry, don't ask them again for 60 days
},
```

It is polite by design: it shows **at most once per visit**, never on the Contact, Privacy or Terms pages, waits while the visitor is typing or has the menu or a video open, and doesn't appear at all if they've already opened a form themselves or sent an enquiry. Enquiries from the pop-up are marked `auto-popup` in your enquiry list, so you can see how many it brings in. The photo beside it is set in `src/content/images.ts` (`quotePopup`).

---

## Part 3 — Getting the form submissions (enquiries)

Every enquiry contains: name, phone/WhatsApp, project type, city, and (if filled) budget, preferred contact time and message, plus the date and which form it came from.

### On your computer (testing)

Every enquiry is saved in **`data/leads.jsonl`** inside the project folder. To read them easily, run:

```bash
npm run leads
```

It lists the latest enquiries in the terminal and creates **`data/enquiries.csv`** — double-click it to open in Excel (newest first, India time, with a "Came from" column showing which form was used: home page, contact page, quote pop-up …).

The `data` folder stays on your computer only — it's never uploaded or published.

### On the live website — receive them in a Google Sheet (recommended, free)

This works on every host, including Vercel, and lets you read enquiries on your phone.

1. Create a new **Google Sheet**, name it e.g. *Build Smart Enquiries*.
2. Menu **Extensions → Apps Script**. Delete what's there and paste the script from `docs/DEPLOYMENT.md` (section *Storing leads in Google Sheets*). On the first line, replace `PASTE_THE_SAME_VALUE_AS_LEAD_WEBHOOK_SECRET` with a long random password you make up, e.g. `bs-7Kq2-xP9w-31Lm`.
3. Click **Deploy → New deployment → Select type: Web app**. *Execute as:* **Me**. *Who has access:* **Anyone**. Click **Deploy**, allow the permissions, and **copy the Web app URL**.
4. In your hosting settings (Vercel → Project → Settings → Environment Variables) add:

   | Name | Value |
   | --- | --- |
   | `LEAD_STORAGE` | `webhook` |
   | `LEAD_WEBHOOK_URL` | the Web app URL you copied |
   | `LEAD_WEBHOOK_SECRET` | the same password as in the script |

5. Redeploy the site, submit a test enquiry from your phone, and check that a new row appears in the **Leads** tab.
6. **Get an email for every new enquiry:** in the Google Sheet, **Tools → Notification settings** → choose *"Any changes are made"* and *"Email – right away"*.

Install the **Google Sheets app** on your phone to see enquiries anywhere.

### If you host on your own server (VPS)

Keep `LEAD_STORAGE=file`; enquiries are written to `data/leads.jsonl` on the server. Back it up regularly. (The Google Sheet option also works on a VPS.)

### WhatsApp alerts for each enquiry (Phase 2)

Sending each enquiry straight to Sanjay's WhatsApp is prepared in the code but switched off until it's set up with an approved WhatsApp Business account. Step-by-step instructions are in `docs/WHATSAPP-INTEGRATION.md`. Until then, use the Google Sheet + email notification above.

---

## After any change — publish it

- **Vercel:** save your files, then push to GitHub (`git add . && git commit -m "Update photos" && git push`). Vercel rebuilds the site automatically in about a minute.
- **Own server:** `git pull && npm ci && npm run build && pm2 restart build-smart`.

If something breaks after an edit, it's usually a missing quote `"` or comma `,` in the content file — the preview (`npm run dev`) shows the exact line.
