"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import type { OrderWithItem, OrderStatus } from "@/types";

const STATUS_COLORS: Record<OrderStatus, string> = {
  NEW: "bg-blue-900/50 text-blue-300 border-blue-800/60",
  QUOTED: "bg-yellow-900/50 text-yellow-300 border-yellow-800/60",
  IN_PROGRESS: "bg-purple-900/50 text-purple-300 border-purple-800/60",
  COMPLETED: "bg-green-900/50 text-green-300 border-green-800/60",
  PAID: "bg-emerald-900/50 text-emerald-300 border-emerald-800/60",
  CANCELLED: "bg-text-faint/30 text-text-muted border-text-faint/30",
};

const ALL_STATUSES: OrderStatus[] = ["NEW", "QUOTED", "IN_PROGRESS", "COMPLETED", "PAID", "CANCELLED"];

export function OrdersTable({
  orders,
  activeStatus,
}: {
  orders: OrderWithItem[];
  activeStatus?: string;
}) {
  const router = useRouter();
  const [updating, setUpdating] = useState<string | null>(null);

  async function updateStatus(id: string, status: OrderStatus) {
    setUpdating(id);
    try {
      await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      toast.success("Status updated");
      router.refresh();
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdating(null);
    }
  }

  return (
    <>
      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Link
          href="/admin/dashboard"
          className={`px-3 py-1.5 rounded text-xs font-body font-medium border transition-colors ${
            !activeStatus
              ? "bg-leather/15 text-leather-light border-leather/30"
              : "border-border text-text-muted hover:text-text"
          }`}
        >
          All
        </Link>
        {ALL_STATUSES.map((s) => (
          <Link
            key={s}
            href={`/admin/dashboard?status=${s}`}
            className={`px-3 py-1.5 rounded text-xs font-body font-medium border transition-colors ${
              activeStatus === s
                ? "bg-leather/15 text-leather-light border-leather/30"
                : "border-border text-text-muted hover:text-text"
            }`}
          >
            {s.replace("_", " ")}
          </Link>
        ))}
      </div>

      {orders.length === 0 ? (
        <div className="py-16 text-center text-text-muted font-body text-sm">No orders found.</div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm font-body">
            <thead>
              <tr className="bg-surface-raised text-text-muted text-xs uppercase tracking-wider">
                <th className="px-4 py-3 text-left font-semibold">Customer</th>
                <th className="px-4 py-3 text-left font-semibold hidden sm:table-cell">Product</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-left font-semibold hidden md:table-cell">Ref</th>
                <th className="px-4 py-3 text-left font-semibold hidden lg:table-cell">Date</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="bg-surface hover:bg-surface-raised transition-colors cursor-pointer"
                  onClick={() => router.push(`/admin/orders/${order.id}`)}
                >
                  <td className="px-4 py-3">
                    <p className="text-text font-medium">{order.customerName}</p>
                    <p className="text-text-faint text-xs">{order.customerEmail}</p>
                  </td>
                  <td className="px-4 py-3 text-text-muted hidden sm:table-cell">
                    {order.productType}
                  </td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={order.status}
                      disabled={updating === order.id}
                      onChange={(e) => updateStatus(order.id, e.target.value as OrderStatus)}
                      className={`text-xs font-body px-2 py-1 rounded border cursor-pointer bg-transparent transition-colors ${STATUS_COLORS[order.status]}`}
                    >
                      {ALL_STATUSES.map((s) => (
                        <option key={s} value={s} className="bg-surface text-text">
                          {s.replace("_", " ")}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    {order.referenceItem?.images[0] && (
                      <Image
                        src={order.referenceItem.images[0]}
                        alt={order.referenceItem.title}
                        width={32}
                        height={32}
                        className="w-8 h-8 object-cover rounded"
                      />
                    )}
                  </td>
                  <td className="px-4 py-3 text-text-faint text-xs hidden lg:table-cell">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-leather hover:text-leather-light text-xs font-medium transition-colors"
                    >
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
