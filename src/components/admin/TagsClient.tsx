"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { Tag } from "@/types";

type TagWithCount = Tag & { _count: { items: number } };

export function TagsClient({ initialTags }: { initialTags: TagWithCount[] }) {
  const [tags, setTags] = useState(initialTags);
  const [newType, setNewType] = useState("");
  const [newTheme, setNewTheme] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const typeTags = tags.filter((t) => t.category === "TYPE");
  const themeTags = tags.filter((t) => t.category === "THEME");

  async function addTag(name: string, category: "TYPE" | "THEME") {
    if (!name.trim()) return;
    try {
      const res = await fetch("/api/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), category }),
      });
      if (!res.ok) { toast.error("Tag already exists or invalid"); return; }
      const tag = await res.json();
      setTags((prev) => [...prev, { ...tag, _count: { items: 0 } }]);
      if (category === "TYPE") setNewType("");
      else setNewTheme("");
      toast.success(`Tag "${name}" added`);
    } catch {
      toast.error("Failed to add tag");
    }
  }

  async function deleteTag(id: string) {
    setDeleting(id);
    try {
      await fetch(`/api/tags/${id}`, { method: "DELETE" });
      setTags((prev) => prev.filter((t) => t.id !== id));
      setConfirmDelete(null);
      toast.success("Tag deleted");
    } catch {
      toast.error("Failed to delete tag");
    } finally {
      setDeleting(null);
    }
  }

  function TagList({ tagList, category }: { tagList: TagWithCount[]; category: "TYPE" | "THEME" }) {
    const newValue = category === "TYPE" ? newType : newTheme;
    const setNewValue = category === "TYPE" ? setNewType : setNewTheme;

    return (
      <div className="bg-surface border border-border rounded-xl p-5 flex flex-col gap-4">
        <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider font-body">
          {category === "TYPE" ? "Type Tags" : "Theme Tags"}
        </h2>

        {/* Tag list */}
        <div className="flex flex-col gap-1">
          {tagList.length === 0 ? (
            <p className="text-text-faint text-sm font-body">No tags yet.</p>
          ) : (
            tagList.map((tag) => (
              <div key={tag.id} className="flex items-center justify-between py-1.5 group">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-text font-body">{tag.name}</span>
                  <span className="text-xs text-text-faint font-body">{tag._count.items} items</span>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  {confirmDelete === tag.id ? (
                    <span className="flex items-center gap-2">
                      {tag._count.items > 0 && (
                        <span className="text-xs text-yellow-400 font-body">
                          {tag._count.items} items use this tag
                        </span>
                      )}
                      <button
                        onClick={() => deleteTag(tag.id)}
                        disabled={deleting === tag.id}
                        className="text-xs text-red-400 hover:text-red-300 font-body"
                      >
                        {deleting === tag.id ? "Deleting..." : "Confirm"}
                      </button>
                      <button onClick={() => setConfirmDelete(null)} className="text-xs text-text-muted hover:text-text font-body">
                        Cancel
                      </button>
                    </span>
                  ) : (
                    <button
                      onClick={() => setConfirmDelete(tag.id)}
                      className="text-xs text-text-faint hover:text-red-400 font-body transition-colors"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add new */}
        <div className="flex gap-2 pt-2 border-t border-border">
          <Input
            id={`new-${category}`}
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder={category === "TYPE" ? "e.g. Money Clip" : "e.g. Sports"}
            onKeyDown={(e) => { if (e.key === "Enter") addTag(newValue, category); }}
            className="flex-1"
          />
          <Button size="sm" variant="secondary" onClick={() => addTag(newValue, category)}>
            Add
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
      <TagList tagList={typeTags} category="TYPE" />
      <TagList tagList={themeTags} category="THEME" />
    </div>
  );
}
