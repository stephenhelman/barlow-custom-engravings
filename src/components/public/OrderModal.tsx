"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useOrderModal } from "@/store/useOrderModal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { toast } from "sonner";
import type { Offering } from "@/types";
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

const INITIAL_FORM: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  productType: "",
  engravingText: "",
  description: "",
  referenceImages: [],
};

export function OrderModal() {
  const { isOpen, prefillItem, close } = useOrderModal();
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [offerings, setOfferings] = useState<Offering[]>([]);
  const [referenceItem, setReferenceItem] = useState<ItemWithTags | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showGalleryPicker, setShowGalleryPicker] = useState(false);
  const [galleryItems, setGalleryItems] = useState<ItemWithTags[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Load offerings on mount
  useEffect(() => {
    fetch("/api/offerings")
      .then((r) => r.json())
      .then((data) => setOfferings(data))
      .catch(() => {});
  }, []);

  // Prefill reference item
  useEffect(() => {
    if (prefillItem) {
      setReferenceItem(prefillItem);
      setForm((f) => ({ ...f, productType: "" }));
    }
  }, [prefillItem]);

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setForm(INITIAL_FORM);
        setReferenceItem(null);
        setImagePreviews([]);
        setSuccess(false);
        setShowGalleryPicker(false);
      }, 200);
    }
  }, [isOpen]);

  // Trap focus / close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [isOpen, close]);

  function handleField(key: keyof FormState, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleFiles(files: FileList | null) {
    if (!files) return;
    const valid: File[] = [];
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    for (const f of Array.from(files)) {
      if (!allowed.includes(f.type)) {
        toast.error(`${f.name}: only JPG, PNG, WebP allowed`);
        continue;
      }
      if (f.size > 10 * 1024 * 1024) {
        toast.error(`${f.name}: max 10MB`);
        continue;
      }
      valid.push(f);
    }
    setForm((f) => ({ ...f, referenceImages: [...f.referenceImages, ...valid] }));
    valid.forEach((file) => {
      const url = URL.createObjectURL(file);
      setImagePreviews((p) => [...p, url]);
    });
  }

  function removeImage(idx: number) {
    setForm((f) => ({
      ...f,
      referenceImages: f.referenceImages.filter((_, i) => i !== idx),
    }));
    setImagePreviews((p) => {
      URL.revokeObjectURL(p[idx]);
      return p.filter((_, i) => i !== idx);
    });
  }

  async function loadGallery() {
    setShowGalleryPicker(true);
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
      // Upload reference images first
      const uploadedUrls: string[] = [];
      for (const file of form.referenceImages) {
        const presign = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ filename: file.name, contentType: file.type, folder: "orders" }),
        }).then((r) => r.json());

        await fetch(presign.url, { method: "PUT", body: file, headers: { "Content-Type": file.type } });
        uploadedUrls.push(presign.publicUrl);
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
          referenceItemId: referenceItem?.id || undefined,
          referenceImages: uploadedUrls,
        }),
      });

      if (!res.ok) throw new Error("Order failed");
      setSuccess(true);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Custom order form"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-bg/80 backdrop-blur-sm"
        onClick={close}
      />

      {/* Panel */}
      <div
        ref={dialogRef}
        className="relative w-full sm:max-w-2xl bg-surface border border-border rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <h2 className="font-display text-lg font-semibold text-text">
            {success ? "Order Received!" : "Custom Order Request"}
          </h2>
          <button
            onClick={close}
            className="text-text-muted hover:text-text transition-colors p-1"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-5 py-5">
          {success ? (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <div className="w-14 h-14 rounded-full bg-leather/20 flex items-center justify-center">
                <svg className="w-7 h-7 text-leather" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="font-display text-lg font-semibold text-text mb-1">We got your request!</p>
                <p className="text-sm text-text-muted font-body">
                  Michelle will reach out within 24 hours to confirm details and pricing. Check your email for a confirmation.
                </p>
              </div>
              <Button onClick={close} variant="secondary" className="mt-2">
                Close
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Name */}
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="First Name *"
                  id="firstName"
                  value={form.firstName}
                  onChange={(e) => handleField("firstName", e.target.value)}
                  placeholder="Jane"
                  required
                />
                <Input
                  label="Last Name"
                  id="lastName"
                  value={form.lastName}
                  onChange={(e) => handleField("lastName", e.target.value)}
                  placeholder="Doe"
                />
              </div>

              {/* Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Email *"
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => handleField("email", e.target.value)}
                  placeholder="jane@example.com"
                  required
                />
                <Input
                  label="Phone (optional)"
                  id="phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => handleField("phone", e.target.value)}
                  placeholder="915-000-0000"
                />
              </div>

              {/* Product Type */}
              <Select
                label="Product Type *"
                id="productType"
                value={form.productType}
                onChange={(e) => handleField("productType", e.target.value)}
                required
              >
                <option value="">Select a product...</option>
                {offerings.map((o) => (
                  <option key={o.id} value={o.name}>
                    {o.name}
                    {Number(o.price) > 0 ? ` — $${Number(o.price).toFixed(2)}` : " — Custom Quote"}
                  </option>
                ))}
                <option value="Other">Other / Not Sure</option>
              </Select>

              {/* Engraving */}
              <Input
                label="Engraving Text / Name (optional)"
                id="engravingText"
                value={form.engravingText}
                onChange={(e) => handleField("engravingText", e.target.value)}
                placeholder="Name, saying, or text to engrave..."
              />

              {/* Description */}
              <Textarea
                label="Description *"
                id="description"
                value={form.description}
                onChange={(e) => handleField("description", e.target.value)}
                placeholder="Describe what you're looking for — design, theme, style, any details..."
                rows={4}
                required
              />

              {/* Reference section */}
              <div className="border border-border rounded-lg p-4 flex flex-col gap-3">
                <p className="text-sm font-semibold text-text font-body">
                  Reference (optional)
                </p>

                {/* Gallery reference item */}
                {referenceItem ? (
                  <div className="flex items-center gap-3 bg-surface-raised rounded p-2">
                    {referenceItem.images[0] && (
                      <Image
                        src={referenceItem.images[0]}
                        alt={referenceItem.title}
                        width={48}
                        height={48}
                        className="w-12 h-12 object-cover rounded"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-body text-text truncate">{referenceItem.title}</p>
                      <p className="text-xs text-text-muted font-body">Gallery reference</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setReferenceItem(null)}
                      className="text-text-muted hover:text-text transition-colors"
                      aria-label="Remove reference"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={loadGallery}
                  >
                    Choose from gallery
                  </Button>
                )}

                {/* Upload inspiration images */}
                <div>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    className="hidden"
                    onChange={(e) => handleFiles(e.target.files)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => fileRef.current?.click()}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Upload inspiration images
                  </Button>

                  {imagePreviews.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {imagePreviews.map((src, i) => (
                        <div key={i} className="relative group/img">
                          <Image
                            src={src}
                            alt={`Upload ${i + 1}`}
                            width={64}
                            height={64}
                            className="w-16 h-16 object-cover rounded border border-border"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(i)}
                            className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-bg border border-border rounded-full flex items-center justify-center text-text-muted hover:text-text"
                            aria-label="Remove image"
                          >
                            <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Submit */}
              <Button type="submit" size="lg" disabled={submitting} className="w-full mt-1">
                {submitting ? "Submitting..." : "Send Order Request"}
              </Button>
            </form>
          )}
        </div>
      </div>

      {/* Gallery Picker Sub-modal */}
      {showGalleryPicker && (
        <div
          className="absolute inset-0 z-10 flex items-end sm:items-center justify-center p-0 sm:p-8 bg-bg/60 backdrop-blur-sm"
          onClick={() => setShowGalleryPicker(false)}
        >
          <div
            className="w-full sm:max-w-xl bg-surface-raised border border-border rounded-t-2xl sm:rounded-xl shadow-2xl max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
              <p className="font-body text-sm font-semibold text-text">Choose from Gallery</p>
              <button
                onClick={() => setShowGalleryPicker(false)}
                className="text-text-muted hover:text-text p-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="overflow-y-auto p-3 grid grid-cols-3 sm:grid-cols-4 gap-2">
              {galleryItems.length === 0 ? (
                <p className="col-span-full text-center text-text-muted text-sm font-body py-8">Loading…</p>
              ) : (
                galleryItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setReferenceItem(item);
                      setShowGalleryPicker(false);
                    }}
                    className="aspect-square rounded overflow-hidden border border-border hover:border-border-hover transition-colors relative group/gp"
                  >
                    {item.images[0] ? (
                      <Image
                        src={item.images[0]}
                        alt={item.title}
                        fill
                        className="object-cover group-hover/gp:scale-[1.05] transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full bg-surface-raised" />
                    )}
                    <div className="absolute inset-x-0 bottom-0 bg-bg/80 px-1.5 py-1 opacity-0 group-hover/gp:opacity-100 transition-opacity">
                      <p className="text-xs text-text font-body truncate">{item.title}</p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
