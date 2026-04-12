"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";

interface FormState {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const INITIAL: FormState = {
  name: "", email: "", phone: "", subject: "", message: "",
};

export function ContactForm() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  function set(key: keyof FormState, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setSuccess(true);
    } catch {
      toast.error("Something went wrong. Please try again or call us directly.");
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center gap-5 py-12 text-center">
        <div className="w-14 h-14 rounded-full bg-leather/20 flex items-center justify-center">
          <svg className="w-7 h-7 text-leather" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <h2 className="font-display text-xl font-semibold text-text mb-2">Message Sent!</h2>
          <p className="text-text-muted font-body text-sm">
            Thanks for reaching out. We&apos;ll get back to you within 24 hours. Check your email for a confirmation.
          </p>
        </div>
        <Button variant="secondary" size="sm" onClick={() => { setForm(INITIAL); setSuccess(false); }}>
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input
          label="Name *"
          id="name"
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          placeholder="Jane Doe"
          required
        />
        <Input
          label="Phone (optional)"
          id="phone"
          type="tel"
          value={form.phone}
          onChange={(e) => set("phone", e.target.value)}
          placeholder="915-000-0000"
        />
      </div>
      <Input
        label="Email *"
        id="email"
        type="email"
        value={form.email}
        onChange={(e) => set("email", e.target.value)}
        placeholder="jane@example.com"
        required
      />
      <Input
        label="Subject *"
        id="subject"
        value={form.subject}
        onChange={(e) => set("subject", e.target.value)}
        placeholder="Question about a custom order..."
        required
      />
      <Textarea
        label="Message *"
        id="message"
        value={form.message}
        onChange={(e) => set("message", e.target.value)}
        placeholder="Tell us what's on your mind..."
        rows={5}
        required
      />
      <Button type="submit" size="lg" disabled={submitting} className="w-full">
        {submitting ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
