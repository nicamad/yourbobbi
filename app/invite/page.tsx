"use client";
import { useState } from "react";

export default function InvitePage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<null | "idle" | "sending" | "ok" | "err">(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Bad response");
      setStatus("ok");
      setEmail("");
    } catch {
      setStatus("err");
    }
  }

  return (
    <div className="max-w-lg mx-auto py-16 px-6">
      <h1 className="text-3xl font-bold mb-2">Request an invite</h1>
      <p className="text-muted-foreground mb-6">
        Pop in your email and I’ll follow up with early‑access details.
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          required
          placeholder="you@studio.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border rounded px-3 py-2 w-full"
        />
        <button
          type="submit"
          className="bg-black text-white px-4 rounded disabled:opacity-50"
          disabled={status === "sending"}
        >
          {status === "sending" ? "Sending…" : "Invite me"}
        </button>
      </form>
      {status === "ok" && <p className="mt-4 text-green-600">✅ Got it—check your inbox soon.</p>}
      {status === "err" && <p className="mt-4 text-red-600">❌ Something went wrong. Try again.</p>}
    </div>
  );
}
