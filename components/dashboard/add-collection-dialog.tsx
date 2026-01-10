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
import {
  Loader2,
  Folder,
  Bookmark,
  Star,
  Heart,
  Code,
  Palette,
  BookOpen,
  Sparkles,
  Music,
  Camera,
  Globe,
  Terminal,
  Briefcase,
  Cloud,
  Layers,
  Zap,
  Coffee,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AddCollectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const icons = [
  { name: "folder", icon: Folder },
  { name: "bookmark", icon: Bookmark },
  { name: "star", icon: Star },
  { name: "heart", icon: Heart },
  { name: "code", icon: Code },
  { name: "palette", icon: Palette },
  { name: "book-open", icon: BookOpen },
  { name: "sparkles", icon: Sparkles },
  { name: "music", icon: Music },
  { name: "camera", icon: Camera },
  { name: "globe", icon: Globe },
  { name: "terminal", icon: Terminal },
  { name: "briefcase", icon: Briefcase },
  { name: "cloud", icon: Cloud },
  { name: "layers", icon: Layers },
  { name: "zap", icon: Zap },
  { name: "coffee", icon: Coffee },
];


export function AddCollectionDialog({
  open,
  onOpenChange,
}: AddCollectionDialogProps) {
  const isMobile = useIsMobile();
  const { createCollection } = useBookmarksStore();

  const [name, setName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("folder");
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setName("");
    setSelectedIcon("folder");
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!name.trim()) {
      toast.error("Collection name is required");
      return;
    }

    setLoading(true);
    try {
      await createCollection({
        name: name.trim(),
        icon: selectedIcon,
        color: "", // Passing empty color
      });
      toast.success("Collection created successfully");
      resetForm();
      onOpenChange(false);
    } catch (error: any) {
      toast.error("Failed to create collection: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const formFields = (
    <div className="grid gap-6 py-4">
      <div className="grid gap-2">
        <Label
          htmlFor="coll-name"
          className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80"
        >
          Collection Name
        </Label>
        <Input
          id="coll-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Work, Learn, Projects"
          required
          className="h-10 bg-muted/5 border-muted-foreground/10 focus-visible:ring-primary/20 transition-all text-sm rounded-lg"
          autoFocus={!isMobile}
        />
      </div>

      <div className="grid gap-2">
        <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">
          Choose Icon
        </Label>
        <div className="grid grid-cols-6 gap-2 bg-muted/5 p-3 rounded-xl border border-muted-foreground/5">
          {icons.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.name}
                type="button"
                onClick={() => setSelectedIcon(item.name)}
                className={cn(
                  "size-9 flex items-center justify-center rounded-lg transition-all",
                  selectedIcon === item.name
                    ? "bg-primary text-primary-foreground shadow-sm scale-110"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="size-4" />
              </button>
            );
          })}
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
              Create Collection
            </DrawerTitle>
            <DrawerDescription className="text-xs">
              Organize your bookmarks into a dedicated collection.
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
              {loading ? "Creating..." : "Create Collection"}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden border-border/40 shadow-2xl bg-background">
        <DialogHeader className="px-8 pt-8 pb-5 text-left border-b border-border/40 bg-muted/5">
          <DialogTitle className="text-xl font-bold tracking-tight">
            New Collection
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Give your collection a name and customize its appearance.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
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
              type="submit"
              disabled={loading}
              size="sm"
              className="min-w-[140px] font-bold"
            >
              {loading ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
              {loading ? "Creating..." : "Create Collection"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
