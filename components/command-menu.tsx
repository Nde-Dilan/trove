"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowLeft } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useBookmarksStore } from "@/store/bookmarks-store";
import { Folder } from "lucide-react";

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

interface CommandMenuProps {
  navItems: NavItem[];
  className?: string;
}

export function CommandMenu({ navItems, className }: CommandMenuProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { collections, setSelectedCollection, clearTags } = useBookmarksStore();


  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = (callback: () => void) => {
    setOpen(false);
    callback();
  };

  return (
    <div className={cn("flex w-full items-center gap-2", className)}>
      <Button
        type="button"
        variant="outline"
        className="hidden w-full max-w-lg items-center justify-start gap-2 rounded-lg border-border bg-muted/50 text-sm text-muted-foreground hover:bg-muted sm:flex"
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4 text-muted-foreground" />
        <span className="flex-1 text-left">Search...</span>
        <kbd className="rounded-lg border px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
          Ctrl K
        </kbd>
      </Button>

      <Button
        type="button"
        variant="outline"
        className="w-full items-center justify-start gap-2 rounded-lg border-border bg-muted/50 text-sm text-muted-foreground hover:bg-muted sm:hidden"
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4 text-muted-foreground" />
        <span className="flex-1 text-left">Search...</span>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search..." />
        <CommandList className="min-h-[200px] max-h-[400px] scroll-pt-2 scroll-pb-1.5 pt-1">
          <CommandEmpty className="py-12 text-center text-sm text-muted-foreground">
            No results found.
          </CommandEmpty>
          <CommandGroup
            className="p-0! **:[[cmdk-group-heading]]:px-2! **:[[cmdk-group-heading]]:pt-4! **:[[cmdk-group-heading]]:pb-2! **:[[cmdk-group-heading]]:scroll-mt-16"
            heading="Navigation"
          >
            {navItems.map((item) => (
              <CommandItem
                key={item.href}
                value={item.label}
                onSelect={() =>
                  runCommand(() => {
                    if (item.href === "/bookmarks") {
                      setSelectedCollection(null);
                      clearTags();
                    }
                    router.push(item.href);
                  })
                }
                className="gap-2"
              >
                <item.icon className="h-4 w-4 opacity-72" />
                {item.label}
              </CommandItem>
            ))}
          </CommandGroup>
          {collections.length > 0 && (
            <CommandGroup
              className="p-0! **:[[cmdk-group-heading]]:px-2! **:[[cmdk-group-heading]]:pt-4! **:[[cmdk-group-heading]]:pb-2! **:[[cmdk-group-heading]]:scroll-mt-16"
              heading="Collections"
            >
              {collections.map((collection) => (
                <CommandItem
                  key={collection.id}
                  value={collection.name}
                  onSelect={() =>
                    runCommand(() => {
                      setSelectedCollection(collection.id);
                      clearTags();
                      router.push("/bookmarks");
                    })
                  }
                  className="gap-2"
                >
                  <Folder className="h-4 w-4 opacity-72" />
                  {collection.name}
                </CommandItem>
              ))}
            </CommandGroup>
          )}

        </CommandList>
        <div className="absolute inset-x-0 bottom-0 z-20 flex items-center gap-2 rounded-b-xl border-t bg-muted px-4 py-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <kbd className="pointer-events-none flex h-5 select-none items-center justify-center gap-1 rounded border bg-background px-1 font-medium text-[0.7rem] text-muted-foreground">
              <ArrowLeft className="h-3 w-3" />
            </kbd>
            <span>Go to page</span>
          </div>
          <Separator className="h-4!" orientation="vertical" />
          <div className="flex min-w-0 items-center gap-1">
            <kbd className="pointer-events-none flex h-5 select-none items-center justify-center gap-1 rounded border bg-background px-1 font-medium text-[0.7rem] text-muted-foreground">
              Esc
            </kbd>
            <span className="truncate">Close</span>
          </div>
        </div>
      </CommandDialog>
    </div>
  );
}
