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
import { toast } from "sonner";
import { Loader2, Plus, Tag as TagIcon } from "lucide-react";

interface AddTagDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddTagDialog({ open, onOpenChange }: AddTagDialogProps) {
  const isMobile = useIsMobile();
  const { createTag } = useBookmarksStore();

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setName("");
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!name.trim()) {
      toast.error("Tag name is required");
      return;
    }

    setLoading(true);
    try {
      await createTag(name.trim());
      toast.success("Tag created successfully");
      resetForm();
      onOpenChange(false);
    } catch (error: any) {
      toast.error("Failed to create tag: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const formFields = (
    <div className="grid gap-4 py-2 sm:gap-6 sm:py-4">
      <div className="grid gap-2">
        <Label
          htmlFor="name"
          className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80"
        >
          Tag Name
        </Label>
        <div className="relative">
          <TagIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Design, Inspiration, Todo"
            required
            className="pl-9 h-10 bg-muted/5 border-muted-foreground/10 focus-visible:ring-primary/20 transition-all text-sm rounded-lg"
            autoFocus={!isMobile}
          />
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="p-0 border-t-0 bg-background rounded-t-2xl max-h-[96%]">
          <DrawerHeader className="text-left border-b border-border/40 px-5 pt-5 pb-3">
            <DrawerTitle className="text-lg font-bold tracking-tight">
              Create New Tag
            </DrawerTitle>
            <DrawerDescription className="text-xs">
              Organize your bookmarks with a new tag.
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
              {loading ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
              {loading ? "Creating..." : "Create Tag"}
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
          <DialogTitle className="text-xl font-bold tracking-tight">
            Create New Tag
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Give your new tag a name to get started.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="px-8 py-4">{formFields}</div>
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
              type="submit"
              disabled={loading}
              size="sm"
              className="min-w-[120px] font-bold"
            >
              {loading ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
              {loading ? "Creating..." : "Create Tag"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
