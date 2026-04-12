import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.barlowcustomengravings.com";

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/gallery`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/shop`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/order`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  ];

  const items = await prisma.item.findMany({
    select: { id: true, updatedAt: true },
    orderBy: { updatedAt: "desc" },
  });

  const itemRoutes: MetadataRoute.Sitemap = items.map((item) => ({
    url: `${siteUrl}/shop/${item.id}`,
    lastModified: item.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...itemRoutes];
}
