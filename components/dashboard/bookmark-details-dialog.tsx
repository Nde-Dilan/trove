"use client";

import * as React from "react";
import Image from "next/image";
import { 
  Globe, 
  ExternalLink, 
  Bookmark as BookmarkIcon,
  Tag as TagIcon,
  Calendar,
  Info
} from "lucide-react";
import { type Bookmark } from "@/store/bookmarks-store";
import { useBookmarksStore } from "@/store/bookmarks-store";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface BookmarkDetailsDialogProps {
  bookmark: Bookmark;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BookmarkDetailsDialog({
  bookmark,
  open,
  onOpenChange,
}: BookmarkDetailsDialogProps) {
  const isMobile = useIsMobile();
  const [previewLoaded, setPreviewLoaded] = React.useState(false);
  const [previewError, setPreviewError] = React.useState(false);
  const { collections, tags: allTags } = useBookmarksStore();

  const collection = collections.find((c) => c.id === bookmark.collectionId);
  const bookmarkTags = allTags.filter((tag) => bookmark.tags.includes(tag.id));

  const previewUrl = `https://api.microlink.io/?url=${encodeURIComponent(
    bookmark.url
  )}&screenshot=true&meta=false&embed=screenshot.url&colorScheme=dark`;

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader className="sr-only">
            <DrawerTitle>{bookmark.title}</DrawerTitle>
          </DrawerHeader>
          <div className="px-6 py-4 overflow-y-auto space-y-6">
            <div className="flex items-center gap-4">
              <div className="size-14 rounded-lg bg-secondary p-2 flex items-center justify-center overflow-hidden border border-border/60">
                <img
                  src={bookmark.favicon}
                  alt={bookmark.title}
                  className={cn("size-8 object-contain", bookmark.hasDarkIcon && "dark:invert")}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${bookmark.title}&background=random&size=64`;
                  }}
                />
              </div>
              <div className="min-w-0">
                <DrawerTitle className="text-lg font-bold leading-tight truncate">{bookmark.title}</DrawerTitle>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  {collection && (
                    <Badge variant="secondary" className="h-5 px-1.5 bg-secondary text-muted-foreground border-none text-[10px] font-medium rounded-md">
                      <BookmarkIcon className="mr-1 size-2.5" />
                      {collection.name}
                    </Badge>
                  )}
                  <span className="text-[10px] text-muted-foreground/60 flex items-center gap-1 font-medium">
                    <Calendar className="size-2.5" />
                    {new Date(bookmark.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {bookmark.description && (
                <div className="space-y-1.5">
                  <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    <Info className="size-3" />
                    Description
                  </h3>
                  <DrawerDescription className="text-sm text-foreground/80 leading-relaxed font-medium">
                    {bookmark.description}
                  </DrawerDescription>
                </div>
              )}

              {bookmarkTags.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    <TagIcon className="size-3" />
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {bookmarkTags.map((tag) => (
                      <Badge
                        key={tag.id}
                        variant="secondary"
                        className={cn("text-[10px] py-0.5 px-2 font-bold rounded-md border", tag.color || "bg-muted text-muted-foreground border-border/50")}
                      >
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                  <Globe className="size-3" />
                  Website URL
                </h3>
                <a 
                  href={bookmark.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline underline-offset-4 break-all block truncate font-medium"
                >
                  {bookmark.url}
                </a>
              </div>
            </div>

            <div className="space-y-3 pt-2 pb-8">
              <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <Globe className="size-3.5" />
                Preview Snapshot
              </h3>
              <div className="relative aspect-video overflow-hidden rounded-lg border border-border/60 bg-muted/40">
                {!previewLoaded && !previewError && (
                  <Skeleton className="h-full w-full rounded-none" />
                )}
                {previewError ? (
                  <div className="flex h-64 flex-col items-center justify-center gap-2 text-muted-foreground/40">
                    <Info className="size-8" />
                    <p className="text-xs">Preview not available</p>
                  </div>
                ) : (
                  <img
                    src={previewUrl}
                    alt={`${bookmark.title} preview`}
                    loading="lazy"
                    className={cn(
                      "w-full max-h-72 object-contain transition-opacity duration-300",
                      previewLoaded ? "opacity-100" : "opacity-0"
                    )}
                    onLoad={() => setPreviewLoaded(true)}
                    onError={() => { setPreviewError(true); setPreviewLoaded(true); }}
                  />
                )}
              </div>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[75vw] w-[70vw] h-[70vh] p-0 overflow-hidden border-border/50 bg-background rounded-xl shadow-2xl">
        <DialogTitle className="sr-only">{bookmark.title}</DialogTitle>
        <div className="grid grid-cols-[400px_1fr] h-full items-stretch">
          <div className="p-10 border-r border-border/50 flex flex-col gap-8 overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="size-14 rounded-lg bg-secondary p-2 flex items-center justify-center border border-border/60">
                  <Image
                    src={bookmark.favicon}
                    alt={bookmark.title}
                    width={40}
                    height={40}
                    className={cn("size-8 object-contain", bookmark.hasDarkIcon && "dark:invert")}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-xl font-bold tracking-tight text-foreground leading-tight line-clamp-2">
                    {bookmark.title}
                  </h2>
                  <div className="flex items-center gap-2 mt-2">
                    {collection && (
                      <Badge variant="secondary" className="h-5 px-2 bg-secondary text-muted-foreground border-none text-[10px] font-medium rounded-md">
                        {collection.name}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                  <Globe className="size-3" />
                  Website URL
                </h3>
                <a 
                  href={bookmark.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary font-medium hover:underline underline-offset-4 break-all block truncate"
                >
                  {bookmark.url}
                </a>
              </div>
            </div>

            <div className="space-y-6 flex-1">
              {bookmark.description && (
                <div className="space-y-2">
                  <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    <Info className="size-3" />
                    Description
                  </h3>
                  <DialogDescription className="text-sm text-foreground/80 leading-relaxed font-medium">
                    {bookmark.description}
                  </DialogDescription>
                </div>
              )}

              {bookmarkTags.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    <TagIcon className="size-3" />
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {bookmarkTags.map((tag) => (
                      <Badge
                        key={tag.id}
                        variant="secondary"
                        className={cn("text-[10px] py-0.5 px-2 font-bold rounded-md border", tag.color || "bg-muted text-muted-foreground border-border/50")}
                      >
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 text-[10px] text-muted-foreground/50 pt-6 border-t border-border/40 mt-auto">
              <Calendar className="size-3" />
              Saved on {new Date(bookmark.createdAt).toLocaleDateString()}
            </div>
          </div>

          <div className="bg-muted/5 p-12 flex items-center justify-center overflow-hidden">
             <div className="w-full max-w-[500px] flex flex-col gap-6">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                  <Globe className="size-3.5" />
                  Preview Snapshot
                </h3>

                <div className="relative overflow-hidden rounded-lg border border-border/60 bg-muted/40 w-full min-h-[300px] flex items-center justify-center">
                  {!previewLoaded && !previewError && (
                    <Skeleton className="absolute inset-0 size-full" />
                  )}
                  {previewError ? (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground/30 py-8">
                      <Info className="size-8" />
                      <p className="text-xs font-bold">Preview not available</p>
                    </div>
                  ) : (
                    <img
                      src={previewUrl}
                      alt={`${bookmark.title} preview`}
                      className={cn(
                        "w-full max-h-[400px] object-contain transition-opacity duration-300",
                        previewLoaded ? "opacity-100" : "opacity-0"
                      )}
                      onLoad={() => setPreviewLoaded(true)}
                      onError={() => { setPreviewError(true); setPreviewLoaded(true); }}
                    />
                  )}
                </div>

                <Button asChild className="w-full h-11 gap-2 rounded-xl text-sm font-bold bg-primary text-primary-foreground shadow-none transition-transform hover:scale-[1.01] active:scale-[0.99]">
                   <a href={bookmark.url} target="_blank" rel="noopener noreferrer">
                     <ExternalLink className="size-4!" />
                     Launch Website
                   </a>
                </Button>
             </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
