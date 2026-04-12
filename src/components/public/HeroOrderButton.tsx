"use client";

import { Button } from "@/components/ui/Button";
import { useOrderModal } from "@/store/useOrderModal";

interface HeroOrderButtonProps {
  size?: "sm" | "md" | "lg";
  label?: string;
}

export function HeroOrderButton({
  size = "md",
  label = "Start Custom Order",
}: HeroOrderButtonProps) {
  const open = useOrderModal((s) => s.open);
  return (
    <Button variant="secondary" size={size} onClick={() => open()}>
      {label}
    </Button>
  );
}
