import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ItemForm } from "@/components/admin/ItemForm";

export const metadata = { title: "New Item — Admin" };

export default async function NewItemPage() {
  const tags = await prisma.tag.findMany({ orderBy: [{ category: "asc" }, { name: "asc" }] });

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/items" className="text-text-muted hover:text-text text-sm font-body transition-colors">
          ← Items
        </Link>
        <span className="text-text-faint">/</span>
        <span className="text-text-muted text-sm font-body">New Item</span>
      </div>
      <h1 className="font-display text-2xl font-semibold text-text mb-6">Add New Item</h1>
      <ItemForm tags={tags} mode="new" />
    </div>
  );
}
