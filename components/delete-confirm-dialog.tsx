"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  variant?: "trash" | "permanent" | "archive";
}

export function DeleteConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  variant = "trash",
}: DeleteConfirmDialogProps) {
  const getVariantConfig = () => {
    switch (variant) {
      case "archive":
        return {
          title: "Archive Bookmark?",
          description:
            "This bookmark will be moved to your archive. You can still access it anytime from the sidebar.",
          actionLabel: "Archive",
          actionVariant: "destructive" as const,
        };
      case "permanent":
        return {
          title: "Delete Permanently?",
          description:
            "This action is irreversible. All data associated with this bookmark will be lost.",
          actionLabel: "Delete",
          actionVariant: "destructive" as const,
        };
      default:
        return {
          title: "Move to Trash?",
          description:
            "This bookmark will be moved to the trash. You can restore it later if needed.",
          actionLabel: "Move to Trash",
          actionVariant: "destructive" as const,
        };
    }
  };

  const config = getVariantConfig();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="w-[92vw] max-w-md sm:w-full transition-all border-border/40 shadow-2xl">
        <AlertDialogHeader className="sm:text-left">
          <AlertDialogTitle className="text-xl font-bold tracking-tight">
            {title || config.title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground text-sm leading-relaxed">
            {description || config.description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-6 flex flex-row gap-3">
          <AlertDialogCancel asChild>
            <Button
              variant="secondary"
              className="flex-1 sm:flex-none font-medium h-10 px-6"
            >
              Cancel
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant={config.actionVariant}
              onClick={onConfirm}
              className={cn(
                "flex-1 sm:flex-none font-bold h-10 px-6 shadow-sm bg-red-500 hover:bg-red-600",
                config.actionVariant === "destructive" && "text-white!"
              )}
            >
              {config.actionLabel}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
