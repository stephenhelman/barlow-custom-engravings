import { prisma } from "@/lib/prisma";
import { ShopClient } from "@/components/public/ShopClient";
import type { ItemWithTags } from "@/types";

export const metadata = {
  title: "Shop",
  description: "Shop handcrafted custom laser-engraved leather wallets, keychains, dog tags, and wood panels. Made in El Paso, TX. Starting at $10.",
  keywords: ["buy custom engraving El Paso", "engraved leather wallet for sale", "personalized keychain El Paso", "custom dog tag El Paso TX"],
  alternates: { canonical: "/shop" },
  openGraph: {
    title: "Shop — Barlow Custom Engravings",
    description: "Shop handcrafted custom laser engravings. Starting at $10. Made in El Paso, TX.",
    url: "/shop",
  },
};

export default async function ShopPage() {
  const [items, tags] = await Promise.all([
    prisma.item.findMany({
      where: { status: "FOR_SALE", contentType: "PHYSICAL_ITEM" },
      include: { tags: { include: { tag: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.tag.findMany({ orderBy: [{ category: "asc" }, { name: "asc" }] }),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 pb-24">
      <div className="mb-8">
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-text mb-2">Shop</h1>
        <p className="text-text-muted font-body">For-sale pieces, ready to order.</p>
      </div>
      <ShopClient items={items as ItemWithTags[]} tags={tags} />
    </div>
  );
}
