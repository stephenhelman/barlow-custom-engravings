"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
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

export function OrderDetailClient({ order }: { order: OrderWithItem }) {
  const router = useRouter();
  const [status, setStatus] = useState<OrderStatus>(order.status as OrderStatus);
  const [notes, setNotes] = useState(order.adminNotes ?? "");
  const [savingNotes, setSavingNotes] = useState(false);

  async function updateStatus(newStatus: OrderStatus) {
    setStatus(newStatus);
    try {
      await fetch(`/api/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      toast.success("Status updated");
      router.refresh();
    } catch {
      toast.error("Failed to update status");
    }
  }

  async function saveNotes() {
    setSavingNotes(true);
    try {
      await fetch(`/api/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminNotes: notes }),
      });
      toast.success("Notes saved");
    } catch {
      toast.error("Failed to save notes");
    } finally {
      setSavingNotes(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header card */}
      <div className="bg-surface border border-border rounded-xl p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-xl font-semibold text-text mb-1">{order.customerName}</h1>
          <a href={`mailto:${order.customerEmail}`} className="text-leather hover:text-leather-light text-sm font-body transition-colors">
            {order.customerEmail}
          </a>
          {order.customerPhone && (
            <p className="text-text-muted text-sm font-body mt-0.5">
              <a href={`tel:${order.customerPhone}`} className="hover:text-text transition-colors">{order.customerPhone}</a>
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 items-start sm:items-end shrink-0">
          <select
            value={status}
            onChange={(e) => updateStatus(e.target.value as OrderStatus)}
            className={`text-xs font-body px-3 py-1.5 rounded border cursor-pointer bg-transparent ${STATUS_COLORS[status]}`}
          >
            {ALL_STATUSES.map((s) => (
              <option key={s} value={s} className="bg-surface text-text">{s.replace("_", " ")}</option>
            ))}
          </select>
          <p className="text-text-faint text-xs font-body">{new Date(order.createdAt).toLocaleString()}</p>
        </div>
      </div>

      {/* Order details */}
      <div className="bg-surface border border-border rounded-xl p-5">
        <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider font-body mb-4">Order Details</h2>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
          <Field label="Product Type" value={order.productType} />
          {order.engravingText && <Field label="Engraving Text" value={order.engravingText} />}
          <div className="sm:col-span-2">
            <dt className="text-xs text-text-muted font-body uppercase tracking-wide mb-1">Description</dt>
            <dd className="text-sm text-text font-body whitespace-pre-wrap">{order.description}</dd>
          </div>
          <Field label="Order ID" value={order.id} mono />
        </dl>
      </div>

      {/* Reference item */}
      {order.referenceItem && (
        <div className="bg-surface border border-border rounded-xl p-5">
          <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider font-body mb-4">Reference Item</h2>
          <div className="flex items-center gap-4">
            {order.referenceItem.images[0] && (
              <Image
                src={order.referenceItem.images[0]}
                alt={order.referenceItem.title}
                width={72}
                height={72}
                className="w-18 h-18 object-cover rounded-lg border border-border"
              />
            )}
            <div>
              <p className="text-text font-body font-medium">{order.referenceItem.title}</p>
              <Link
                href={`/admin/items/${order.referenceItem.id}/edit`}
                className="text-leather hover:text-leather-light text-xs font-body transition-colors"
              >
                Edit item →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Reference images */}
      {order.referenceImages.length > 0 && (
        <div className="bg-surface border border-border rounded-xl p-5">
          <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider font-body mb-4">
            Customer Inspiration Images
          </h2>
          <div className="flex flex-wrap gap-3">
            {order.referenceImages.map((src, i) => (
              <a key={i} href={src} target="_blank" rel="noopener noreferrer">
                <Image
                  src={src}
                  alt={`Reference ${i + 1}`}
                  width={96}
                  height={96}
                  className="w-24 h-24 object-cover rounded-lg border border-border hover:border-border-hover transition-colors"
                />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Admin notes */}
      <div className="bg-surface border border-border rounded-xl p-5">
        <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider font-body mb-4">Admin Notes</h2>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Private notes visible only to admin..."
          rows={4}
          onBlur={saveNotes}
        />
        <div className="mt-3 flex justify-end">
          <Button size="sm" variant="secondary" onClick={saveNotes} disabled={savingNotes}>
            {savingNotes ? "Saving..." : "Save Notes"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <dt className="text-xs text-text-muted font-body uppercase tracking-wide mb-0.5">{label}</dt>
      <dd className={`text-sm text-text ${mono ? "font-mono text-xs text-text-muted" : "font-body"}`}>{value}</dd>
    </div>
  );
}
