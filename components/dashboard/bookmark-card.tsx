"use client";

import { useState } from "react";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useBookmarksStore, type Bookmark } from "@/store/bookmarks-store";
import { toast } from "sonner";
import { EditBookmarkDialog } from "./edit-bookmark-dialog";
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog";
import { AddTagsDialog } from "./add-tags-dialog";
import { BookmarkDetailsDialog } from "./bookmark-details-dialog";
import {
  Heart,
  MoreHorizontal,
  ExternalLink,
  Copy,
  Pencil,
  Trash2,
  Tag,
  Archive,
  Info,
} from "lucide-react";

interface BookmarkCardProps {
  bookmark: Bookmark;
  variant?: "grid" | "list";
}

export function BookmarkCard({
  bookmark,
  variant = "grid",
}: BookmarkCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [deleteVariant, setDeleteVariant] = useState<
    "trash" | "permanent" | "archive"
  >("trash");
  const {
    toggleFavorite,
    archiveBookmark,
    restoreFromArchive,
    trashBookmark,
    restoreFromTrash,
    permanentlyDelete,
    tags: allTags,
  } = useBookmarksStore();
  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await toggleFavorite(bookmark.id);
    if (!bookmark.isFavorite) {
      toast.success("Added to favorites", {
        description: bookmark.title,
      });
    } else {
      toast.warning("Removed from favorites", {
        description: bookmark.title,
      });
    }
  };

  const bookmarkTags = allTags.filter((tag) => bookmark.tags.includes(tag.id));

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditDialogOpen(true);
  };

  const handleTagClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsTagDialogOpen(true);
  };

  const handleCopyUrl = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(bookmark.url);
        toast.success("URL copied to clipboard");
      } else {
        throw new Error("Clipboard API not available");
      }
    } catch (err) {
      // Fallback
      const textArea = document.createElement("textarea");
      textArea.value = bookmark.url;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        toast.success("URL copied to clipboard");
      } catch (copyErr) {
        toast.error("Failed to copy URL");
      }
      document.body.removeChild(textArea);
    }
  };

  const handleOpenUrl = () => {
    window.open(bookmark.url, "_blank");
  };

  const handleDeleteClick = (variant: "trash" | "permanent" | "archive") => {
    setDeleteVariant(variant);
    setIsDeleteDialogOpen(true);
  };

  const onConfirmDelete = async () => {
    if (deleteVariant === "trash") {
      await trashBookmark(bookmark.id);
      toast.success("Bookmark moved to trash", {
        description: bookmark.title,
      });
    } else if (deleteVariant === "archive") {
      await archiveBookmark(bookmark.id);
      toast.success("Bookmark archived", {
        description: bookmark.title,
      });
    } else {
      await permanentlyDelete(bookmark.id);
      toast.success("Bookmark deleted permanently");
    }
  };

  const isTrash = bookmark.status === "trash";
  const isArchived = bookmark.status === "archived";

  if (variant === "list") {
    return (
      <div className="group flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
        <div className="size-10 rounded-lg bg-muted flex items-center justify-center overflow-hidden shrink-0">
          <Image
            src={bookmark.favicon}
            alt={bookmark.title}
            width={24}
            height={24}
            className={cn("size-6", bookmark.hasDarkIcon && "dark:invert")}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium truncate">{bookmark.title}</h3>
            {bookmarkTags.length > 0 && (
              <div className="hidden sm:flex items-center gap-1">
                {bookmarkTags.slice(0, 2).map((tag) => (
                  <span
                    key={tag.id}
                    className={cn(
                      "inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium",
                      tag.color
                    )}
                  >
                    {tag.name}
                  </span>
                ))}
                {bookmarkTags.length > 2 && (
                  <span className="text-[10px] text-muted-foreground">
                    +{bookmarkTags.length - 2}
                  </span>
                )}
              </div>
            )}
          </div>
          <p className="text-sm text-muted-foreground truncate">
            {bookmark.url}
          </p>
        </div>

        <div className="flex items-center gap-1">
          {!isTrash && (
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={handleToggleFavorite}
            >
              <Heart
                className={cn(
                  "size-4",
                  bookmark.isFavorite && "fill-red-500 text-red-500"
                )}
              />
            </Button>
          )}
          <Button variant="ghost" size="icon-xs" onClick={handleOpenUrl}>
            <ExternalLink className="size-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-xs">
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleCopyUrl}>
                <Copy className="size-4 mr-2" />
                Copy URL
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsDetailsDialogOpen(true)}>
                <Info className="size-4 mr-2" />
                More Details
              </DropdownMenuItem>

              {!isTrash && (
                <>
                  <DropdownMenuItem onClick={handleEditClick}>
                    <Pencil className="size-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleTagClick}>
                    <Tag className="size-4 mr-2" />
                    Add Tags
                  </DropdownMenuItem>
                </>
              )}

              <DropdownMenuSeparator />

              {isArchived ? (
                <DropdownMenuItem
                  onClick={() => restoreFromArchive(bookmark.id)}
                >
                  <Archive className="size-4 mr-2" />
                  Restore to Dashboard
                </DropdownMenuItem>
              ) : !isTrash ? (
                <DropdownMenuItem onClick={() => handleDeleteClick("archive")}>
                  <Archive className="size-4 mr-2" />
                  Archive
                </DropdownMenuItem>
              ) : null}

              {isTrash ? (
                <>
                  <DropdownMenuItem
                    onClick={() => restoreFromTrash(bookmark.id)}
                  >
                    <Trash2 className="size-4 mr-2 text-primary" />
                    Restore Bookmark
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive font-bold"
                    onClick={() => handleDeleteClick("permanent")}
                  >
                    <Trash2 className="size-4 mr-2" />
                    Delete Permanently
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => handleDeleteClick("trash")}
                >
                  <Trash2 className="size-4 mr-2" />
                  Move to Trash
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <EditBookmarkDialog
          bookmark={bookmark}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
        />

        <DeleteConfirmDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={onConfirmDelete}
          variant={deleteVariant}
          title={
            deleteVariant === "trash"
              ? `Move "${bookmark.title}" to trash?`
              : `Delete "${bookmark.title}"?`
          }
        />

        <AddTagsDialog
          bookmark={bookmark}
          open={isTagDialogOpen}
          onOpenChange={setIsTagDialogOpen}
        />

        <BookmarkDetailsDialog
          bookmark={bookmark}
          open={isDetailsDialogOpen}
          onOpenChange={setIsDetailsDialogOpen}
        />
      </div>
    );
  }

  return (
    <div className="group relative flex flex-col rounded-xl border bg-card overflow-hidden hover:bg-accent/30 transition-colors">
      <div className="absolute top-3 right-3 z-10 flex items-center gap-1">
        {!isTrash && (
          <Button
            variant="secondary"
            size="icon-xs"
            className="bg-background/80 backdrop-blur-sm shadow-sm border"
            onClick={handleToggleFavorite}
          >
            <Heart
              className={cn(
                "size-4",
                bookmark.isFavorite && "fill-red-500 text-red-500"
              )}
            />
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="secondary"
              size="icon-xs"
              className="bg-background/80 backdrop-blur-sm shadow-sm border"
            >
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleCopyUrl}>
              <Copy className="size-4 mr-2" />
              Copy URL
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setIsDetailsDialogOpen(true)}>
              <Info className="size-4 mr-2" />
              More Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleOpenUrl}>
              <ExternalLink className="size-4 mr-2" />
              Open in new tab
            </DropdownMenuItem>

            {!isTrash && (
              <>
                <DropdownMenuItem onClick={handleEditClick}>
                  <Pencil className="size-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleTagClick}>
                  <Tag className="size-4 mr-2" />
                  Add Tags
                </DropdownMenuItem>
              </>
            )}

            <DropdownMenuSeparator />

            {isArchived ? (
              <DropdownMenuItem onClick={() => restoreFromArchive(bookmark.id)}>
                <Archive className="size-4 mr-2" />
                Restore to Dashboard
              </DropdownMenuItem>
            ) : !isTrash ? (
              <DropdownMenuItem onClick={() => handleDeleteClick("archive")}>
                <Archive className="size-4 mr-2" />
                Archive
              </DropdownMenuItem>
            ) : null}

            {isTrash ? (
              <>
                <DropdownMenuItem onClick={() => restoreFromTrash(bookmark.id)}>
                  <Trash2 className="size-4 mr-2 text-primary" />
                  Restore Bookmark
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive font-bold"
                  onClick={() => handleDeleteClick("permanent")}
                >
                  <Trash2 className="size-4 mr-2" />
                  Delete Permanently
                </DropdownMenuItem>
              </>
            ) : (
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => handleDeleteClick("trash")}
              >
                <Trash2 className="size-4 mr-2" />
                Move to Trash
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <button
        className="w-full text-left cursor-pointer"
        onClick={handleOpenUrl}
      >
        <div className="h-32 bg-linear-to-br from-muted/50 to-muted flex items-center justify-center">
          <div className="size-12 rounded-xl bg-background shadow-sm flex items-center justify-center">
            <Image
              src={bookmark.favicon}
              alt={bookmark.title}
              width={32}
              height={32}
              className={cn("size-8", bookmark.hasDarkIcon && "dark:invert")}
            />
          </div>
        </div>

        <div className="p-4 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium line-clamp-1">{bookmark.title}</h3>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {bookmark.description}
          </p>
          {bookmarkTags.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {bookmarkTags.slice(0, 3).map((tag) => (
                <span
                  key={tag.id}
                  className={cn(
                    "inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold border",
                    tag.color || "bg-muted text-muted-foreground border-border/50"
                  )}
                >
                  {tag.name}
                </span>
              ))}
              {bookmarkTags.length > 3 && (
                <span className="text-[10px] text-muted-foreground font-medium py-0.5">
                  +{bookmarkTags.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </button>

      <EditBookmarkDialog
        bookmark={bookmark}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={onConfirmDelete}
        variant={deleteVariant}
        title={
          deleteVariant === "trash"
            ? `Move "${bookmark.title}" to trash?`
            : `Delete "${bookmark.title}"?`
        }
      />

      <AddTagsDialog
        bookmark={bookmark}
        open={isTagDialogOpen}
        onOpenChange={setIsTagDialogOpen}
      />

      <BookmarkDetailsDialog
        bookmark={bookmark}
        open={isDetailsDialogOpen}
        onOpenChange={setIsDetailsDialogOpen}
      />
    </div>
  );
}
