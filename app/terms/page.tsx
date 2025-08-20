export const metadata = { title: "Terms — Bobbi" };

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold">Terms of Service</h1>
      <p className="mt-4 text-muted-foreground">
        By using Bobbi, you agree to these terms. We provide tools and guidance; you remain responsible for your business decisions and compliance.
      </p>
      <h2 className="mt-8 text-xl font-semibold">Accounts</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Keep your login secure. You’re responsible for activity on your account.
      </p>
      <h2 className="mt-8 text-xl font-semibold">Payments</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Paid plans renew monthly unless canceled. Refunds are not guaranteed.
      </p>
      <h2 className="mt-8 text-xl font-semibold">Liability</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Bobbi is provided “as is.” To the maximum extent permitted by law, Bobbi Labs is not liable for indirect or consequential damages.
      </p>
      <h2 className="mt-8 text-xl font-semibold">Contact</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Questions? Email <a className="underline" href="mailto:hello@yourbobbi.io">hello@yourbobbi.io</a>.
      </p>
    </main>
  );
}
