"use client";

import { useBookmarksStore } from "@/store/bookmarks-store";
import { BookmarkCard } from "./bookmark-card";
import { StatsCards } from "./stats-cards";
import { Button } from "@/components/ui/button";
import { X, Plus, SlidersHorizontal, ArrowUpDown, Check } from "lucide-react";
import { BookmarkGridSkeleton } from "./bookmark-skeleton";
import { useEffect, useState } from "react";
import { AddBookmarkDialog } from "./add-bookmark-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { filterOptions, sortOptions } from "./header";
import { cn } from "@/lib/utils";

export function BookmarksContent() {
  const {
    selectedCollection,
    getFilteredBookmarks,
    viewMode,
    selectedTags,
    toggleTag,
    filterType,
    setFilterType,
    sortBy,
    collections,
    tags,
    loading,
    fetchInitialData,
  } = useBookmarksStore();

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const [isAddBookmarkOpen, setIsAddBookmarkOpen] = useState(false);

  const filteredBookmarks = getFilteredBookmarks();

  const currentCollection = collections.find(
    (c) => c.id === selectedCollection
  );

  const activeTagsData = tags.filter((t) => selectedTags.includes(t.id));
  const hasActiveFilters =
    selectedTags.length > 0 || filterType !== "all" || sortBy !== "date-newest";

  if (loading) {
    return (
      <div className="flex-1 w-full overflow-auto">
        <div className="p-4 md:p-6 space-y-6">
          {/* Skeleton pour les cartes de statistiques */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={`stat-${i}`} className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-2xl border bg-card/50">
                <div className="size-8 md:size-10 rounded-xl bg-muted animate-pulse" />
                <div className="min-w-0 flex-1">
                  <div className="h-6 w-12 bg-muted animate-pulse rounded mb-1" />
                  <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                </div>
              </div>
            ))}
          </div>
          
          {/* Skeleton pour la grille de bookmarks */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-5 w-32 bg-muted animate-pulse rounded" />
                <div className="h-3 w-20 bg-muted animate-pulse rounded" />
              </div>
            </div>
            <BookmarkGridSkeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full overflow-auto">
      <div className="p-4 md:p-6 space-y-6">
        <StatsCards />

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center justify-between w-full sm:w-auto">
              <div>
                <h2 className="text-lg font-semibold">
                  {currentCollection?.name || "All Bookmarks"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {filteredBookmarks.length} bookmark
                  {filteredBookmarks.length !== 1 ? "s" : ""}
                  {hasActiveFilters && " (filtered)"}
                </p>
              </div>
              <div className="sm:hidden">
                <Button size="sm" className="h-8 gap-1.5" onClick={() => setIsAddBookmarkOpen(true)}>
                  <Plus className="size-4" />
                  Add
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:hidden w-full overflow-x-auto pb-1 mt-1">
               <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 gap-2 bg-background flex-1 sm:flex-none justify-center">
                    <ArrowUpDown className="size-3.5" />
                    <span className="text-xs truncate">{sortOptions.find(o => o.value === sortBy)?.label.split(" (")[0]}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuLabel className="text-xs text-muted-foreground">Sort by</DropdownMenuLabel>
                  {sortOptions.map((option) => (
                    <DropdownMenuItem key={option.value} onClick={() => useBookmarksStore.getState().setSortBy(option.value)} className="justify-between">
                      {option.label}
                      {sortBy === option.value && <Check className="size-4" />}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant={filterType !== 'all' ? 'default' : 'outline'} 
                    size="sm" 
                    className="h-8 gap-2 flex-1 sm:flex-none justify-center"
                  >
                    <SlidersHorizontal className="size-3.5" />
                    <span className="text-xs truncate">{filterType !== 'all' ? filterOptions.find(o => o.value === filterType)?.label : "Filter"}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel className="text-xs text-muted-foreground">Filter by</DropdownMenuLabel>
                  {filterOptions.map((option) => (
                    <DropdownMenuItem key={option.value} onClick={() => useBookmarksStore.getState().setFilterType(option.value)} className="justify-between">
                      {option.label}
                      {filterType === option.value && <Check className="size-4" />}
                    </DropdownMenuItem>
                  ))}
                  {filterType !== "all" && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => useBookmarksStore.getState().setFilterType("all")} className="text-muted-foreground">Clear filter</DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {(activeTagsData.length > 0 || filterType !== "all") && (
              <div className="flex flex-wrap items-center gap-2">
                {filterType !== "all" && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary">
                    {filterType === "favorites" && "Favorites only"}
                    {filterType === "with-tags" && "With tags"}
                    {filterType === "without-tags" && "Without tags"}
                    <button
                      onClick={() => setFilterType("all")}
                      className="hover:bg-primary/20 rounded-full p-0.5"
                    >
                      <X className="size-3" />
                    </button>
                  </span>
                )}
                {activeTagsData.map((tag) => (
                  <span
                    key={tag.id}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-primary text-primary-foreground"
                  >
                    {tag.name}
                    <button
                      onClick={() => toggleTag(tag.id)}
                      className="hover:bg-primary-foreground/20 rounded-full p-0.5"
                    >
                      <X className="size-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredBookmarks.map((bookmark) => (
                <BookmarkCard key={bookmark.id} bookmark={bookmark} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {filteredBookmarks.map((bookmark) => (
                <BookmarkCard
                  key={bookmark.id}
                  bookmark={bookmark}
                  variant="list"
                />
              ))}
            </div>
          )}

          {filteredBookmarks.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="size-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <svg
                  className="size-6 text-muted-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-1">No bookmarks found</h3>
              <p className="text-sm text-muted-foreground max-w-sm mb-4">
                Try adjusting your search or filter to find what you&apos;re
                looking for, or add a new bookmark.
              </p>
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setFilterType("all");
                  }}
                >
                  Clear filters
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
      <AddBookmarkDialog open={isAddBookmarkOpen} onOpenChange={setIsAddBookmarkOpen} />
    </div>
  );
}
