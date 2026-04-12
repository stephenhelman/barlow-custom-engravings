import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const tags = await prisma.tag.findMany({
    include: { _count: { select: { items: true } } },
    orderBy: [{ category: "asc" }, { name: "asc" }],
  });
  return NextResponse.json(tags);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, category } = await req.json();
  if (!name || !category) {
    return NextResponse.json({ error: "name and category required" }, { status: 400 });
  }

  const tag = await prisma.tag.create({ data: { name, category } });
  return NextResponse.json(tag, { status: 201 });
}
