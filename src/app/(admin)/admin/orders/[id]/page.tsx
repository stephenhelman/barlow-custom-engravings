import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { OrderDetailClient } from "@/components/admin/OrderDetailClient";
import type { OrderWithItem } from "@/types";

export const metadata = { title: "Order Detail — Admin" };

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { referenceItem: { include: { tags: { include: { tag: true } } } } },
  });

  if (!order) notFound();

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/admin/dashboard"
          className="text-text-muted hover:text-text text-sm font-body transition-colors"
        >
          ← Orders
        </Link>
        <span className="text-text-faint">/</span>
        <span className="text-text-muted text-sm font-body truncate">{order.customerName}</span>
      </div>

      <OrderDetailClient order={order as OrderWithItem} />
    </div>
  );
}
