"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import type { Offering } from "@/types";

// price is serialized to number before crossing the server→client boundary
type SerializedOffering = Omit<Offering, "price"> & { price: number };
import type { ItemWithTags } from "@/types";

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  productType: string;
  engravingText: string;
  description: string;
  referenceImages: File[];
}

const INITIAL: FormState = {
  firstName: "", lastName: "", email: "", phone: "",
  productType: "", engravingText: "", description: "", referenceImages: [],
};

export function OrderPageForm({ offerings }: { offerings: SerializedOffering[] }) {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [previews, setPreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [galleryItems, setGalleryItems] = useState<ItemWithTags[]>([]);
  const [refItem, setRefItem] = useState<ItemWithTags | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function set(key: keyof FormState, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleFiles(files: FileList | null) {
    if (!files) return;
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    const valid: File[] = [];
    for (const f of Array.from(files)) {
      if (!allowed.includes(f.type)) { toast.error(`${f.name}: only JPG, PNG, WebP`); continue; }
      if (f.size > 10 * 1024 * 1024) { toast.error(`${f.name}: max 10MB`); continue; }
      valid.push(f);
    }
    setForm((f) => ({ ...f, referenceImages: [...f.referenceImages, ...valid] }));
    valid.forEach((file) => setPreviews((p) => [...p, URL.createObjectURL(file)]));
  }

  function removeImg(i: number) {
    setForm((f) => ({ ...f, referenceImages: f.referenceImages.filter((_, j) => j !== i) }));
    setPreviews((p) => { URL.revokeObjectURL(p[i]); return p.filter((_, j) => j !== i); });
  }

  async function loadGallery() {
    setShowPicker(true);
    if (galleryItems.length) return;
    const data = await fetch("/api/items?include=all").then((r) => r.json()).catch(() => []);
    setGalleryItems(data);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.firstName || !form.email || !form.description || !form.productType) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setSubmitting(true);
    try {
      const uploadedUrls: string[] = [];
      for (const file of form.referenceImages) {
        const { url, publicUrl } = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ filename: file.name, contentType: file.type, folder: "orders" }),
        }).then((r) => r.json());
        await fetch(url, { method: "PUT", body: file, headers: { "Content-Type": file.type } });
        uploadedUrls.push(publicUrl);
      }
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: `${form.firstName} ${form.lastName}`.trim(),
          customerEmail: form.email,
          customerPhone: form.phone || undefined,
          productType: form.productType,
          engravingText: form.engravingText || undefined,
          description: form.description,
          referenceItemId: refItem?.id,
          referenceImages: uploadedUrls,
        }),
      });
      if (!res.ok) throw new Error();
      setSuccess(true);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center gap-5 py-12 text-center">
        <div className="w-16 h-16 rounded-full bg-leather/20 flex items-center justify-center">
          <svg className="w-8 h-8 text-leather" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <h2 className="font-display text-2xl font-semibold text-text mb-2">Order Received!</h2>
          <p className="text-text-muted font-body">
            Michelle will reach out within 24 hours. Check your email for a confirmation.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-3">
        <Input label="First Name *" id="fn" value={form.firstName} onChange={(e) => set("firstName", e.target.value)} placeholder="Jane" required />
        <Input label="Last Name" id="ln" value={form.lastName} onChange={(e) => set("lastName", e.target.value)} placeholder="Doe" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input label="Email *" id="em" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="jane@example.com" required />
        <Input label="Phone (optional)" id="ph" type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="915-000-0000" />
      </div>
      <Select label="Product Type *" id="pt" value={form.productType} onChange={(e) => set("productType", e.target.value)} required>
        <option value="">Select a product...</option>
        {offerings.map((o) => (
          <option key={o.id} value={o.name}>
            {o.name}{Number(o.price) > 0 ? ` — $${Number(o.price).toFixed(2)}` : " — Custom Quote"}
          </option>
        ))}
        <option value="Other">Other / Not Sure</option>
      </Select>
      <Input label="Engraving Text / Name (optional)" id="et" value={form.engravingText} onChange={(e) => set("engravingText", e.target.value)} placeholder="Text to engrave..." />
      <Textarea label="Description *" id="desc" value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Describe the design, theme, style, or anything you have in mind..." rows={5} required />

      {/* Reference section */}
      <div className="border border-border rounded-xl p-4 flex flex-col gap-4">
        <p className="font-body text-sm font-semibold text-text">Reference (optional)</p>
        {refItem ? (
          <div className="flex items-center gap-3 bg-surface-raised rounded-lg p-2.5">
            {refItem.images[0] && <Image src={refItem.images[0]} alt={refItem.title} width={48} height={48} className="w-12 h-12 object-cover rounded" />}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-body text-text truncate">{refItem.title}</p>
              <p className="text-xs text-text-muted font-body">Gallery reference</p>
            </div>
            <button type="button" onClick={() => setRefItem(null)} className="text-text-muted hover:text-text p-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        ) : (
          <Button type="button" variant="secondary" size="sm" onClick={loadGallery}>Choose from gallery</Button>
        )}
        <div>
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
          <Button type="button" variant="ghost" size="sm" onClick={() => fileRef.current?.click()}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
            Upload inspiration images
          </Button>
          {previews.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {previews.map((src, i) => (
                <div key={i} className="relative">
                  <Image src={src} alt="" width={64} height={64} className="w-16 h-16 object-cover rounded border border-border" />
                  <button type="button" onClick={() => removeImg(i)} className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-bg border border-border rounded-full flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Button type="submit" size="lg" disabled={submitting} className="w-full">
        {submitting ? "Submitting..." : "Send Order Request"}
      </Button>

      {/* Gallery picker */}
      {showPicker && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-8 bg-bg/80 backdrop-blur-sm" onClick={() => setShowPicker(false)}>
          <div className="w-full sm:max-w-xl bg-surface-raised border border-border rounded-t-2xl sm:rounded-xl shadow-2xl max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <p className="font-body text-sm font-semibold text-text">Choose from Gallery</p>
              <button onClick={() => setShowPicker(false)} className="text-text-muted hover:text-text p-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="overflow-y-auto p-3 grid grid-cols-3 sm:grid-cols-4 gap-2">
              {galleryItems.length === 0 ? (
                <p className="col-span-full text-center text-text-muted text-sm font-body py-8">Loading…</p>
              ) : (
                galleryItems.map((item) => (
                  <button key={item.id} type="button" onClick={() => { setRefItem(item); setShowPicker(false); }}
                    className="aspect-square rounded overflow-hidden border border-border hover:border-border-hover transition-colors relative group">
                    {item.images[0] ? <Image src={item.images[0]} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform" /> : <div className="w-full h-full bg-surface" />}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
