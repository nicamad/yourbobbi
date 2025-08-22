import { NextResponse } from "next/server";
import { z } from "zod";

/**
 * Make email validation explicit and readable.
 */
const EmailSchema = z.object({
  email: z.string().email("Please enter a valid email."),
  // optional honeypot field—real users leave this blank
  website: z.string().optional(),
  // optional Turnstile token (if you enable Turnstile)
  turnstileToken: z.string().optional(),
});

export const runtime = "nodejs"; // ensure Node runtime for email libs

// Lazy import: avoids build-time API key checks
async function getResend() {
  const { Resend } = await import("resend");
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("Missing RESEND_API_KEY");
  return new Resend(key);
}

function fromAddress() {
  return process.env.RESEND_FROM?.trim() || "Bobbi <invite@yourbobbi.io>";
}

async function postToSlack(text: string) {
  const url = process.env.SLACK_WEBHOOK_URL;
  if (!url) return;
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
  } catch {
    /* non-fatal */
  }
}

async function verifyTurnstile(token?: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // not enabled
  if (!token) return false;

  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token }),
    });
    const data = (await res.json()) as { success?: boolean };
    return !!data.success;
  } catch {
    return false;
  }
}

async function addToAudience(email: string) {
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (!audienceId) return; // not enabled
  const resend = await getResend();
  try {
    await resend.contacts.create({
      audienceId,
      email,
    });
  } catch {
    // Not fatal if contact already exists or audience is disabled
  }
}

type Json = Record<string, unknown>;
function json(data: Json, init?: ResponseInit) {
  return NextResponse.json(data, init);
}

// Small helper to retry transient Resend failures
async function withRetries<T>(fn: () => Promise<T>, attempts = 3, baseDelayMs = 250): Promise<T> {
  let lastErr: unknown;
  for (let i = 0; i < attempts; i++) {
    try { return await fn(); } catch (err) {
      lastErr = err;
      await new Promise(r => setTimeout(r, baseDelayMs * Math.pow(2, i)));
    }
  }
  throw lastErr;
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const parsed = EmailSchema.safeParse(body);

    if (!parsed.success) {
      return json({ ok: false, error: parsed.error.issues[0]?.message || "Invalid request." }, { status: 400 });
    }

    const { email, website, turnstileToken } = parsed.data;

    // Honeypot—bots tend to fill it; humans do not
    if (website && website.trim().length > 0) {
      return json({ ok: true }); // pretend success; silently drop
    }

    // Optional Turnstile
    const passTurnstile = await verifyTurnstile(turnstileToken);
    if (!passTurnstile) {
      return json({ ok: false, error: "Verification failed. Please try again." }, { status: 400 });
    }

    // Optional: store in audience
    await addToAudience(email);

    const toOwner = process.env.INVITE_TO_EMAIL || "";
    if (!toOwner) {
      await postToSlack(`⚠️ INVITE_TO_EMAIL missing; invite from ${email} not forwarded.`);
    }

    const resend = await getResend();
    const subject = "New Bobbi invite request 🎉";

    // Send owner notification + user confirmation in parallel with retry
    await withRetries(async () => {
      await Promise.all([
        toOwner
          ? resend.emails.send({
              from: fromAddress(),
              to: toOwner,
              subject,
              html: `<p><strong>${email}</strong> just requested early access to Bobbi.</p>`,
            })
          : Promise.resolve(),

        resend.emails.send({
          from: fromAddress(),
          to: email,
          subject: "You're on the list 🎟️",
          html: `<p>Thanks for requesting early access to Bobbi. We'll be in touch soon!</p>`,
        }),
      ]);
    });

    return json({ ok: true });
  } catch (err: any) {
    console.error("Invite API error:", err?.message || err);
    await postToSlack(`❌ Invite API error: ${err?.message || String(err)}`);
    // Do not leak provider error details
    return json({ ok: false, error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
