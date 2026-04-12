"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function DeleteItemButton({ id, title }: { id: string; title: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);

  async function handleDelete() {
    try {
      await fetch(`/api/items/${id}`, { method: "DELETE" });
      toast.success("Item deleted");
      router.refresh();
    } catch {
      toast.error("Failed to delete item");
    } finally {
      setConfirming(false);
    }
  }

  if (confirming) {
    return (
      <span className="flex items-center gap-1.5">
        <button onClick={handleDelete} className="text-xs text-red-400 hover:text-red-300 font-body transition-colors">
          Confirm
        </button>
        <button onClick={() => setConfirming(false)} className="text-xs text-text-muted hover:text-text font-body transition-colors">
          Cancel
        </button>
      </span>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="text-xs text-text-faint hover:text-red-400 font-body transition-colors"
    >
      Delete
    </button>
  );
}
