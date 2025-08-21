"use client";

import { useState } from "react";

export default function InvitePage() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [ok, setOk] = useState<null | boolean>(null);
  const [error, setError] = useState<string | null>(null);

  // Honeypot field
  const [website, setWebsite] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setOk(null);

    try {
      // Optional: Turnstile (only if site key is present in the DOM)
      const turnstileEl = document.getElementById("turnstile-token") as HTMLInputElement | null;
      const turnstileToken = turnstileEl?.value || undefined;

      const res = await fetch("/api/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, website, turnstileToken }),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || "Something went wrong. Please try again.");
      }
      setOk(true);
      setEmail("");
    } catch (err: any) {
      setOk(false);
      setError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto max-w-xl px-6 py-16">
      <h1 className="text-4xl font-semibold mb-3">Request an invite</h1>
      <p className="text-neutral-500 mb-8">
        Pop in your email and I’ll follow up with early‑access details.
      </p>

      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <input
          type="email"
          required
          disabled={busy}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          className="rounded-lg border border-neutral-300 bg-white px-4 py-3 text-base outline-none focus:border-black"
        />

        {/* Honeypot—hidden from users; bots will fill it */}
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          className="hidden"
          aria-hidden="true"
        />

        {/* Optional Turnstile hidden input; if you mount Turnstile, write token here */}
        <input id="turnstile-token" type="hidden" />

        <button
          type="submit"
          disabled={busy}
          className="rounded-lg bg-black text-white px-5 py-3 text-base disabled:opacity-60"
        >
          {busy ? "Sending…" : "Invite me"}
        </button>
      </form>

      {ok && (
        <p className="mt-4 text-green-600">You’re on the list—check your inbox ✉️</p>
      )}
      {ok === false && error && (
        <p className="mt-4 text-red-600">✗ {error}</p>
      )}
    </main>
  );
}
