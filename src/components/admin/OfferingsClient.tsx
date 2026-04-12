"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import type { Offering } from "@/types";

type OfferingClient = Omit<Offering, "price"> & {
  price: number;
};

export function OfferingsClient({
  initialOfferings,
}: {
  initialOfferings: OfferingClient[];
}) {
  const [offerings, setOfferings] = useState(initialOfferings);
  const [editingPrice, setEditingPrice] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState("");
  const [newForm, setNewForm] = useState({
    name: "",
    description: "",
    price: "",
    unit: "each",
  });
  const [adding, setAdding] = useState(false);

  async function toggleActive(id: string, active: boolean) {
    try {
      await fetch(`/api/offerings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active }),
      });
      setOfferings((prev) =>
        prev.map((o) => (o.id === id ? { ...o, active } : o)),
      );
      toast.success(active ? "Offering enabled" : "Offering disabled");
    } catch {
      toast.error("Failed to update");
    }
  }

  async function savePrice(id: string) {
    const price = parseFloat(tempPrice);
    if (isNaN(price) || price < 0) {
      toast.error("Invalid price");
      return;
    }
    try {
      await fetch(`/api/offerings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ price }),
      });
      setOfferings((prev) =>
        prev.map((o) =>
          o.id === id
            ? { ...o, price: price as unknown as OfferingClient["price"] }
            : o,
        ),
      );
      setEditingPrice(null);
      toast.success("Price updated");
    } catch {
      toast.error("Failed to update price");
    }
  }

  async function deleteOffering(id: string) {
    try {
      await fetch(`/api/offerings/${id}`, { method: "DELETE" });
      setOfferings((prev) => prev.filter((o) => o.id !== id));
      toast.success("Offering deleted");
    } catch {
      toast.error("Failed to delete");
    }
  }

  async function addOffering() {
    if (!newForm.name.trim()) {
      toast.error("Name is required");
      return;
    }
    setAdding(true);
    try {
      const res = await fetch("/api/offerings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newForm.name.trim(),
          description: newForm.description.trim() || null,
          price: parseFloat(newForm.price) || 0,
          unit: newForm.unit,
          sortOrder: offerings.length,
        }),
      });
      const created = await res.json();
      setOfferings((prev) => [...prev, created]);
      setNewForm({ name: "", description: "", price: "", unit: "each" });
      toast.success("Offering added");
    } catch {
      toast.error("Failed to add offering");
    } finally {
      setAdding(false);
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      {/* Table */}
      <div className="rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm font-body">
          <thead>
            <tr className="bg-surface-raised text-text-muted text-xs uppercase tracking-wider">
              <th className="px-4 py-3 text-left font-semibold">Name</th>
              <th className="px-4 py-3 text-left font-semibold">Price</th>
              <th className="px-4 py-3 text-left font-semibold hidden sm:table-cell">
                Unit
              </th>
              <th className="px-4 py-3 text-center font-semibold">Active</th>
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {offerings.map((o) => (
              <tr
                key={o.id}
                className="bg-surface hover:bg-surface-raised transition-colors"
              >
                <td className="px-4 py-3">
                  <p className="text-text font-medium">{o.name}</p>
                  {o.description && (
                    <p className="text-xs text-text-muted mt-0.5 line-clamp-1">
                      {o.description}
                    </p>
                  )}
                </td>
                <td className="px-4 py-3">
                  {editingPrice === o.id ? (
                    <div className="flex items-center gap-1.5">
                      <span className="text-text-muted">$</span>
                      <input
                        type="number"
                        value={tempPrice}
                        onChange={(e) => setTempPrice(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") savePrice(o.id);
                          if (e.key === "Escape") setEditingPrice(null);
                        }}
                        onBlur={() => savePrice(o.id)}
                        className="w-20 px-2 py-1 rounded bg-bg border border-leather/40 text-text text-sm focus:outline-none"
                        autoFocus
                        step="0.01"
                        min="0"
                      />
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingPrice(o.id);
                        setTempPrice(String(Number(o.price)));
                      }}
                      className="text-leather-light hover:text-leather font-semibold transition-colors"
                    >
                      {Number(o.price) === 0
                        ? "Custom Quote"
                        : `$${Number(o.price).toFixed(2)}`}
                    </button>
                  )}
                </td>
                <td className="px-4 py-3 text-text-muted hidden sm:table-cell">
                  {o.unit}
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => toggleActive(o.id, !o.active)}
                    style={{ transition: "background-color 0.2s" }}
                    className={`relative inline-flex items-center w-9 h-5 rounded-full shrink-0 ${o.active ? "bg-leather" : "bg-border"}`}
                    aria-label={o.active ? "Disable" : "Enable"}
                  >
                    <span
                      style={{
                        transition: "transform 0.2s",
                        transform: o.active
                          ? "translateX(18px)"
                          : "translateX(2px)",
                      }}
                      className="block w-4 h-4 bg-white rounded-full shadow"
                    />
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => deleteOffering(o.id)}
                    className="text-xs text-text-faint hover:text-red-400 font-body transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add new */}
      <div className="border border-border rounded-xl p-5">
        <p className="text-sm font-semibold text-text font-body mb-4">
          Add New Offering
        </p>
        <div className="flex flex-col gap-3">
          <Input
            label="Name *"
            id="oname"
            value={newForm.name}
            onChange={(e) =>
              setNewForm((f) => ({ ...f, name: e.target.value }))
            }
            placeholder="Custom Bifold Wallet"
          />
          <Textarea
            label="Description"
            id="odesc"
            value={newForm.description}
            onChange={(e) =>
              setNewForm((f) => ({ ...f, description: e.target.value }))
            }
            placeholder="Short product description..."
            rows={2}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Price ($)"
              id="oprice"
              type="number"
              min="0"
              step="0.01"
              value={newForm.price}
              onChange={(e) =>
                setNewForm((f) => ({ ...f, price: e.target.value }))
              }
              placeholder="0.00"
            />
            <Input
              label="Unit"
              id="ounit"
              value={newForm.unit}
              onChange={(e) =>
                setNewForm((f) => ({ ...f, unit: e.target.value }))
              }
              placeholder="each"
            />
          </div>
          <Button size="sm" onClick={addOffering} disabled={adding}>
            {adding ? "Adding..." : "Add Offering"}
          </Button>
        </div>
      </div>
    </div>
  );
}
