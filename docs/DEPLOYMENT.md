# Deployment guide

The site is a standard Next.js app. Pick **one** of the options below.

Before any deployment:

1. Replace the temporary images and fill in the content (see `CONTENT-CHECKLIST.md`).
2. Run `npm run build` locally — it must finish without errors.
3. Connect the Google Sheet for enquiries (`docs/GOOGLE-SHEETS-SETUP.md`). On serverless hosts (Vercel) this is **required** — the server can't keep files.

---

## Option A — Vercel (recommended, free tier is enough to start)

1. Push this folder to a private GitHub repository.
2. In Vercel: **Add New → Project →** import the repository. Framework preset: **Next.js** (auto-detected).
3. Add environment variables (Project → Settings → Environment Variables):

   | Variable | Value |
   | --- | --- |
   | `NEXT_PUBLIC_SITE_URL` | `https://www.your-domain.com` |
   | `NEXT_PUBLIC_WHATSAPP_NUMBER` | business number, digits only, e.g. `9198XXXXXXXX` |
   | `LEAD_WEBHOOK_URL` | your Google Apps Script web-app URL (see `GOOGLE-SHEETS-SETUP.md`) |
   | `LEAD_WEBHOOK_SECRET` | the same value as in your `.env.local` / the Apps Script |

4. Deploy, then add your domain under **Settings → Domains** and update the DNS records Vercel shows.
5. Redeploy after changing any `NEXT_PUBLIC_…` variable (they are baked in at build time).

> Why not the file storage on Vercel? Serverless file systems are temporary — enquiries would be lost.

---

## Option B — VPS / your own server (Ubuntu, Node 22, PM2, Nginx)

```bash
# on the server
git clone <your-repo> build-smart && cd build-smart
npm ci
cp .env.example .env.local   # edit: NEXT_PUBLIC_SITE_URL, NEXT_PUBLIC_WHATSAPP_NUMBER, LEAD_WEBHOOK_URL, LEAD_WEBHOOK_SECRET
npm run build
npm install -g pm2
pm2 start npm --name build-smart -- start
pm2 save && pm2 startup
```

Nginx reverse proxy (then add HTTPS with `sudo certbot --nginx`):

```nginx
server {
  server_name your-domain.com www.your-domain.com;
  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

Without a Google Sheet (empty `LEAD_WEBHOOK_URL`), enquiries are appended to `data/leads.jsonl` (readable only by the server user). Back this file up regularly. To view: `cat data/leads.jsonl`, or open it in any JSON-lines viewer.

To update the site later: `git pull && npm ci && npm run build && pm2 restart build-smart`.

---

## Storing leads in Google Sheets (free, works with any host)

Step-by-step guide: **`docs/GOOGLE-SHEETS-SETUP.md`**. The Apps Script is in `docs/google-sheets/BuildSmart-Enquiries.gs`. Once deployed, set `LEAD_WEBHOOK_URL` and `LEAD_WEBHOOK_SECRET` (the storage switches to the sheet automatically) and check with `npm run test-sheet`.

Make, Zapier or n8n work the same way: create a "Custom webhook" trigger, paste its URL into `LEAD_WEBHOOK_URL`, and check the `secret` field (also sent as the `X-Build-Smart-Secret` header). If the receiver replies with JSON `{"ok": false}`, the website treats the enquiry as not saved and asks the visitor to try again.

---

## After going live — checklist

- [ ] `https://your-domain.com/sitemap.xml` lists every page with the real domain.
- [ ] Submit the sitemap in Google Search Console.
- [ ] Share a page link in WhatsApp to confirm the preview image and title.
- [ ] Submit a test enquiry from a phone; confirm it is stored (sheet / file) and the success message shows.
- [ ] Tap the floating WhatsApp button; confirm it opens a chat with the business number.
- [ ] Play one YouTube video and open one Instagram Reel.
- [ ] Check Privacy Policy and Terms have been reviewed.
