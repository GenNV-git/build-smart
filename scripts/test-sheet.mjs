/**
 * npm run test-sheet
 * Sends one sample enquiry straight to your Google Sheet, using LEAD_WEBHOOK_URL and
 * LEAD_WEBHOOK_SECRET from .env.local — a quick check that the connection works.
 * The test row is named "TEST — please delete"; delete it from the sheet afterwards.
 */
import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";

function readEnv(file) {
  const out = {};
  if (!fs.existsSync(file)) return out;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) out[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
  return out;
}

const env = { ...readEnv(path.join(process.cwd(), ".env.local")), ...process.env };
const url = (env.LEAD_WEBHOOK_URL || "").trim();
const secret = env.LEAD_WEBHOOK_SECRET || "";

if (!url) {
  console.log("\n✗ LEAD_WEBHOOK_URL is empty in .env.local.");
  console.log("  Paste your Apps Script web-app link after LEAD_WEBHOOK_URL= and run this again.\n");
  process.exit(1);
}
if (!/^https:\/\/script\.google\.com\/macros\/s\/.+\/exec$/.test(url)) {
  console.log("\n! The link doesn't look like an Apps Script web-app link (https://script.google.com/macros/s/…/exec).");
  console.log("  Trying anyway…\n");
}

const lead = {
  id: randomUUID(),
  createdAt: new Date().toISOString(),
  consentGiven: true,
  name: "TEST — please delete",
  phone: "+91 77088 56606",
  projectType: "Interior Design",
  location: "Test",
  budget: "Not sure yet",
  contactTime: "Any time",
  message: "This is a test enquiry sent by npm run test-sheet.",
  source: "test",
};

try {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "website_enquiry", secret, lead }),
    redirect: "follow",
    signal: AbortSignal.timeout(20_000),
  });
  const text = await res.text();
  let reply = null;
  try {
    reply = JSON.parse(text);
  } catch {}
  if (res.ok && reply?.ok) {
    console.log("\n✓ Connected! A row named \"TEST — please delete\" was added to the Enquiries tab of your sheet.\n");
  } else if (reply?.error === "unauthorised") {
    console.log("\n✗ The sheet refused the test: the secret doesn't match.");
    console.log("  Make sure SECRET in the Apps Script is exactly the same as LEAD_WEBHOOK_SECRET in .env.local,");
    console.log("  then in Apps Script choose Deploy → Manage deployments → ✎ Edit → Version: New version → Deploy.\n");
    process.exit(1);
  } else if (res.status === 401 || res.status === 403 || /accounts\.google\.com|ServiceLogin|Sign in/i.test(text)) {
    console.log(`\n✗ Google refused the request (HTTP ${res.status}): the web app isn't open to the website yet.`);
    console.log('  In Apps Script: Deploy → Manage deployments → ✏️ Edit → Who has access: "Anyone"');
    console.log("  → Version: New version → Deploy. The link stays the same; then run this again.\n");
    process.exit(1);
  } else {
    console.log(`\n✗ Unexpected reply (HTTP ${res.status}):\n${text.slice(0, 400)}\n`);
    process.exit(1);
  }
} catch (err) {
  console.log(`\n✗ Couldn't reach the link: ${err instanceof Error ? err.message : err}\n`);
  process.exit(1);
}
