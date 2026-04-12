"use client";

import { useState, useMemo } from "react";
import { ItemCard } from "./ItemCard";
import { useOrderModal } from "@/store/useOrderModal";
import type { ItemWithTags, Tag } from "@/types";

interface ShopClientProps {
  items: ItemWithTags[];
  tags: Tag[];
}

export function ShopClient({ items, tags }: ShopClientProps) {
  const open = useOrderModal((s) => s.open);
  const [activeTypeIds, setActiveTypeIds] = useState<Set<string>>(new Set());
  const [activeThemeIds, setActiveThemeIds] = useState<Set<string>>(new Set());

  const typeTags = tags.filter((t) => t.category === "TYPE");
  const themeTags = tags.filter((t) => t.category === "THEME");

  function toggleType(id: string) {
    setActiveTypeIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }
  function toggleTheme(id: string) {
    setActiveThemeIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const itemTagIds = new Set(item.tags.map((t) => t.tagId));
      if (activeTypeIds.size > 0) {
        const hasType = [...activeTypeIds].some((id) => itemTagIds.has(id));
        if (!hasType) return false;
      }
      if (activeThemeIds.size > 0) {
        const hasTheme = [...activeThemeIds].some((id) => itemTagIds.has(id));
        if (!hasTheme) return false;
      }
      return true;
    });
  }, [items, activeTypeIds, activeThemeIds]);

  const hasFilters = activeTypeIds.size > 0 || activeThemeIds.size > 0;

  return (
    <>
      {/* Filters */}
      <div className="flex flex-col gap-3 mb-8">
        {typeTags.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs text-text-faint font-body uppercase tracking-wider w-12 shrink-0">Type</span>
            {typeTags.map((tag) => (
              <TagChip
                key={tag.id}
                label={tag.name}
                active={activeTypeIds.has(tag.id)}
                onClick={() => toggleType(tag.id)}
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
                active={activeThemeIds.has(tag.id)}
                onClick={() => toggleTheme(tag.id)}
              />
            ))}
          </div>
        )}
        {hasFilters && (
          <button
            onClick={() => {
              setActiveTypeIds(new Set());
              setActiveThemeIds(new Set());
            }}
            className="self-start text-xs text-text-faint hover:text-text-muted font-body underline underline-offset-2 transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>

      <p className="text-xs text-text-faint font-body mb-5">
        {filtered.length} {filtered.length === 1 ? "item" : "items"}
      </p>

      {filtered.length === 0 ? (
        <div className="py-20 text-center text-text-muted font-body text-sm">
          No items match your filters.
        </div>
      ) : (
        <div className="masonry-grid">
          {filtered.map((item) => (
            <div key={item.id} className="masonry-item">
              <ItemCard item={item} variant="shop" />
            </div>
          ))}
        </div>
      )}

      {/* Floating custom order button */}
      <button
        onClick={() => open()}
        className="fixed bottom-6 right-4 sm:right-6 z-30 flex items-center gap-2 bg-leather hover:bg-leather-light text-bg font-body font-semibold text-sm px-4 py-3 rounded-full shadow-lg transition-all hover:shadow-xl active:scale-95"
        aria-label="Start a custom order"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
        Custom Order
      </button>
    </>
  );
}

function TagChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
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
