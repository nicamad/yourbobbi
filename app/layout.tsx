import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bobbi — Your Back‑Office Bot Buddi",
  description:
    "Meet Bobbi — your back‑office, MBA brain. Automate invoices, payroll, taxes, inventory and get plain‑language insights that grow your business.",
  metadataBase: new URL("https://yourbobbi.io"),
  openGraph: {
    title: "Bobbi — Your Back‑Office Bot Buddi",
    description:
      "Automate the boring bits. Understand your margins. Grow with confidence.",
    url: "https://yourbobbi.io",
    siteName: "Bobbi",
    images: ["/og.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bobbi — Your Back‑Office Bot Buddi",
    description:
      "Automate the boring bits. Understand your margins. Grow with confidence.",
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
