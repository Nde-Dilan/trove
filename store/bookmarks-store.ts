import { create } from "zustand";
import { type Bookmark } from "@/mock-data/bookmarks";
export type { Bookmark };
import { supabase } from "@/integrations/supabase/supabase";
import { getRandomTagColor } from "@/lib/tag-colors";

export type Collection = {
  id: string;
  name: string;
  icon: string | null;
  color: string | null;
  count?: number;
  created_at?: string;
};

export type Tag = {
  id: string;
  name: string;
  color: string | null;
  count?: number;
};

type ViewMode = "grid" | "list";
type SortBy = "date-newest" | "date-oldest" | "alpha-az" | "alpha-za";
type FilterType = "all" | "favorites" | "with-tags" | "without-tags";

interface BookmarksState {
  bookmarks: Bookmark[];
  collections: Collection[];
  tags: Tag[];
  loading: boolean;
  initialFetched: boolean;
  error: string | null;
  selectedCollection: string | null;
  selectedTags: string[];
  searchQuery: string;
  viewMode: ViewMode;
  sortBy: SortBy;
  filterType: FilterType;
  setSelectedCollection: (collectionId: string | null) => void;
  toggleTag: (tagId: string) => void;
  clearTags: () => void;
  setSearchQuery: (query: string) => void;
  setViewMode: (mode: ViewMode) => void;
  setSortBy: (sort: SortBy) => void;
  setFilterType: (filter: FilterType) => void;
  
  // Actions
  fetchInitialData: (force?: boolean) => Promise<void>;
  fetchBookmarks: () => Promise<void>;
  toggleFavorite: (bookmarkId: string) => Promise<void>;
  archiveBookmark: (bookmarkId: string) => Promise<void>;
  restoreFromArchive: (bookmarkId: string) => Promise<void>;
  trashBookmark: (bookmarkId: string) => Promise<void>;
  restoreFromTrash: (bookmarkId: string) => Promise<void>;
  permanentlyDelete: (bookmarkId: string) => Promise<void>;
  updateBookmark: (bookmarkId: string, updates: Partial<Bookmark>) => Promise<void>;
  getFilteredBookmarks: () => Bookmark[];
  getFavoriteBookmarks: () => Bookmark[];
  getArchivedBookmarks: () => Bookmark[];
  getTrashedBookmarks: () => Bookmark[];
  createTag: (name: string) => Promise<Tag | null>;
  deleteTag: (tagId: string) => Promise<void>;
  createCollection: (data: { name: string; icon: string; color: string }) => Promise<Collection | null>;
  deleteCollection: (collectionId: string) => Promise<void>;
  addBookmark: (bookmark: Omit<Bookmark, "id" | "createdAt" | "status" | "isFavorite" | "hasDarkIcon">) => Promise<void>;
}

export const useBookmarksStore = create<BookmarksState>((set, get) => ({
  bookmarks: [],
  collections: [],
  tags: [],
  loading: false,
  initialFetched: false,
  error: null,
  selectedCollection: null,
  selectedTags: [],
  searchQuery: "",
  viewMode: "grid",
  sortBy: "date-newest",
  filterType: "all",

  setSelectedCollection: (collectionId) => set({ selectedCollection: collectionId }),

  toggleTag: (tagId) =>
    set((state) => ({
      selectedTags: state.selectedTags.includes(tagId)
        ? state.selectedTags.filter((t) => t !== tagId)
        : [...state.selectedTags, tagId],
    })),

  clearTags: () => set({ selectedTags: [] }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  setViewMode: (mode) => set({ viewMode: mode }),

  setSortBy: (sort) => set({ sortBy: sort }),

  setFilterType: (filter) => set({ filterType: filter }),

  fetchInitialData: async (force = false) => {
    const { initialFetched } = get();
    
    // Si déjà chargé une fois et qu'on ne force pas, on ne montre pas le skeleton
    // mais on rafraîchit quand même silencieusement au besoin (si force=true)
    if (initialFetched && !force) return;

    set({ loading: true });
    try {
      const [{ data: collections }, { data: tags }] = await Promise.all([
        supabase.from("collections").select("*").order("name"),
        supabase.from("tags").select("*").order("name")
      ]);

      set({ 
        collections: (collections || []) as Collection[], 
        tags: (tags || []) as Tag[],
      });
      
      await get().fetchBookmarks();
      set({ initialFetched: true });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  fetchBookmarks: async () => {
    try {
      const { data: bookmarks, error } = await supabase
        .from("bookmarks")
        .select(`
          *,
          bookmark_tags(tag_id)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const formattedBookmarks: Bookmark[] = (bookmarks || []).map((b: any) => ({
        id: b.id,
        title: b.title,
        url: b.url,
        description: b.description || "",
        favicon: b.favicon_url || "",
        collectionId: b.collection_id || "all",
        tags: b.bookmark_tags.map((bt: any) => bt.tag_id),
        createdAt: b.created_at,
        isFavorite: b.is_favorite || false,
        hasDarkIcon: b.has_dark_icon || false,
        status: b.status as "active" | "archived" | "trash"
      }));

      set({ bookmarks: formattedBookmarks });
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  toggleFavorite: async (bookmarkId) => {
    const bookmark = get().bookmarks.find(b => b.id === bookmarkId);
    if (!bookmark) return;

    const newFavoriteStatus = !bookmark.isFavorite;
    
    // Update local state first (Optimistic update)
    set((state) => ({
      bookmarks: state.bookmarks.map((b) =>
        b.id === bookmarkId ? { ...b, isFavorite: newFavoriteStatus } : b
      ),
    }));

    try {
      const { error } = await supabase
        .from("bookmarks")
        .update({ is_favorite: newFavoriteStatus })
        .eq("id", bookmarkId);

      if (error) throw error;
    } catch (error: any) {
      // Revert if error
      set((state) => ({
        bookmarks: state.bookmarks.map((b) =>
          b.id === bookmarkId ? { ...b, isFavorite: !newFavoriteStatus } : b
        ),
        error: error.message
      }));
    }
  },

  archiveBookmark: async (bookmarkId) => {
    set((state) => ({
      bookmarks: state.bookmarks.map(b => b.id === bookmarkId ? { ...b, status: "archived" } : b)
    }));

    try {
      const { error } = await supabase
        .from("bookmarks")
        .update({ status: "archived" })
        .eq("id", bookmarkId);
      if (error) throw error;
    } catch (error: any) {
      await get().fetchBookmarks(); // Reload on error
      set({ error: error.message });
    }
  },

  restoreFromArchive: async (bookmarkId) => {
    set((state) => ({
      bookmarks: state.bookmarks.map(b => b.id === bookmarkId ? { ...b, status: "active" } : b)
    }));

    try {
      const { error } = await supabase
        .from("bookmarks")
        .update({ status: "active" })
        .eq("id", bookmarkId);
      if (error) throw error;
    } catch (error: any) {
      await get().fetchBookmarks();
      set({ error: error.message });
    }
  },

  trashBookmark: async (bookmarkId) => {
    set((state) => ({
      bookmarks: state.bookmarks.map(b => b.id === bookmarkId ? { ...b, status: "trash" } : b)
    }));

    try {
      const { error } = await supabase
        .from("bookmarks")
        .update({ status: "trash" })
        .eq("id", bookmarkId);
      if (error) throw error;
    } catch (error: any) {
      await get().fetchBookmarks();
      set({ error: error.message });
    }
  },

  restoreFromTrash: async (bookmarkId) => {
    set((state) => ({
      bookmarks: state.bookmarks.map(b => b.id === bookmarkId ? { ...b, status: "active" } : b)
    }));

    try {
      const { error } = await supabase
        .from("bookmarks")
        .update({ status: "active" })
        .eq("id", bookmarkId);
      if (error) throw error;
    } catch (error: any) {
      await get().fetchBookmarks();
      set({ error: error.message });
    }
  },

  permanentlyDelete: async (bookmarkId) => {
    set((state) => ({
      bookmarks: state.bookmarks.filter(b => b.id !== bookmarkId)
    }));

    try {
      const { error } = await supabase
        .from("bookmarks")
        .delete()
        .eq("id", bookmarkId);
      if (error) throw error;
    } catch (error: any) {
      await get().fetchBookmarks();
      set({ error: error.message });
    }
  },

  updateBookmark: async (bookmarkId, updates) => {
    set((state) => ({
      bookmarks: state.bookmarks.map((b) =>
        b.id === bookmarkId ? { ...b, ...updates } : b
      ),
    }));

    try {
      const supabaseUpdates: any = {};
      if (updates.title !== undefined) supabaseUpdates.title = updates.title;
      if (updates.url !== undefined) supabaseUpdates.url = updates.url;
      if (updates.description !== undefined) supabaseUpdates.description = updates.description;
      if (updates.collectionId !== undefined) supabaseUpdates.collection_id = updates.collectionId;
      if (updates.favicon !== undefined) supabaseUpdates.favicon_url = updates.favicon;
      
      const { error } = await supabase
        .from("bookmarks")
        .update(supabaseUpdates)
        .eq("id", bookmarkId);

      if (error) throw error;

      if (updates.tags !== undefined) {
        await supabase
          .from("bookmark_tags")
          .delete()
          .eq("bookmark_id", bookmarkId);

        if (updates.tags.length > 0) {
          const tagInserts = updates.tags.map((tagId: string) => ({
            bookmark_id: bookmarkId,
            tag_id: tagId,
          }));
          await supabase.from("bookmark_tags").insert(tagInserts);
        }
      }
    } catch (error: any) {
      await get().fetchBookmarks();
      set({ error: error.message });
    }
  },

  getFilteredBookmarks: () => {
    const state = get();
    let filtered = state.bookmarks.filter(b => b.status === "active");

    if (state.selectedCollection !== null) {
      filtered = filtered.filter((b) => b.collectionId === state.selectedCollection);
    }

    if (state.selectedTags.length > 0) {
      filtered = filtered.filter((b) =>
        state.selectedTags.some((tag) => b.tags.includes(tag))
      );
    }

    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.title.toLowerCase().includes(query) ||
          b.description.toLowerCase().includes(query) ||
          b.url.toLowerCase().includes(query)
      );
    }

    switch (state.filterType) {
      case "favorites":
        filtered = filtered.filter((b) => b.isFavorite);
        break;
      case "with-tags":
        filtered = filtered.filter((b) => b.tags.length > 0);
        break;
      case "without-tags":
        filtered = filtered.filter((b) => b.tags.length === 0);
        break;
    }

    switch (state.sortBy) {
      case "date-newest":
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "date-oldest":
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case "alpha-az":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "alpha-za":
        filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
    }

    return filtered;
  },

  getFavoriteBookmarks: () => {
    const state = get();
    let filtered = state.bookmarks.filter((b) => b.isFavorite && b.status === "active");

    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.title.toLowerCase().includes(query) ||
          b.description.toLowerCase().includes(query) ||
          b.url.toLowerCase().includes(query)
      );
    }

    switch (state.sortBy) {
      case "date-newest":
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "date-oldest":
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case "alpha-az":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "alpha-za":
        filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
    }

    return filtered;
  },

  getArchivedBookmarks: () => {
    const state = get();
    let filtered = state.bookmarks.filter(b => b.status === "archived");

    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.title.toLowerCase().includes(query) ||
          b.description.toLowerCase().includes(query) ||
          b.url.toLowerCase().includes(query)
      );
    }

    return filtered;
  },

  getTrashedBookmarks: () => {
    const state = get();
    let filtered = state.bookmarks.filter(b => b.status === "trash");

    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.title.toLowerCase().includes(query) ||
          b.description.toLowerCase().includes(query) ||
          b.url.toLowerCase().includes(query)
      );
    }

    return filtered;
  },

  createTag: async (name) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const tagColor = getRandomTagColor();

      const { data, error } = await supabase
        .from("tags")
        .insert({ name, color: tagColor, user_id: user.id })
        .select()
        .single();
      
      if (error) throw error;
      
      const newTag = data as Tag;
      set((state) => ({
        tags: [...state.tags, newTag]
      }));
      
      return newTag;
    } catch (error: any) {
      set({ error: error.message });
      return null;
    }
  },

  deleteTag: async (tagId) => {
    const previousTags = get().tags;
    const previousSelectedTags = get().selectedTags;

    // Optimistic update
    set((state) => ({
      tags: state.tags.filter((t) => t.id !== tagId),
      selectedTags: state.selectedTags.filter((id) => id !== tagId),
    }));

    try {
      const { error } = await supabase.from("tags").delete().eq("id", tagId);
      if (error) throw error;
      
      // Also need to refresh bookmarks as they might have had this tag
      await get().fetchBookmarks();
    } catch (error: any) {
      // Revert on error
      set({ 
        tags: previousTags,
        selectedTags: previousSelectedTags,
        error: error.message 
      });
    }
  },

  createCollection: async ({ name, icon, color }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("collections")
        .insert({
          name,
          icon,
          color,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      const newCollection = data as Collection;
      set((state) => ({
        collections: [...state.collections, newCollection]
      }));
      
      return newCollection;
    } catch (error: any) {
      set({ error: error.message });
      return null;
    }
  },

  deleteCollection: async (collectionId) => {
    try {
      const { error } = await supabase
        .from("collections")
        .delete()
        .eq("id", collectionId);

      if (error) throw error;

      set((state) => ({
        collections: state.collections.filter((c) => c.id !== collectionId),
        // If the deleted collection was selected, switch to 'all'
        selectedCollection: state.selectedCollection === collectionId ? null : state.selectedCollection
      }));
      
      // Refresh bookmarks to handle those that were in this collection
      await get().fetchBookmarks();
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },

  addBookmark: async (bookmark) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const bookmarkData = {
        title: bookmark.title,
        url: bookmark.url,
        description: bookmark.description,
        collection_id: bookmark.collectionId === "all" ? null : bookmark.collectionId,
        favicon_url: bookmark.favicon || `https://www.google.com/s2/favicons?sz=64&domain_url=${bookmark.url}`,
        user_id: user.id,
      } as any; /* Using any to bypass potential strict type checks */

      // Insert bookmark
      const { data: newBookmark, error } = await supabase
        .from("bookmarks")
        .insert(bookmarkData)
        .select()
        .single();

      if (error) throw error;

      // Insert tags if any
      if (bookmark.tags && bookmark.tags.length > 0) {
        const tagInserts = bookmark.tags.map((tagId) => ({
          bookmark_id: newBookmark.id,
          tag_id: tagId,
        }));
        const { error: tagError } = await supabase.from("bookmark_tags").insert(tagInserts);
        if (tagError) throw tagError;
      }

      await get().fetchBookmarks();
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },
}));
