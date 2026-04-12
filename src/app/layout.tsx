import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { OrderModal } from "@/components/public/OrderModal";

export const metadata: Metadata = {
  title: "Barlow Custom Engravings — Handcrafted in El Paso, TX",
  description:
    "Custom leather engravings, wallets, keychains, dog tags, and wood panels. Handcrafted in El Paso, Texas. Found at the Swap Meet.",
  openGraph: {
    title: "Barlow Custom Engravings",
    description: "Custom laser engravings handcrafted in El Paso, TX.",
    url: process.env.NEXT_PUBLIC_SITE_URL,
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
