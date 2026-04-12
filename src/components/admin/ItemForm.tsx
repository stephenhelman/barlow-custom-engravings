"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import type { Tag, ItemWithTags } from "@/types";

interface ItemFormProps {
  tags: Tag[];
  item?: ItemWithTags;
  mode: "new" | "edit";
}

export function ItemForm({ tags, item, mode }: ItemFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(item?.title ?? "");
  const [description, setDescription] = useState(item?.description ?? "");
  const [contentType, setContentType] = useState(item?.contentType ?? "PHYSICAL_ITEM");
  const [status, setStatus] = useState(item?.status ?? "FOR_SALE");
  const [price, setPrice] = useState(item?.price ? String(item.price) : "");
  const [selectedTagIds, setSelectedTagIds] = useState<Set<string>>(
    new Set(item?.tags.map((t) => t.tagId) ?? [])
  );
  const [images, setImages] = useState<string[]>(item?.images ?? []);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const typeTags = tags.filter((t) => t.category === "TYPE");
  const themeTags = tags.filter((t) => t.category === "THEME");

  function toggleTag(id: string) {
    setSelectedTagIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  async function uploadFiles(files: FileList | null) {
    if (!files || !files.length) return;
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        if (!allowed.includes(file.type)) { toast.error(`${file.name}: only JPG, PNG, WebP`); continue; }
        if (file.size > 10 * 1024 * 1024) { toast.error(`${file.name}: max 10MB`); continue; }

        const { url, publicUrl } = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ filename: file.name, contentType: file.type, folder: "items" }),
        }).then((r) => r.json());

        await fetch(url, { method: "PUT", body: file, headers: { "Content-Type": file.type } });
        setImages((prev) => [...prev, publicUrl]);
      }
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function moveImage(idx: number, dir: -1 | 1) {
    const newImages = [...images];
    const target = idx + dir;
    if (target < 0 || target >= newImages.length) return;
    [newImages[idx], newImages[target]] = [newImages[target], newImages[idx]];
    setImages(newImages);
  }

  function removeImage(idx: number) {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    uploadFiles(e.dataTransfer.files);
  }, []);

  async function handleSave() {
    if (!title.trim()) { toast.error("Title is required"); return; }
    setSaving(true);
    try {
      const body = {
        title: title.trim(),
        description: description.trim() || null,
        contentType,
        status: contentType === "PHYSICAL_ITEM" ? status : "FOR_SALE",
        price: contentType === "PHYSICAL_ITEM" && status === "FOR_SALE" && price ? Number(price) : null,
        images,
        tagIds: Array.from(selectedTagIds),
      };

      const url = mode === "new" ? "/api/items" : `/api/items/${item!.id}`;
      const method = mode === "new" ? "POST" : "PATCH";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error();
      toast.success(mode === "new" ? "Item created" : "Item saved");
      router.push("/admin/items");
      router.refresh();
    } catch {
      toast.error("Failed to save item");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      {/* Images */}
      <div>
        <p className="text-sm font-semibold text-text-muted font-body uppercase tracking-wider mb-3">Images</p>
        <div
          className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer ${
            dragOver ? "border-leather/60 bg-leather/5" : "border-border hover:border-border-hover"
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
        >
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="hidden"
            onChange={(e) => uploadFiles(e.target.files)}
          />
          <svg className="w-8 h-8 text-text-faint mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          <p className="text-sm text-text-muted font-body">
            {uploading ? "Uploading..." : "Drop images or click to upload"}
          </p>
          <p className="text-xs text-text-faint font-body mt-1">JPG, PNG, WebP · max 10MB each</p>
        </div>

        {images.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {images.map((src, i) => (
              <div key={src} className="relative group">
                <Image src={src} alt={`Image ${i + 1}`} width={80} height={80} className="w-20 h-20 object-cover rounded-lg border border-border" />
                <div className="absolute inset-0 bg-bg/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-1">
                  <button type="button" onClick={() => moveImage(i, -1)} disabled={i === 0} className="w-5 h-5 flex items-center justify-center text-text hover:text-leather disabled:opacity-30">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  <button type="button" onClick={() => removeImage(i)} className="w-5 h-5 flex items-center justify-center text-red-400 hover:text-red-300">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                  <button type="button" onClick={() => moveImage(i, 1)} disabled={i === images.length - 1} className="w-5 h-5 flex items-center justify-center text-text hover:text-leather disabled:opacity-30">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                  </button>
                </div>
                {i === 0 && (
                  <span className="absolute bottom-1 left-1 text-[9px] bg-leather text-bg px-1 rounded font-body">Primary</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Core fields */}
      <Input label="Title *" id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Custom Bifold Wallet" />
      <Textarea label="Description" id="desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short description shown on item cards and detail pages..." rows={3} />

      {/* Content type */}
      <Select label="Content Type" id="contentType" value={contentType} onChange={(e) => setContentType(e.target.value as "PHYSICAL_ITEM" | "GALLERY_ONLY" | "INSPIRATION")}>
        <option value="PHYSICAL_ITEM">Physical Item</option>
        <option value="GALLERY_ONLY">Gallery Only</option>
        <option value="INSPIRATION">Inspiration</option>
      </Select>

      {/* Status — only for physical items */}
      {contentType === "PHYSICAL_ITEM" && (
        <Select label="Status" id="status" value={status} onChange={(e) => setStatus(e.target.value as "FOR_SALE" | "SOLD")}>
          <option value="FOR_SALE">For Sale</option>
          <option value="SOLD">Sold</option>
        </Select>
      )}

      {/* Price — only for for-sale physical items */}
      {contentType === "PHYSICAL_ITEM" && status === "FOR_SALE" && (
        <Input
          label="Price ($)"
          id="price"
          type="number"
          min="0"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="0.00"
        />
      )}

      {/* Tags */}
      <div>
        <p className="text-sm font-semibold text-text-muted font-body uppercase tracking-wider mb-3">Tags</p>
        {typeTags.length > 0 && (
          <div className="mb-3">
            <p className="text-xs text-text-faint font-body mb-2">Type</p>
            <div className="flex flex-wrap gap-2">
              {typeTags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.id)}
                  className={`px-2.5 py-1 rounded text-xs font-body border transition-colors ${
                    selectedTagIds.has(tag.id)
                      ? "bg-leather/20 border-leather/50 text-leather-light"
                      : "border-border text-text-muted hover:border-border-hover hover:text-text"
                  }`}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>
        )}
        {themeTags.length > 0 && (
          <div>
            <p className="text-xs text-text-faint font-body mb-2">Theme</p>
            <div className="flex flex-wrap gap-2">
              {themeTags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.id)}
                  className={`px-2.5 py-1 rounded text-xs font-body border transition-colors ${
                    selectedTagIds.has(tag.id)
                      ? "bg-leather/20 border-leather/50 text-leather-light"
                      : "border-border text-text-muted hover:border-border-hover hover:text-text"
                  }`}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <Button onClick={handleSave} disabled={saving || uploading}>
          {saving ? "Saving..." : mode === "new" ? "Create Item" : "Save Changes"}
        </Button>
        <Button variant="ghost" onClick={() => router.push("/admin/items")}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
