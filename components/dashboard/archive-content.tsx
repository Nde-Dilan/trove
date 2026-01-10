"use client";

import { useBookmarksStore } from "@/store/bookmarks-store";
import { BookmarkCard } from "./bookmark-card";
import { BookmarkGridSkeleton } from "./bookmark-skeleton";
import { Archive } from "lucide-react";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function ArchiveContent() {
  const {
    getArchivedBookmarks,
    viewMode,
    loading,
    fetchInitialData,
  } = useBookmarksStore();

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const archivedBookmarks = getArchivedBookmarks();

  if (loading && archivedBookmarks.length === 0) {
    return (
      <div className="flex-1 w-full overflow-auto">
        <div className="p-4 md:p-6 space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <BookmarkGridSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full overflow-auto">
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Archive className="size-6 text-violet-500" />
            Archive
          </h2>
          <p className="text-muted-foreground text-sm">
            {archivedBookmarks.length} archived bookmark{archivedBookmarks.length !== 1 ? "s" : ""}.
          </p>
        </div>

        <div className={
          viewMode === "grid" 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            : "flex flex-col gap-2"
        }>
          {archivedBookmarks.map((bookmark) => (
            <BookmarkCard key={bookmark.id} bookmark={bookmark} variant={viewMode} />
          ))}
        </div>

        {archivedBookmarks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="size-16 rounded-full bg-violet-500/10 flex items-center justify-center mb-4">
              <Archive className="size-8 text-violet-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Archive is empty</h3>
            <p className="text-muted-foreground max-w-sm">
              Keep your dashboard clean by archiving bookmarks you don&apos;t need right now.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
