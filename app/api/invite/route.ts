import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs"; // important for email libs to work on Vercel

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ error: "Missing API key" }, { status: 500 });
    }

    const data = await resend.emails.send({
      from: "Bobbi <invite@yourbobbi.io>",
      to: email,
      subject: "You’re on the list 🎉",
      html: `<p>Thanks for requesting early access to Bobbi. We'll be in touch soon!</p>`,
    });

    if (data.error) {
      return NextResponse.json({ error: data.error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("Invite API error:", err);
    return NextResponse.json(
      { error: err?.message || "Unexpected error" },
      { status: 500 }
    );
  }
}
