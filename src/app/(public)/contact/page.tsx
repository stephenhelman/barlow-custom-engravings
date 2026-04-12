import { ContactForm } from "@/components/public/ContactForm";

export const metadata = {
  title: "Contact — Barlow Custom Engravings",
  description: "Get in touch with Barlow Custom Engravings. Questions, custom requests, or just want to say hi.",
};

export default function ContactPage() {
  const phone = process.env.NEXT_PUBLIC_PHONE;
  const email = process.env.NEXT_PUBLIC_EMAIL;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10">
        <span className="text-leather font-body text-xs uppercase tracking-widest font-semibold">
          Get in Touch
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-text mt-2 mb-3">
          Contact Us
        </h1>
        <p className="text-text-muted font-body leading-relaxed max-w-md">
          Questions about a piece, a custom order idea, or anything else — we&apos;d
          love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
        {/* Form */}
        <div className="md:col-span-3">
          <ContactForm />
        </div>

        {/* Contact info */}
        <div className="md:col-span-2 flex flex-col gap-6">
          <div className="bg-surface border border-border rounded-xl p-5 flex flex-col gap-4">
            <h2 className="font-display text-base font-semibold text-text">Reach Us Directly</h2>

            {phone && (
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-text-faint font-body uppercase tracking-wider">Phone</span>
                <a
                  href={`tel:${phone}`}
                  className="text-sm text-text font-body hover:text-leather-light transition-colors"
                >
                  {phone}
                </a>
              </div>
            )}

            {email && (
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-text-faint font-body uppercase tracking-wider">Email</span>
                <a
                  href={`mailto:${email}`}
                  className="text-sm text-text font-body hover:text-leather-light transition-colors"
                >
                  {email}
                </a>
              </div>
            )}

            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-text-faint font-body uppercase tracking-wider">Location</span>
              <p className="text-sm text-text-muted font-body">El Paso, TX</p>
              <p className="text-xs text-text-faint font-body">Found at the Swap Meet</p>
            </div>
          </div>

          <div className="bg-surface border border-border rounded-xl p-5">
            <h2 className="font-display text-base font-semibold text-text mb-2">Response Time</h2>
            <p className="text-sm text-text-muted font-body leading-relaxed">
              We typically reply within 24 hours. For urgent questions, a phone call is the fastest way to reach us.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
