import { prisma } from "@/lib/prisma";
import { OrdersTable } from "@/components/admin/OrdersTable";
import type { OrderWithItem } from "@/types";

export const metadata = { title: "Orders — Admin" };

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;

  const orders = await prisma.order.findMany({
    where: status ? { status: status as never } : undefined,
    include: { referenceItem: { include: { tags: { include: { tag: true } } } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-semibold text-text">Order Inbox</h1>
        <span className="text-sm text-text-muted font-body">
          {orders.length} {orders.length === 1 ? "order" : "orders"}
        </span>
      </div>
      <OrdersTable orders={orders as OrderWithItem[]} activeStatus={status} />
    </div>
  );
}
