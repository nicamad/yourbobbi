import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

// Force a Node.js Lambda (Resend SDK does not run on Edge)
export const runtime = "nodejs";
// Ensure this doesn't get cached between invocations
export const dynamic = "force-dynamic";

const resend = new Resend(process.env.RESEND_API_KEY);

function isEmail(v: unknown): v is string {
  return typeof v === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({} as any));
    const email = body?.email;

    if (!isEmail(email)) {
      return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 400 });
    }

    const to = process.env.INVITE_TO_EMAIL;
    if (!to) {
      console.error("INVITE_TO_EMAIL is missing");
      return NextResponse.json({ ok: false, error: "Server misconfigured" }, { status: 500 });
    }

    // If your custom domain isn’t verified in Resend yet, set RESEND_USE_FALLBACK=1
    // and we’ll send from onboarding@resend.dev to prove the flow.
    const useFallback = process.env.RESEND_USE_FALLBACK === "1";
    const from = useFallback ? "onboarding@resend.dev" : "Bobbi <welcome@yourbobbi.io>";

    const result = await resend.emails.send({
      from,
      to,
      subject: `New invite request: ${email}`,
      text: `Please add ${email} to the early‑access list.`,
      headers: { "X-Entity-Ref-ID": `invite-${Date.now()}` },
    });

    if ((result as any)?.error) {
      console.error("Resend error:", (result as any).error);
      return NextResponse.json({ ok: false, error: "Email send failed" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("Invite API failed:", err?.message || err);
    return NextResponse.json({ ok: false, error: "Unexpected error" }, { status: 500 });
  }
}
