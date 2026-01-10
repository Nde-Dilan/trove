"use client";

import { Bookmark, Star, Tag, FolderOpen } from "lucide-react";
import { useBookmarksStore } from "@/store/bookmarks-store";
import { cn } from "@/lib/utils";

const stats = [
  {
    label: "Total Bookmarks",
    icon: Bookmark,
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    label: "Favorites",
    icon: Star,
    color: "bg-amber-500/10 text-amber-500",
  },
  {
    label: "Collections",
    icon: FolderOpen,
    color: "bg-violet-500/10 text-violet-500",
  },
  {
    label: "Tags Used",
    icon: Tag,
    color: "bg-emerald-500/10 text-emerald-500",
  },
];

export function StatsCards() {
  const { bookmarks, collections, tags } = useBookmarksStore();

  const activeBookmarks = bookmarks.filter(b => b.status === "active");

  const values = [
    activeBookmarks.length,
    activeBookmarks.filter((b) => b.isFavorite).length,
    collections.length,
    tags.length,
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className={cn(
            "flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-2xl border transition-all duration-300 shadow-sm",
            stat.color.split(' ')[0], // Utilise le bg-color/10 défini dans l'objet stats
            stat.color.split(' ')[1].replace('text-', 'border-'), // Utilise la couleur de texte pour la bordure
            "border-opacity-10 hover:border-opacity-30"
          )}
        >
          <div
            className={cn(
              "shrink-0 flex items-center justify-center rounded-xl",
              "size-8 md:size-10",
              stat.color // Garde le fond coloré pour l'icône aussi pour le contraste
            )}
          >
            <stat.icon className="size-4 md:size-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xl md:text-2xl font-bold tracking-tight truncate">
              {values[index]}
            </p>
            <p className="text-[10px] md:text-sm text-muted-foreground font-medium truncate">
              {stat.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

