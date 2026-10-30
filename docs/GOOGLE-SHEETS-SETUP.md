# Receive website enquiries in Google Sheets

Every time someone fills in a form on the website (home page, contact page, the "Get a Free Quote" pop-up or any "Get a Quote" button), a new row appears in your Google Sheet within a few seconds:

| Received (IST) | Name | Phone | WhatsApp | Project type | Location | Budget | Preferred time | Message | Sent from | Status | Notes | Enquiry ID |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 30 Oct 2026, 01:40 PM | Ravi Kumar | 98765 43210 | https://wa.me/919876543210 | Interior Design | Chennai | ₹10 – 25 Lakh | Evening | … | Free-quote pop-up | New ▾ | | … |

- **WhatsApp**: tap the link to open a chat with the customer.
- **Status**: a drop-down (New, Called, Site visit, Quoted, Won, Not interested) for your follow-up. **Notes** is for your own remarks.

The setup takes about 10 minutes and is done once. It's free and works with any hosting (Vercel, Hostinger, your own server).

---

## Step 1 — Create the sheet

1. Open <https://sheets.google.com> with the Google account that should **own** the enquiries (e.g. Sanjay's or Build Smart's Gmail).
2. Click **Blank spreadsheet** and name it **Build Smart Enquiries**.

## Step 2 — Paste the script

1. In the sheet, open the menu **Extensions → Apps Script**. A new tab opens.
2. Delete everything in the editor (`function myFunction() {…}`).
3. Open the file **`docs/google-sheets/BuildSmart-Enquiries.gs`** from this project (in VS Code or Notepad), copy **all** of it and paste it into the editor.
4. *(Optional)* To get an **email for every enquiry**, put the address on the line `const NOTIFY_EMAIL = "";`, e.g. `const NOTIFY_EMAIL = "sanjay@gmail.com";`
5. Click the 💾 **Save** icon. Name the project **Build Smart Enquiries** if asked.

> The line `const SECRET = "bs_…";` is a password that proves an enquiry really came from your website. It is already filled in — you'll copy the same value into `.env.local` in Step 5. If you ever change it, change it in both places. Because it contains this password, the `.gs` file stays on your computer only and is never uploaded to GitHub.

## Step 3 — Allow the script to write to the sheet

1. At the top of the editor, choose **setupSheet** in the function drop-down and click **▶ Run**.
2. Google asks for permission: **Review permissions** → choose your account.
3. You'll see *"Google hasn't verified this app"*. That's normal for your own scripts — click **Advanced** → **Go to Build Smart Enquiries (unsafe)** → **Allow**.
4. Go back to the sheet: a new tab called **Enquiries** with the column headings is there.

## Step 4 — Publish it as a web app

1. In the Apps Script tab click **Deploy → New deployment**.
2. Click the ⚙️ gear next to *Select type* → **Web app**.
3. Fill in:
   - Description: `Website enquiries`
   - Execute as: **Me**
   - Who has access: **Anyone** ← important (the website isn't signed in to Google; the secret keeps strangers out)
4. Click **Deploy** and **copy the Web app URL**. It looks like
   `https://script.google.com/macros/s/AKfycb…long…/exec`

*Check:* paste that link into your browser. You should see "Build Smart enquiry receiver is running."

## Step 5 — Connect the website (on your computer)

1. In VS Code, right-click the project's top folder (where `package.json` is) → **New File** → name it exactly **`.env.local`** (with the dot at the start).
2. Paste these two lines into it — your web-app link on the first, the `SECRET` value from the top of `docs/google-sheets/BuildSmart-Enquiries.gs` on the second (no quotes, no spaces):
   ```
   LEAD_WEBHOOK_URL=https://script.google.com/macros/s/AKfycb…/exec
   LEAD_WEBHOOK_SECRET=bs_…(the SECRET value from the script)
   ```
   `.env.local` is private: it stays on your computer and is never uploaded to GitHub.
3. Save. In the terminal run:
   ```
   npm run test-sheet
   ```
   ✓ *Connected!* means it works — a row named **TEST — please delete** is now in the sheet. Delete that row.
4. Restart the website (`Ctrl + C`, then `npm run dev`) and send yourself an enquiry from the form — it appears in the sheet.

## Step 6 — Connect the live website

Add the same two values in your hosting's environment-variable settings, then redeploy:

| Name | Value |
| --- | --- |
| `LEAD_WEBHOOK_URL` | the Web app URL from Step 4 |
| `LEAD_WEBHOOK_SECRET` | the same `bs_…` value as in your `.env.local` |

- **Vercel:** Project → **Settings → Environment Variables** → add both → **Deployments → ⋯ → Redeploy**.
- **Hostinger (Node.js hosting):** Website → **Node.js app / Environment variables** → add both → restart the app.
- **VPS:** put both lines in `.env.local` on the server, then `npm run build && pm2 restart build-smart`.

Then send one test enquiry from your phone on the live site.

## On your phone

Install the **Google Sheets** app and open *Build Smart Enquiries*. You can also turn on alerts in the sheet: **Tools → Notification settings → Edit notifications → Any changes are made → Email right away**, or use `NOTIFY_EMAIL` in the script (Step 2).

---

## Good to know

- **Changing the script later?** After any edit: **Deploy → Manage deployments → ✏️ Edit → Version: New version → Deploy**. The link stays the same. (Saving alone doesn't update the live script.)
- **Never share the Web app link or the secret publicly.** Share the *sheet* only with people who need to see enquiries (Share → add their email as Viewer/Editor).
- **Don't rename the "Enquiries" tab or reorder its first 13 columns** — add any extra columns to the right.
- If the sheet can't be reached, the visitor sees *"We couldn't send your enquiry right now. Please try again"* (nothing is lost silently), and the reason is written in the hosting logs:
  - *"secret does not match"* → `SECRET` in the script ≠ `LEAD_WEBHOOK_SECRET`.
  - *"Google asked for a sign-in"* → redeploy with **Who has access: Anyone**.
- While `LEAD_WEBHOOK_URL` is empty, enquiries on your computer are saved to `data/leads.jsonl` instead (`npm run leads` turns them into a spreadsheet file).
