"use client";

import { Button } from "@/components/ui/Button";
import { useOrderModal } from "@/store/useOrderModal";
import type { ItemWithTags } from "@/types";

export function ItemDetailOrderButton({ item }: { item: ItemWithTags }) {
  const open = useOrderModal((s) => s.open);
  const isSold = item.status === "SOLD";

  return (
    <Button size="lg" variant={isSold ? "secondary" : "primary"} className="w-full" onClick={() => open(item)}>
      {isSold ? "Request Similar Piece" : "Order This Piece"}
    </Button>
  );
}
