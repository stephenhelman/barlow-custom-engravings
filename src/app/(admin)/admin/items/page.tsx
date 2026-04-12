import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { DeleteItemButton } from "@/components/admin/DeleteItemButton";
import { Badge } from "@/components/ui/Badge";

export const metadata = { title: "Items — Admin" };

export default async function ItemsPage() {
  const items = await prisma.item.findMany({
    include: { tags: { include: { tag: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-semibold text-text">Items</h1>
        <Link
          href="/admin/items/new"
          className="inline-flex items-center gap-1.5 bg-leather hover:bg-leather-light text-bg font-body font-semibold text-sm px-4 py-2 rounded transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          Add Item
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="py-16 text-center text-text-muted font-body text-sm">
          No items yet.{" "}
          <Link href="/admin/items/new" className="text-leather hover:text-leather-light">
            Add one →
          </Link>
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm font-body">
            <thead>
              <tr className="bg-surface-raised text-text-muted text-xs uppercase tracking-wider">
                <th className="px-4 py-3 text-left font-semibold">Item</th>
                <th className="px-4 py-3 text-left font-semibold hidden sm:table-cell">Type</th>
                <th className="px-4 py-3 text-left font-semibold hidden md:table-cell">Status</th>
                <th className="px-4 py-3 text-left font-semibold hidden lg:table-cell">Tags</th>
                <th className="px-4 py-3 text-left font-semibold hidden lg:table-cell">Price</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.map((item) => (
                <tr key={item.id} className="bg-surface hover:bg-surface-raised transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {item.images[0] ? (
                        <Image
                          src={item.images[0]}
                          alt={item.title}
                          width={40}
                          height={40}
                          className="w-10 h-10 object-cover rounded border border-border shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded border border-border bg-surface-raised shrink-0" />
                      )}
                      <span className="text-text font-medium line-clamp-2">{item.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-text-muted hidden sm:table-cell">
                    {item.contentType.replace("_", " ")}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <Badge
                      variant={item.status === "FOR_SALE" ? "for-sale" : "sold"}
                      label={item.status === "FOR_SALE" ? "For Sale" : "Sold"}
                    />
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {item.tags.slice(0, 3).map(({ tag }) => (
                        <span key={tag.id} className="text-xs px-1.5 py-0.5 rounded bg-surface-raised text-text-muted">
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-text-muted hidden lg:table-cell">
                    {item.price ? `$${Number(item.price).toFixed(2)}` : "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/items/${item.id}/edit`}
                        className="text-leather hover:text-leather-light text-xs font-medium transition-colors"
                      >
                        Edit
                      </Link>
                      <DeleteItemButton id={item.id} title={item.title} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
