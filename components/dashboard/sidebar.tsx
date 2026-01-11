"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase } from "@/integrations/supabase/supabase";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  Bookmark,
  ChevronDown,
  ChevronRight,
  Search,
  Github,
  User,
  LogOut,
  Folder,
  Star,
  Code,
  Palette,
  Wrench,
  BookOpen,
  Sparkles,
  Tag,
  Archive,
  Trash2,
  Heart,
  Music,
  Camera,
  Terminal,
  Briefcase,
  Cloud,
  Layers,
  Zap,
  Coffee,
  Globe,
  X,
} from "lucide-react";
import { useBookmarksStore } from "@/store/bookmarks-store";
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog";
import { toast } from "sonner";

const collectionIcons: Record<string, React.ElementType> = {
  folder: Folder,
  bookmark: Bookmark,
  star: Star,
  heart: Heart,
  code: Code,
  palette: Palette,
  "book-open": BookOpen,
  sparkles: Sparkles,
  music: Music,
  camera: Camera,
  globe: Globe,
  terminal: Terminal,
  briefcase: Briefcase,
  cloud: Cloud,
  layers: Layers,
  zap: Zap,
  coffee: Coffee,
};

const navItems = [
  { icon: Star, label: "Favorites", href: "/favorites" },
  { icon: Archive, label: "Archive", href: "/archive" },
  { icon: Trash2, label: "Trash", href: "/trash" },
];

export function BookmarksSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const [collectionsOpen, setCollectionsOpen] = React.useState(true);
  const [tagsOpen, setTagsOpen] = React.useState(true);
  const {
    selectedCollection,
    setSelectedCollection,
    selectedTags,
    toggleTag,
    clearTags,
    collections,
    tags,
    deleteTag,
    searchQuery,
    setSearchQuery,
  } = useBookmarksStore();

  const [user, setUser] = React.useState<any>(null);
  const [deleteTagId, setDeleteTagId] = React.useState<string | null>(null);
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  React.useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const isDashboardPage =
    pathname === "/bookmarks" ||
    pathname === "/favorites" ||
    pathname === "/archive" ||
    pathname === "/trash" ||
    pathname === "/settings";

  return (
    <Sidebar collapsible="offcanvas" className="lg:border-r-0!" {...props}>
      <SidebarHeader className="p-5 pb-0">
        <div className="flex items-center justify-between">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 outline-none group">
              <div className="size-7 rounded-full overflow-hidden bg-linear-to-br from-blue-400 via-indigo-500 to-violet-500 flex items-center justify-center ring-1 ring-white/40 shadow-lg group-hover:scale-110 transition-transform" />
              <div className="flex flex-col items-start leading-none gap-0.5">
                <span className="font-semibold text-sm truncate max-w-[100px]">
                  {user?.user_metadata?.full_name || "User"}
                </span>
                <span className="text-[10px] text-muted-foreground truncate max-w-[100px]">
                  {user?.email}
                </span>
              </div>
              <ChevronDown className="size-3 text-muted-foreground opacity-50" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel className="text-muted-foreground text-xs font-medium">
                My Account
              </DropdownMenuLabel>

              <DropdownMenuItem asChild>
                <Link
                  href="/settings"
                  className="cursor-pointer text-muted-foreground focus:text-accent-foreground"
                >
                  <User className="size-4 mr-2" />
                  Account Settings
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
                onClick={handleLogout}
              >
                <LogOut className="size-4 mr-2" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Avatar className="size-6.5">
            <AvatarImage src={user?.user_metadata?.avatar_url} />
            <AvatarFallback className="text-[10px]">
              {user?.email?.[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-5 pt-5">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            ref={searchInputRef}
            placeholder="Search Bookmarks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-10 h-9 bg-background"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-10 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          )}
          <div className="absolute right-2 top-1/2 -translate-y-1/2 bg-muted px-1.5 py-0.5 rounded text-[11px] text-muted-foreground font-medium">
            ⌘K
          </div>
        </div>

        <SidebarGroup className="p-0">
          <SidebarGroupLabel className="flex items-center gap-1.5 px-0 text-[10px] font-semibold tracking-wider text-muted-foreground">
            <button
              onClick={() => setCollectionsOpen(!collectionsOpen)}
              className="flex items-center gap-1.5 cursor-pointer"
            >
              <ChevronDown
                className={cn(
                  "size-3.5 transition-transform",
                  !collectionsOpen && "-rotate-90"
                )}
              />
              COLLECTIONS
            </button>
          </SidebarGroupLabel>
          {collectionsOpen && (
            <SidebarGroupContent>
              <SidebarMenu className="mt-2">
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === "/bookmarks" && !selectedCollection}
                    className="h-[38px]"
                  >
                    <Link
                      href="/bookmarks"
                      onClick={() => {
                        setSelectedCollection(null);
                        clearTags();
                      }}
                    >
                      <Bookmark className="size-5" />
                      <span className="flex-1">All Bookmarks</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                {collections.map((collection) => {
                  const IconComponent =
                    (collection.icon && collectionIcons[collection.icon]) ||
                    Folder;
                  const isActive =
                    selectedCollection === collection.id &&
                    pathname === "/bookmarks";
                  return (
                    <SidebarMenuItem key={collection.id}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        className="h-[38px]"
                      >
                        <Link
                          href="/bookmarks"
                          onClick={() => {
                            setSelectedCollection(collection.id);
                            clearTags();
                          }}
                        >
                          <IconComponent className="size-5" />
                          <span className="flex-1">{collection.name}</span>
                          <span className="text-muted-foreground text-xs">
                            {collection.count}
                          </span>
                          {isActive && (
                            <ChevronRight className="size-4 text-muted-foreground opacity-60" />
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          )}
        </SidebarGroup>

        <SidebarGroup className="p-0">
          <SidebarGroupLabel className="flex items-center gap-1.5 px-0 text-[10px] font-semibold tracking-wider text-muted-foreground">
            <button
              onClick={() => setTagsOpen(!tagsOpen)}
              className="flex items-center gap-1.5 cursor-pointer"
            >
              <ChevronDown
                className={cn(
                  "size-3.5 transition-transform",
                  !tagsOpen && "-rotate-90"
                )}
              />
              TAGS
            </button>
            {selectedTags.length > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  clearTags();
                }}
                className="ml-auto text-[10px] text-muted-foreground hover:text-foreground"
              >
                Clear
              </button>
            )}
          </SidebarGroupLabel>
          {tagsOpen && (
            <SidebarGroupContent>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {tags.map((tag) => (
                  <div
                    key={tag.id}
                    className={cn(
                      "group inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer select-none",
                      selectedTags.includes(tag.id)
                        ? "bg-primary text-primary-foreground"
                        : tag.color || "bg-secondary text-secondary-foreground"
                    )}
                    onClick={() => toggleTag(tag.id)}
                  >
                    <Tag className="size-3" />
                    <span>{tag.name}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteTagId(tag.id);
                      }}
                      className="ml-1 rounded-full p-0.5 opacity-0 group-hover:opacity-100 hover:bg-black/10 transition-all focus:opacity-100 focus:outline-none"
                    >
                      <Trash2 className="size-3" />
                    </button>
                  </div>
                ))}
              </div>
            </SidebarGroupContent>
          )}
        </SidebarGroup>

        <SidebarGroup className="p-0 mt-auto pt-4 border-t border-border/40">
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    className="h-[38px]"
                  >
                    <Link href={item.href}>
                      <item.icon className="size-5" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-5 pb-5">
        <Link
          href="https://github.com/kevinkenfack/trove"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 h-9 px-4 rounded-md border border-border bg-background hover:bg-muted shadow-xs text-sm font-medium w-full"
        >
          <Github className="size-4" />
          View on Github
        </Link>
      </SidebarFooter>

      <DeleteConfirmDialog
        open={!!deleteTagId}
        onOpenChange={(open) => !open && setDeleteTagId(null)}
        onConfirm={async () => {
          if (deleteTagId) {
            await deleteTag(deleteTagId);
            toast.success("Tag deleted successfully");
            setDeleteTagId(null);
          }
        }}
        title="Delete Tag"
        description="Are you sure you want to delete this tag? This action cannot be undone."
        variant="permanent"
      />
    </Sidebar>
  );
}
