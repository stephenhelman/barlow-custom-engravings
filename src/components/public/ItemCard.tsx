"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useOrderModal } from "@/store/useOrderModal";
import type { ItemWithTags } from "@/types";

interface ItemCardProps {
  item: ItemWithTags;
  variant?: "gallery" | "shop";
}

export function ItemCard({ item, variant = "gallery" }: ItemCardProps) {
  const open = useOrderModal((s) => s.open);
  const primaryImage = item.images[0];
  const isSold = item.status === "SOLD";
  const isForSale = item.status === "FOR_SALE" && item.contentType === "PHYSICAL_ITEM";
  const isOrderable = item.contentType === "PHYSICAL_ITEM";

  return (
    <div className="group relative rounded-lg overflow-hidden border border-border hover:border-border-hover transition-all duration-200 bg-surface">
      {/* Image */}
      <div className="relative overflow-hidden">
        {primaryImage ? (
          <Link href={variant === "shop" ? `/shop/${item.id}` : "#"} tabIndex={variant === "shop" ? 0 : -1}>
            <Image
              src={primaryImage}
              alt={item.title}
              width={600}
              height={600}
              className="w-full object-cover aspect-square group-hover:scale-[1.03] transition-transform duration-300"
            />
          </Link>
        ) : (
          <div className="aspect-square w-full bg-surface-raised flex items-center justify-center">
            <svg className="w-10 h-10 text-text-faint" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {/* Sold overlay */}
        {isSold && (
          <div className="absolute inset-0 bg-bg/50 flex items-start justify-end p-2 pointer-events-none">
            <Badge variant="sold" label="Sold" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3">
        <h3 className="font-display text-sm font-medium text-text leading-snug mb-1.5 line-clamp-2">
          {item.title}
        </h3>

        {/* Tags */}
        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {item.tags.slice(0, 3).map(({ tag }) => (
              <span
                key={tag.id}
                className="text-xs text-text-faint font-body px-1.5 py-0.5 rounded bg-surface-raised"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}

        {/* Price (shop only) */}
        {variant === "shop" && item.price && !isSold && (
          <p className="text-leather-light font-body text-sm font-semibold mb-2">
            ${Number(item.price).toFixed(2)}
          </p>
        )}
      </div>

      {/* Action bar — always visible on mobile, expands on hover for desktop */}
      {isOrderable && (
        <div className="
          absolute bottom-0 inset-x-0
          bg-surface/95 backdrop-blur-sm border-t border-border
          translate-y-0
          sm:translate-y-full sm:group-hover:translate-y-0 sm:transition-transform sm:duration-200
          px-3 py-2
        ">
          <Button
            size="sm"
            variant={isSold ? "secondary" : "primary"}
            className="w-full text-xs"
            onClick={() => open(item)}
          >
            {isSold ? "Request Similar" : "Order This"}
          </Button>
        </div>
      )}
    </div>
  );
}
