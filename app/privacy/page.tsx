export const metadata = { title: "Privacy — Bobbi" };

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold">Privacy Policy</h1>
      <p className="mt-4 text-muted-foreground">
        We keep things simple and careful. Data you share is used to deliver Bobbi’s features, improve your experience, and comply with the law. We never sell your data.
      </p>
      <h2 className="mt-8 text-xl font-semibold">What we collect</h2>
      <ul className="mt-2 list-disc space-y-1 pl-6 text-sm text-muted-foreground">
        <li>Contact info you provide (e.g., email, business name)</li>
        <li>Operational data you connect or enter (e.g., invoices, costs)</li>
        <li>Usage analytics to improve Bobbi</li>
      </ul>
      <h2 className="mt-8 text-xl font-semibold">How we protect it</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Encryption in transit & at rest; least‑privilege access; audit trails. Read‑only connections by default; any write actions are explicit and logged.
      </p>
      <h2 className="mt-8 text-xl font-semibold">Contact</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Questions? Email <a className="underline" href="mailto:hello@yourbobbi.io">hello@yourbobbi.io</a>.
      </p>
    </main>
  );
}
