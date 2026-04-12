import { prisma } from "@/lib/prisma";
import { GalleryClient } from "@/components/public/GalleryClient";
import type { ItemWithTags } from "@/types";

export const metadata = {
  title: "Gallery",
  description: "Browse our portfolio of custom laser-engraved leather wallets, keychains, dog tags, and wood panels made in El Paso, TX. New pieces added regularly.",
  keywords: ["custom engraving gallery", "laser engraving portfolio El Paso", "engraved leather wallet", "custom gifts El Paso TX"],
  alternates: { canonical: "/gallery" },
  openGraph: {
    title: "Gallery — Barlow Custom Engravings",
    description: "Browse our portfolio of custom laser-engraved work made in El Paso, TX.",
    url: "/gallery",
  },
};

export default async function GalleryPage() {
  const [items, tags] = await Promise.all([
    prisma.item.findMany({
      include: { tags: { include: { tag: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.tag.findMany({ orderBy: [{ category: "asc" }, { name: "asc" }] }),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-text mb-2">Gallery</h1>
        <p className="text-text-muted font-body">All of our work — for sale, sold, and inspiration pieces.</p>
      </div>
      <GalleryClient items={items as ItemWithTags[]} tags={tags} />
    </div>
  );
}
