import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.INVITE_TO_EMAIL;
    if (!apiKey || !toEmail) {
      return NextResponse.json({ error: "Server not configured" }, { status: 500 });
    }

    // Very light input guard
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Bobbi <no-reply@yourbobbi.io>",
        to: [toEmail],
        subject: "New Invite Request",
        html: `<p>New invite request from <b>${email}</b></p>`,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: "Resend error", details: text }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
