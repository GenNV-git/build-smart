# Content still needed before launch

Nothing on the site invents business facts. Everything below is either hidden, shown as "coming soon", or uses a temporary stand-in until you supply the real thing. Run `npm run dev` — yellow ✎ notes on each page point to the exact file.

## Contact & profiles — `src/content/site.ts` and environment
- [x] Phone & WhatsApp: +91 77088 56606
- [ ] Email, studio address, working hours, service area → `site.contact`
- [x] Instagram (@_build_smart_ and Sanjay's @buildwithsanjay), YouTube, Facebook, LinkedIn
- [ ] Registered business name, if different → `site.legalName`
- [ ] Confirm the completed-project count (`site.stats.completedProjects`, currently "2+")
- [ ] Confirm the budget ranges offered in the form (`site.form.budgets`)
- [ ] Live domain → `NEXT_PUBLIC_SITE_URL`

## Sanjay — `src/content/founder.ts`
- [x] Professional portrait
- [ ] Professional background paragraph → `founder.background`
- [ ] Review the intro, approach, values and vision wording with Sanjay
- [ ] "Watch My Story" YouTube URL (button appears automatically) → `founder.storyVideoUrl`
- [ ] **Career timeline**: replace "Career Milestone 01–03" with real stages — period/year, company or stage, role and a short story. Add years to milestones 04–05.
- [x] Timeline photos added (chapters 1–6). Add more any time as `milestone-0N-x.jpg` — see `docs/HOW-TO-UPDATE.md`

## Projects — `src/content/projects.ts`
For **Project 01** and **Project 02**:
- [ ] Approved project name, location, completion year
- [ ] One-line summary and overview paragraph(s)
- [ ] Scope of work (list) and design concept / objectives
- [x] Cover photos
- [ ] Room-by-room gallery photos (`gallery-1…3.jpg` are still stand-ins)
- [ ] Before/after pairs, if available
- [ ] Walkthrough or progress video (YouTube URL)
- [ ] Confirm which testimonial belongs to which project

## Videos — `src/content/videos.ts`
- [ ] Paste Reel / Short URLs for each card (team, handover, site visit, client interaction, progress, behind the scenes, milestones, insights) — retitle, add or remove cards freely
- [ ] Thumbnails for Instagram Reels → `public/images/videos/`

## Testimonials — `src/content/testimonials.ts`
- [ ] YouTube URLs of the client testimonial videos (unlisted is fine)
- [ ] Client name or approved label, with permission
- [ ] Exact quote (optional) and star rating only if verified

## Services — `src/content/services.ts`
- [ ] Confirm what "Digital Solutions" includes
- [ ] Review each service's "includes" list (Modular Kitchens & Wardrobes has been removed)
- [x] Real photographs for each service

## Temporary images to replace
Every image slot in `public/images/` (hero, about, banners, services, projects, journey, videos, testimonials) currently holds a stand-in upscaled from the approved design mockup. Replace each file with a real Build Smart photo **using the same file name** — see `docs/HOW-TO-UPDATE.md` for the full list and sizes. Also add Sanjay's portrait (`public/images/founder/sanjay.jpg`) and regenerate `public/images/og-image.jpg` (1200 × 630).

## Legal
- [ ] Have the Privacy Policy and Terms reviewed; add the registered business name and contact email.
