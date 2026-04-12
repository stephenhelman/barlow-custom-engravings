import { prisma } from "@/lib/prisma";
import { TagsClient } from "@/components/admin/TagsClient";

export const metadata = { title: "Tags — Admin" };

export default async function TagsPage() {
  const tags = await prisma.tag.findMany({
    include: { _count: { select: { items: true } } },
    orderBy: [{ category: "asc" }, { name: "asc" }],
  });
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-text mb-6">Tags</h1>
      <TagsClient initialTags={tags} />
    </div>
  );
}
