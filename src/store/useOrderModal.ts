"use client";

import { create } from "zustand";
import type { ItemWithTags } from "@/types";

interface OrderModalState {
  isOpen: boolean;
  prefillItem: ItemWithTags | null;
  open: (item?: ItemWithTags) => void;
  close: () => void;
}

export const useOrderModal = create<OrderModalState>((set) => ({
  isOpen: false,
  prefillItem: null,
  open: (item) => set({ isOpen: true, prefillItem: item ?? null }),
  close: () => set({ isOpen: false, prefillItem: null }),
}));
