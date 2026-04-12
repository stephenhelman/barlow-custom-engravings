import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/Badge";
import { ItemDetailOrderButton } from "@/components/public/ItemDetailOrderButton";
import type { ItemWithTags } from "@/types";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await prisma.item.findUnique({ where: { id } });
  if (!item) return {};
  return { title: `${item.title} — Barlow Custom Engravings` };
}

export default async function ShopItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await prisma.item.findUnique({
    where: { id },
    include: { tags: { include: { tag: true } } },
  });

  if (!item) notFound();

  const typeTags = item.tags.filter((t) => t.tag.category === "TYPE").map((t) => t.tag);
  const themeTags = item.tags.filter((t) => t.tag.category === "THEME").map((t) => t.tag);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <Link
        href="/shop"
        className="inline-flex items-center gap-1.5 text-text-muted hover:text-text font-body text-sm mb-8 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to shop
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Images */}
        <div className="flex flex-col gap-3">
          {item.images.length > 0 ? (
            <>
              <div className="relative rounded-xl overflow-hidden bg-surface border border-border aspect-square">
                <Image
                  src={item.images[0]}
                  alt={item.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              {item.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {item.images.slice(1, 5).map((src, i) => (
                    <div key={i} className="aspect-square rounded-lg overflow-hidden bg-surface border border-border">
                      <Image src={src} alt={`${item.title} ${i + 2}`} width={120} height={120} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="aspect-square rounded-xl bg-surface border border-border flex items-center justify-center">
              <svg className="w-16 h-16 text-text-faint" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col gap-5">
          <div>
            {item.status === "SOLD" && (
              <Badge variant="sold" label="Sold" className="mb-3" />
            )}
            <h1 className="font-display text-2xl sm:text-3xl font-semibold text-text mb-2">
              {item.title}
            </h1>
            {item.price && item.status === "FOR_SALE" && (
              <p className="text-leather-light font-body text-xl font-semibold">
                ${Number(item.price).toFixed(2)}
              </p>
            )}
          </div>

          {item.description && (
            <p className="text-text-muted font-body text-sm leading-relaxed">
              {item.description}
            </p>
          )}

          {/* Tags */}
          {(typeTags.length > 0 || themeTags.length > 0) && (
            <div className="flex flex-col gap-2">
              {typeTags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {typeTags.map((t) => (
                    <span key={t.id} className="text-xs font-body px-2 py-1 rounded-full bg-surface border border-border text-text-muted">
                      {t.name}
                    </span>
                  ))}
                </div>
              )}
              {themeTags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {themeTags.map((t) => (
                    <span key={t.id} className="text-xs font-body px-2 py-1 rounded-full bg-surface-raised border border-border text-text-muted">
                      {t.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="pt-2">
            <ItemDetailOrderButton item={item as ItemWithTags} />
          </div>

          <p className="text-xs text-text-faint font-body">
            All pieces are made to order. Michelle will confirm details and timeline after you submit.
          </p>
        </div>
      </div>
    </div>
  );
}
