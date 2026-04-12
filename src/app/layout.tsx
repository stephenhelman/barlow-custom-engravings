import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { OrderModal } from "@/components/public/OrderModal";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.barlowcustomengravings.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Barlow Custom Engravings — Handcrafted in El Paso, TX",
    template: "%s | Barlow Custom Engravings",
  },
  description:
    "Custom laser engravings on leather wallets, keychains, dog tags, and wood panels. Handcrafted in El Paso, Texas. Available at the Swap Meet or by custom order.",
  keywords: [
    "custom engraving El Paso",
    "laser engraving El Paso TX",
    "custom leather wallet El Paso",
    "personalized gifts El Paso",
    "custom keychains El Paso",
    "engraved dog tags El Paso",
    "Barlow Custom Engravings",
    "El Paso Swap Meet",
    "custom wood engraving",
  ],
  authors: [{ name: "Barlow Custom Engravings" }],
  creator: "Barlow Custom Engravings",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Barlow Custom Engravings",
    title: "Barlow Custom Engravings — Handcrafted in El Paso, TX",
    description:
      "Custom laser engravings on leather wallets, keychains, dog tags, and wood panels. Handcrafted in El Paso, Texas.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Barlow Custom Engravings — Handcrafted in El Paso, TX",
    description:
      "Custom laser engravings on leather wallets, keychains, dog tags, and wood panels. Handcrafted in El Paso, Texas.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-bg text-text">
        {children}
        <OrderModal />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "var(--surface-raised)",
              border: "1px solid var(--border-hover)",
              color: "var(--text)",
            },
          }}
        />
      </body>
    </html>
  );
}
