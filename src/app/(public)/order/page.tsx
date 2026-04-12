import { OrderPageForm } from "@/components/public/OrderPageForm";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Custom Order",
  description: "Request a custom laser engraving in El Paso, TX. Wallets, keychains, dog tags, wood panels, and more. Submit your idea and we'll respond within 24 hours.",
  keywords: ["custom engraving order El Paso", "personalized laser engraving request", "custom leather wallet order", "engraving gift order El Paso TX"],
  alternates: { canonical: "/order" },
  openGraph: {
    title: "Place a Custom Order — Barlow Custom Engravings",
    description: "Request a custom laser engraving in El Paso, TX. We respond within 24 hours.",
    url: "/order",
  },
};

export default async function OrderPage() {
  const raw = await prisma.offering.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
  });

  // Serialize Decimal → number so it can cross the server→client boundary
  const offerings = raw.map((o) => ({ ...o, price: Number(o.price) }));

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10">
        <span className="text-leather font-body text-xs uppercase tracking-widest font-semibold">Custom Order</span>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-text mt-2 mb-3">
          Let&apos;s build something.
        </h1>
        <p className="text-text-muted font-body leading-relaxed">
          Fill out the form below and Michelle will reach out within 24 hours to confirm your
          order details and pricing.
        </p>
      </div>
      <OrderPageForm offerings={offerings} />
    </div>
  );
}
