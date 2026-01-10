"use client";

import { useState, useMemo } from "react";
import { type Bookmark, type Tag } from "@/store/bookmarks-store";
import { useBookmarksStore } from "@/store/bookmarks-store";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Plus, Tag as TagIcon, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface AddTagsDialogProps {
  bookmark: Bookmark;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddTagsDialog({
  bookmark,
  open,
  onOpenChange,
}: AddTagsDialogProps) {
  const isMobile = useIsMobile();
  const { tags: allTags, updateBookmark, createTag } = useBookmarksStore();
  const [search, setSearch] = useState("");
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(bookmark.tags);
  const [loading, setLoading] = useState(false);

  // Sync selection when dialog opens
  useMemo(() => {
    if (open) {
      setSelectedTagIds(bookmark.tags);
      setSearch("");
    }
  }, [open, bookmark.tags]);

  const filteredTags = allTags.filter((tag) =>
    tag.name.toLowerCase().includes(search.toLowerCase())
  );

  const exactMatch = allTags.find(
    (tag) => tag.name.toLowerCase() === search.toLowerCase()
  );

  const toggleTagSelection = (tagId: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  const handleCreateTag = async () => {
    if (!search.trim()) return;
    setLoading(true);
    const newTag = await createTag(search.trim());
    if (newTag) {
      setSelectedTagIds((prev) => [...prev, newTag.id]);
      setSearch("");
      toast.success(`Tag "${newTag.name}" created`);
    } else {
      toast.error("Failed to create tag");
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateBookmark(bookmark.id, { tags: selectedTagIds });
      toast.success("Tags updated successfully");
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to update tags");
    } finally {
      setLoading(false);
    }
  };

  const tagListContent = (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Search or create tags..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 h-10 bg-muted/5 border-muted-foreground/10 rounded-xl"
        />
        {search && (
          <button 
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5 max-h-[300px] overflow-y-auto px-1 py-1">
        {search && !exactMatch && (
          <button
            onClick={handleCreateTag}
            disabled={loading}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-md border border-dashed border-primary/50 text-xs font-medium text-primary hover:bg-primary/5 transition-colors"
          >
            <Plus className="size-3" />
            Create "{search}"
          </button>
        )}

        {filteredTags.length > 0 ? (
          filteredTags.map((tag) => {
            const isSelected = selectedTagIds.includes(tag.id);
            return (
              <button
                key={tag.id}
                onClick={() => toggleTagSelection(tag.id)}
                className={cn(
                  "inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-colors",
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : tag.color || "bg-muted text-muted-foreground"
                )}
              >
                {isSelected ? <Check className="size-3" /> : <TagIcon className="size-3" />}
                {tag.name}
              </button>
            );
          })
        ) : !search ? (
          <div className="py-8 text-center w-full">
            <TagIcon className="size-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No tags available.</p>
            <p className="text-xs text-muted-foreground/60">Type to create a new one.</p>
          </div>
        ) : null}
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="p-0 border-t-0 bg-background rounded-t-2xl max-h-[96%]">
          <DrawerHeader className="text-left border-b border-border/40 px-5 pt-6 pb-4">
            <DrawerTitle className="text-xl font-bold tracking-tight">Add Tags</DrawerTitle>
            <DrawerDescription className="text-xs">
              Organize your bookmark with tags.
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-5 py-4">
            {tagListContent}
          </div>
          <DrawerFooter className="px-5 pb-10 pt-4 flex flex-row gap-2 bg-muted/5 border-t border-border/40">
            <DrawerClose asChild>
              <Button variant="secondary" size="sm" className="flex-1 font-medium">
                Cancel
              </Button>
            </DrawerClose>
            <Button 
              onClick={handleSave} 
              disabled={loading} 
              size="sm"
              className="flex-1 font-semibold"
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px] p-0 overflow-hidden border-border/40 shadow-2xl bg-background">
        <DialogHeader className="px-8 pt-8 pb-5 text-left border-b border-border/40 bg-muted/5">
          <DialogTitle className="text-2xl font-bold tracking-tight">Add Tags</DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Select or create tags for this bookmark.
          </DialogDescription>
        </DialogHeader>
        <div className="px-8 py-6">
          {tagListContent}
        </div>
        <DialogFooter className="px-8 py-6 gap-2 border-t border-border/40 bg-muted/5">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="font-medium"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={loading}
            size="sm"
            className="min-w-[120px] font-bold"
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
