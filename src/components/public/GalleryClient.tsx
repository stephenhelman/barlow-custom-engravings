"use client";

import { useState, useMemo } from "react";
import { ItemCard } from "./ItemCard";
import type { ItemWithTags, Tag } from "@/types";

type StatusFilter = "ALL" | "FOR_SALE" | "SOLD";

interface GalleryClientProps {
  items: ItemWithTags[];
  tags: Tag[];
}

export function GalleryClient({ items, tags }: GalleryClientProps) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [activeTagIds, setActiveTagIds] = useState<Set<string>>(new Set());

  const typeTags = tags.filter((t) => t.category === "TYPE");
  const themeTags = tags.filter((t) => t.category === "THEME");

  function toggleTag(id: string) {
    setActiveTagIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const filtered = useMemo(() => {
    return items.filter((item) => {
      if (statusFilter === "FOR_SALE" && item.status !== "FOR_SALE") return false;
      if (statusFilter === "SOLD" && item.status !== "SOLD") return false;
      if (activeTagIds.size > 0) {
        const itemTagIds = new Set(item.tags.map((t) => t.tagId));
        for (const id of activeTagIds) {
          if (!itemTagIds.has(id)) return false;
        }
      }
      return true;
    });
  }, [items, statusFilter, activeTagIds]);

  return (
    <>
      {/* Status filter */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {(["ALL", "FOR_SALE", "SOLD"] as StatusFilter[]).map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-body font-medium transition-colors border ${
              statusFilter === s
                ? "bg-leather text-bg border-leather"
                : "border-border text-text-muted hover:border-border-hover hover:text-text"
            }`}
          >
            {s === "ALL" ? "All" : s === "FOR_SALE" ? "For Sale" : "Sold"}
          </button>
        ))}
      </div>

      {/* Tag filters */}
      {(typeTags.length > 0 || themeTags.length > 0) && (
        <div className="flex flex-col gap-3 mb-8">
          {typeTags.length > 0 && (
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs text-text-faint font-body uppercase tracking-wider w-12 shrink-0">Type</span>
              {typeTags.map((tag) => (
                <TagChip
                  key={tag.id}
                  label={tag.name}
                  active={activeTagIds.has(tag.id)}
                  onClick={() => toggleTag(tag.id)}
                />
              ))}
            </div>
          )}
          {themeTags.length > 0 && (
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs text-text-faint font-body uppercase tracking-wider w-12 shrink-0">Theme</span>
              {themeTags.map((tag) => (
                <TagChip
                  key={tag.id}
                  label={tag.name}
                  active={activeTagIds.has(tag.id)}
                  onClick={() => toggleTag(tag.id)}
                />
              ))}
            </div>
          )}
          {activeTagIds.size > 0 && (
            <button
              onClick={() => setActiveTagIds(new Set())}
              className="self-start text-xs text-text-faint hover:text-text-muted font-body underline underline-offset-2 transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* Result count */}
      <p className="text-xs text-text-faint font-body mb-5">
        {filtered.length} {filtered.length === 1 ? "piece" : "pieces"}
      </p>

      {/* Masonry grid */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center text-text-muted font-body text-sm">
          No items match your filters.
        </div>
      ) : (
        <div className="masonry-grid">
          {filtered.map((item) => (
            <div key={item.id} className="masonry-item">
              <ItemCard item={item} variant="gallery" />
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function TagChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-2.5 py-1 rounded text-xs font-body transition-colors border ${
        active
          ? "bg-leather/20 border-leather/50 text-leather-light"
          : "border-border text-text-muted hover:border-border-hover hover:text-text"
      }`}
    >
      {label}
    </button>
  );
}
