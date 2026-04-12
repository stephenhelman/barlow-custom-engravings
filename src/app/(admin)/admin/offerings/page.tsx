import { prisma } from "@/lib/prisma";
import { OfferingsClient } from "@/components/admin/OfferingsClient";

export const metadata = { title: "Offerings — Admin" };

export default async function OfferingsPage() {
  const offerings = await prisma.offering.findMany({ orderBy: { sortOrder: "asc" } });
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-text mb-6">Offerings & Pricing</h1>
      <OfferingsClient initialOfferings={offerings} />
    </div>
  );
}
