"use client";

import { useState } from "react";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface AddBookmarkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddBookmarkDialog({
  open,
  onOpenChange,
}: AddBookmarkDialogProps) {
  const isMobile = useIsMobile();
  const { collections, addBookmark } = useBookmarksStore();

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [collectionId, setCollectionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setTitle("");
    setUrl("");
    setDescription("");
    setCollectionId(null);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!title || !url) {
      toast.error("Title and URL are required");
      return;
    }

    setLoading(true);
    try {
      await addBookmark({
        title,
        url,
        description,
        collectionId: collectionId === "none" ? null : collectionId,
        favicon: "", // Will be handled by store/backend or default
        tags: [], // Initial tags can be added here if we extend the form
      });
      toast.success("Bookmark added successfully");
      resetForm();
      onOpenChange(false);
    } catch (error: any) {
      toast.error("Failed to add bookmark: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const formFields = (
    <div className="grid gap-4 py-2 sm:gap-6 sm:py-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="grid gap-1.5">
          <Label
            htmlFor="title"
            className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80"
          >
            Title
          </Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Bookmark title"
            required
            className="h-9 bg-muted/5 border-muted-foreground/10 focus-visible:ring-primary/20 transition-all text-sm rounded-lg"
          />
        </div>
        <div className="grid gap-1.5">
          <Label
            htmlFor="url"
            className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80"
          >
            URL
          </Label>
          <Input
            id="url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            required
            className="h-9 bg-muted/5 border-muted-foreground/10 focus-visible:ring-primary/20 transition-all text-sm rounded-lg"
          />
        </div>
      </div>

      <div className="grid gap-1.5">
        <Label
          htmlFor="collection"
          className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80"
        >
          Collection
        </Label>
        <Select
          value={collectionId || "none"}
          onValueChange={(value) =>
            setCollectionId(value === "none" ? null : value)
          }
        >
          <SelectTrigger className="w-full h-9 bg-muted/5 border-muted-foreground/10 focus:ring-primary/20 text-sm rounded-lg">
            <SelectValue placeholder="Select a collection" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="none">No Collection</SelectItem>
            {collections.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-1.5">
        <Label
          htmlFor="description"
          className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80"
        >
          Description (Optional)
        </Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What is this bookmark about?"
          className="min-h-[70px] bg-muted/5 border-muted-foreground/10 focus-visible:ring-primary/20 transition-all resize-none text-sm rounded-lg"
        />
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="p-0 border-t-0 bg-background rounded-t-2xl max-h-[96%]">
          <DrawerHeader className="text-left border-b border-border/40 px-5 pt-5 pb-3">
            <DrawerTitle className="text-lg font-bold tracking-tight">
              Add Bookmark
            </DrawerTitle>
            <DrawerDescription className="text-xs">
              Save a new site to your bookmarks.
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-5 overflow-y-auto">{formFields}</div>
          <DrawerFooter className="px-5 pb-8 pt-3 flex flex-row gap-2 bg-muted/5 border-t border-border/40">
            <DrawerClose asChild>
              <Button
                variant="secondary"
                size="sm"
                className="flex-1 font-medium"
                onClick={resetForm}
              >
                Cancel
              </Button>
            </DrawerClose>
            <Button
              onClick={handleSubmit}
              disabled={loading}
              size="sm"
              className="flex-1 font-semibold"
            >
              {loading ? "Saving..." : "Save Bookmark"}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[540px] p-0 overflow-hidden border-border/40 shadow-2xl bg-background">
        <DialogHeader className="px-8 pt-8 pb-5 text-left border-b border-border/40 bg-muted/5">
          <DialogTitle className="text-2xl font-bold tracking-tight">
            Add Bookmark
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Add a new bookmark to your collection.
          </DialogDescription>
        </DialogHeader>
        <div className="px-8 py-2">{formFields}</div>
        <DialogFooter className="px-8 py-6 gap-2 border-t border-border/40 bg-muted/5">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => {
              resetForm();
              onOpenChange(false);
            }}
            className="font-medium"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            size="sm"
            className="min-w-[120px] font-bold"
          >
            {loading ? "Saving..." : "Save Bookmark"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
