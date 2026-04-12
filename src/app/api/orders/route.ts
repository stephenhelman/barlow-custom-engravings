import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { resend } from "@/lib/resend";
import { render } from "@react-email/components";
import { OrderConfirmation } from "@/emails/OrderConfirmation";
import { AdminNotification } from "@/emails/AdminNotification";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = req.nextUrl;
  const status = searchParams.get("status");

  const orders = await prisma.order.findMany({
    where: status ? { status: status as never } : undefined,
    include: { referenceItem: { include: { tags: { include: { tag: true } } } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(orders);
}

export async function POST(req: Request) {
  const body = await req.json();

  const {
    customerName,
    customerEmail,
    customerPhone,
    productType,
    engravingText,
    description,
    referenceItemId,
    referenceImages = [],
  } = body;

  if (!customerName || !customerEmail || !productType || !description) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const order = await prisma.order.create({
    data: {
      customerName,
      customerEmail,
      customerPhone: customerPhone ?? null,
      productType,
      engravingText: engravingText ?? null,
      description,
      referenceItemId: referenceItemId ?? null,
      referenceImages,
    },
    include: { referenceItem: { include: { tags: { include: { tag: true } } } } },
  });

  const firstName = customerName.split(" ")[0];
  const refImage = order.referenceItem?.images[0];

  // Send customer confirmation email
  try {
    const html = await render(
      OrderConfirmation({
        customerName,
        firstName,
        productType,
        engravingText,
        description,
        referenceItemTitle: order.referenceItem?.title,
        referenceItemImage: refImage,
        referenceImages,
      })
    );
    await resend.emails.send({
      from: process.env.RESEND_FROM_ORDERS!,
      to: customerEmail,
      subject: `We got your order request, ${firstName}!`,
      html,
    });
  } catch (err) {
    console.error("Customer email failed:", err);
  }

  // Send admin notification email
  try {
    const html = await render(
      AdminNotification({
        customerName,
        customerEmail,
        customerPhone,
        productType,
        engravingText,
        description,
        orderId: order.id,
        referenceItemTitle: order.referenceItem?.title,
        referenceItemImage: refImage,
        referenceItemId: referenceItemId,
        referenceImages,
      })
    );
    await resend.emails.send({
      from: process.env.RESEND_FROM_ORDERS!,
      to: process.env.RESEND_TO_EMAIL!,
      subject: `New Order Request — ${productType} from ${customerName}`,
      html,
    });
  } catch (err) {
    console.error("Admin email failed:", err);
  }

  return NextResponse.json(order, { status: 201 });
}
