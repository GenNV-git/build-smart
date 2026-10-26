# Phase 2 — WhatsApp lead notifications

**Status: prepared, switched off, not yet tested against a live account.**
The website never tells visitors that a WhatsApp message was sent. Enquiries are stored first; the WhatsApp alert is a best-effort extra. If it fails, the enquiry is still saved and the error is logged on the server (without customer details).

## Flow

1. Visitor submits the consultation form.
2. `POST /api/leads` validates the data on the server.
3. The lead is stored (`LEAD_STORAGE`).
4. `notifyOwnerOnWhatsApp()` in `src/lib/leads/whatsapp.ts` sends the alert, depending on `WHATSAPP_NOTIFY_PROVIDER`.
5. The owner receives:

```
New Build Smart Website Enquiry

Name: [Customer Name]
Phone: [Customer Phone]
Project Type: [Project Type]
Location: [Location]
Budget: [Budget, if provided]
Message: [Message, if provided]

Please contact the customer.
```

6. The visitor sees the success message.

All credentials are server-side environment variables. Nothing WhatsApp-related is sent to the browser.

---

## Option 1 — WhatsApp Business Platform (Meta Cloud API) — `meta-cloud`

What you need:

- A Meta Business account (verified for higher limits) and a **WhatsApp Business app** in Meta for Developers.
- A **sender phone number** registered on the Cloud API. It cannot be a number already in use on the regular WhatsApp / WhatsApp Business app, so use a separate number for sending alerts.
- A **permanent System User access token** with `whatsapp_business_messaging` permission (temporary tokens expire in 24 h).
- An **approved message template**, because the business is starting the conversation. Suggested template:

  - Name: `new_website_enquiry` · Category: **Utility** · Language: English (`en`)
  - Body:
    ```
    New Build Smart Website Enquiry

    Name: {{1}}
    Phone: {{2}}
    Project Type: {{3}}
    Location: {{4}}
    Budget: {{5}}
    Message: {{6}}

    Please contact the customer.
    ```
  The code fills `{{1}}…{{6}}` in that order and sends "—" for empty optional fields.

Environment variables:

```
WHATSAPP_NOTIFY_PROVIDER=meta-cloud
WHATSAPP_OWNER_NUMBER=91XXXXXXXXXX        # who receives the alert
WHATSAPP_ACCESS_TOKEN=...                 # permanent system-user token
WHATSAPP_PHONE_NUMBER_ID=...              # from WhatsApp → API Setup
WHATSAPP_GRAPH_API_VERSION=v23.0          # use the current version shown in your Meta dashboard
WHATSAPP_MESSAGE_MODE=template
WHATSAPP_TEMPLATE_NAME=new_website_enquiry
WHATSAPP_TEMPLATE_LANG=en
```

`WHATSAPP_MESSAGE_MODE=text` sends a free-form message instead, but Meta only delivers that inside a 24-hour window after the owner has messaged the business number. Template mode is the reliable choice.

Meta charges per template conversation according to its current pricing for India — check the Meta pricing page before launch.

## Option 2 — Automation service or WhatsApp BSP — `webhook`

Use this with Make, Zapier, n8n, a Twilio Function, or a WhatsApp Business Solution Provider (Interakt, AiSensy, Wati, Gupshup…) that offers an incoming webhook.

```
WHATSAPP_NOTIFY_PROVIDER=webhook
WHATSAPP_WEBHOOK_URL=https://hook.example.com/...
WHATSAPP_WEBHOOK_SECRET=long-random-string
WHATSAPP_OWNER_NUMBER=91XXXXXXXXXX        # optional, passed through as "to"
```

The site POSTs JSON:

```json
{ "to": "91XXXXXXXXXX", "text": "New Build Smart Website Enquiry\n\nName: …", "lead": { "id": "…", "name": "…", "phone": "…", … } }
```

with header `X-Build-Smart-Secret: <WHATSAPP_WEBHOOK_SECRET>`. In the automation, verify the header, then send `text` to the owner using the provider's WhatsApp action.

---

## Testing before switching on

1. Set the variables in a preview/staging deployment first.
2. Submit an enquiry with your own number.
3. Confirm the owner receives the alert and the lead is also stored.
4. Check server logs for `[leads] WhatsApp notification failed` lines.
5. Only then set the same variables on production.

To switch off at any time: `WHATSAPP_NOTIFY_PROVIDER=none`.
