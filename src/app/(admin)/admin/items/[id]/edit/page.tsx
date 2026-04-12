import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ItemForm } from "@/components/admin/ItemForm";
import type { ItemWithTags } from "@/types";

export const metadata = { title: "Edit Item — Admin" };

export default async function EditItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [item, tags] = await Promise.all([
    prisma.item.findUnique({
      where: { id },
      include: { tags: { include: { tag: true } } },
    }),
    prisma.tag.findMany({ orderBy: [{ category: "asc" }, { name: "asc" }] }),
  ]);

  if (!item) notFound();

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/items" className="text-text-muted hover:text-text text-sm font-body transition-colors">
          ← Items
        </Link>
        <span className="text-text-faint">/</span>
        <span className="text-text-muted text-sm font-body truncate">{item.title}</span>
      </div>
      <h1 className="font-display text-2xl font-semibold text-text mb-6">Edit Item</h1>
      <ItemForm tags={tags} item={item as ItemWithTags} mode="edit" />
    </div>
  );
}
