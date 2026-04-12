import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const include = searchParams.get("include"); // "all" = no filter
  const status = searchParams.get("status");
  const contentType = searchParams.get("contentType");
  const tagIds = searchParams.getAll("tagId");

  const where: Record<string, unknown> = {};

  if (include !== "all") {
    // Default public: FOR_SALE + PHYSICAL_ITEM
    where.status = status || "FOR_SALE";
    where.contentType = contentType || "PHYSICAL_ITEM";
  } else {
    if (status) where.status = status;
    if (contentType) where.contentType = contentType;
  }

  if (tagIds.length) {
    where.tags = { some: { tagId: { in: tagIds } } };
  }

  const items = await prisma.item.findMany({
    where,
    include: { tags: { include: { tag: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const item = await prisma.item.create({
    data: {
      title: body.title,
      description: body.description ?? null,
      status: body.status ?? "FOR_SALE",
      contentType: body.contentType ?? "PHYSICAL_ITEM",
      price: body.price ?? null,
      images: body.images ?? [],
      tags: body.tagIds?.length
        ? { create: body.tagIds.map((tagId: string) => ({ tagId })) }
        : undefined,
    },
    include: { tags: { include: { tag: true } } },
  });
  return NextResponse.json(item, { status: 201 });
}
