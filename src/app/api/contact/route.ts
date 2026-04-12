import { NextResponse } from "next/server";
import { resend } from "@/lib/resend";
import { render } from "@react-email/components";
import { ContactConfirmation } from "@/emails/ContactConfirmation";
import { ContactNotification } from "@/emails/ContactNotification";

export async function POST(req: Request) {
  const body = await req.json();
  const { name, email, phone, subject, message } = body;

  if (!name || !email || !subject || !message) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const firstName = name.split(" ")[0];

  // Confirmation to customer
  try {
    const html = await render(
      ContactConfirmation({ firstName, name, subject, message })
    );
    await resend.emails.send({
      from: process.env.RESEND_FROM_CONTACT!,
      to: email,
      subject: `Thanks for reaching out, ${firstName}!`,
      html,
    });
  } catch (err) {
    console.error("Contact confirmation email failed:", err);
  }

  // Notification to Michelle
  try {
    const html = await render(
      ContactNotification({ name, email, phone, subject, message })
    );
    await resend.emails.send({
      from: process.env.RESEND_FROM_CONTACT!,
      to: process.env.RESEND_TO_EMAIL!,
      replyTo: email,
      subject: `New contact message from ${name} — ${subject}`,
      html,
    });
  } catch (err) {
    console.error("Contact notification email failed:", err);
  }

  return NextResponse.json({ ok: true });
}
