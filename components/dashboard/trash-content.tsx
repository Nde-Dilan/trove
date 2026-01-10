"use client";

import { useBookmarksStore } from "@/store/bookmarks-store";
import { BookmarkCard } from "./bookmark-card";
import { BookmarkGridSkeleton } from "./bookmark-skeleton";
import { Trash2, AlertCircle } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function TrashContent() {
  const {
    getTrashedBookmarks,
    viewMode,
    loading,
    fetchInitialData,
  } = useBookmarksStore();

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const trashedBookmarks = getTrashedBookmarks();

  if (loading && trashedBookmarks.length === 0) {
    return (
      <div className="flex-1 w-full overflow-auto">
        <div className="p-4 md:p-6 space-y-6">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-9 w-24" />
          </div>
          <Skeleton className="h-12 w-full rounded-lg" />
          <BookmarkGridSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full overflow-auto">
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Trash2 className="size-6 text-destructive" />
              Trash
            </h2>
            <p className="text-muted-foreground text-sm">
              {trashedBookmarks.length} item{trashedBookmarks.length !== 1 ? "s" : ""} in trash.
            </p>
          </div>
          {trashedBookmarks.length > 0 && (
            <Button variant="destructive" size="sm" className="w-fit">
              Empty Trash
            </Button>
          )}
        </div>

        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 flex items-start gap-3">
          <AlertCircle className="size-5 text-destructive shrink-0 mt-0.5" />
          <p className="text-xs text-destructive-foreground">
            Items in the trash will be permanently deleted after 30 days. You can restore them or delete them permanently now.
          </p>
        </div>

        <div className={
          viewMode === "grid" 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            : "flex flex-col gap-2"
        }>
          {trashedBookmarks.map((bookmark) => (
            <BookmarkCard key={bookmark.id} bookmark={bookmark} variant={viewMode} />
          ))}
        </div>

        {trashedBookmarks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="size-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Trash2 className="size-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Trash is empty</h3>
            <p className="text-muted-foreground max-w-sm">
              When you delete bookmarks, they will appear here before being permanently removed.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
