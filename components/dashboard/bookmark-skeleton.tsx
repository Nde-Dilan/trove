"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useBookmarksStore } from "@/store/bookmarks-store";

export function BookmarkCardSkeleton() {
  const { viewMode } = useBookmarksStore();

  if (viewMode === "list") {
    return (
      <div className="flex items-center gap-4 p-4 rounded-lg border bg-card/50">
        <Skeleton className="size-10 rounded-lg shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        <div className="flex gap-1">
          <Skeleton className="size-8 rounded-md" />
          <Skeleton className="size-8 rounded-md" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col rounded-xl border bg-card/50 overflow-hidden h-full">
      <Skeleton className="h-32 w-full rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-2/3" />
        <div className="space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
        </div>
        <div className="flex gap-1.5 pt-1">
          <Skeleton className="h-5 w-12 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function BookmarkGridSkeleton({ count = 8 }: { count?: number }) {
  const { viewMode } = useBookmarksStore();

  return (
    <div className={
      viewMode === "grid" 
        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        : "flex flex-col gap-2"
    }>
      {Array.from({ length: count }).map((_, i) => (
        <BookmarkCardSkeleton key={i} />
      ))}
    </div>
  );
}
