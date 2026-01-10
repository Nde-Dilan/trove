"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BookmarksSidebar } from "@/components/dashboard/sidebar";
import { BookmarksHeader } from "@/components/dashboard/header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { supabase } from "@/integrations/supabase/supabase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Loader2,
  Settings as SettingsIcon,
  Plus,
  Folder,
  Tag as TagIcon,
  Star,
  Heart,
  Music,
  Camera,
  Globe,
  Terminal,
  Briefcase,
  Cloud,
  Layers,
  Zap,
  Coffee,
  Trash2,
  Bookmark,
  Code,
  Palette,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { AddCollectionDialog } from "@/components/dashboard/add-collection-dialog";
import Image from "next/image";
import { useBookmarksStore } from "@/store/bookmarks-store";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog";

const collectionIconsMap: Record<string, React.ElementType> = {
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

export default function SettingsPage() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Profile Form State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updatingPassword, setUpdatingPassword] = useState(false);

  const { collections, bookmarks, tags, fetchInitialData, deleteCollection } =
    useBookmarksStore();

  const [isAddCollectionOpen, setIsAddCollectionOpen] = useState(false);
  const [collectionToDelete, setCollectionToDelete] = useState<string | null>(
    null
  );
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push("/login");
      } else {
        setSession(session);
        setLoading(false);
        if (session.user) {
          setFullName(session.user.user_metadata.full_name || "");
          setEmail(session.user.email || "");
          setAvatarUrl(session.user.user_metadata.avatar_url || "");
        }
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push("/login");
      } else {
        setSession(session);
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdatingProfile(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: fullName },
      });
      if (error) throw error;
      toast.success("Profile updated successfully");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword)
      return toast.error("Passwords do not match");
    setUpdatingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;
      toast.success("Password updated successfully");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast.error(error.message || "Failed to update password");
    } finally {
      setUpdatingPassword(false);
    }
  };

  const confirmDeleteCollection = async () => {
    if (!collectionToDelete) return;
    try {
      await deleteCollection(collectionToDelete);
      toast.success("Collection deleted successfully");
    } catch (error) {
      toast.error("Failed to delete collection");
    } finally {
      setIsDeleteOpen(false);
      setCollectionToDelete(null);
    }
  };

  if (loading && !session) return null;

  return (
    <>
      <SidebarProvider>
        <BookmarksSidebar />
        <div className="h-screen overflow-hidden lg:p-2 w-full flex flex-col bg-background">
          <div className="lg:border lg:rounded-md overflow-hidden flex flex-col bg-background shadow-xs h-full w-full">
            <BookmarksHeader title="Settings" />

            <div className="flex-1 w-full overflow-y-auto p-4 md:p-6 bg-muted/10">
              <Tabs defaultValue="overview" className="w-full space-y-6">
                <div className="w-full overflow-x-auto pb-1 no-scrollbar">
                  <TabsList className="bg-transparent p-0 h-auto space-x-2 flex min-w-max">
                    {["Overview", "Collections", "Information", "Password"].map(
                      (tab) => (
                        <TabsTrigger
                          key={tab}
                          value={tab.toLowerCase()}
                          className="data-[state=active]:bg-muted data-[state=active]:text-foreground bg-transparent text-muted-foreground rounded-md px-3 py-1.5 h-8 text-sm font-medium border border-transparent data-[state=active]:border-border transition-all whitespace-nowrap"
                        >
                          {tab}
                        </TabsTrigger>
                      )
                    )}
                  </TabsList>
                </div>

                <TabsContent value="overview" className="space-y-6 m-0">
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-1 space-y-6">
                      <Card className="overflow-hidden border-none shadow-md bg-linear-to-b from-primary/10 to-background">
                        <CardHeader className="text-center pb-2">
                          <Avatar className="size-20 mx-auto border-4 border-background">
                            <AvatarImage src={avatarUrl} />
                            <AvatarFallback className="text-xl bg-primary text-primary-foreground">
                              {fullName ? fullName[0] : "U"}
                            </AvatarFallback>
                          </Avatar>
                          <CardTitle className="mt-4 text-xl flex items-center justify-center gap-1.5 px-2">
                            <span className="truncate max-w-[150px]">
                              {fullName || "User"}
                            </span>
                            <Image
                              src="/Verified_Badge.svg"
                              alt="Verified"
                              width={16}
                              height={16}
                              className="size-4 shrink-0"
                            />
                          </CardTitle>
                          <CardDescription className="truncate px-2">
                            {email}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-4 border-t border-border/50 bg-background/50">
                          <div className="grid grid-cols-1 gap-4">
                            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                              <div className="flex items-center gap-3">
                                <div className="size-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600">
                                  <Bookmark className="size-4" />
                                </div>
                                <span className="text-sm font-medium">
                                  Bookmarks
                                </span>
                              </div>
                              <span className="text-sm font-bold">
                                {bookmarks.length}
                              </span>
                            </div>

                            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                              <div className="flex items-center gap-3">
                                <div className="size-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-600">
                                  <Folder className="size-4" />
                                </div>
                                <span className="text-sm font-medium">
                                  Collections
                                </span>
                              </div>
                              <span className="text-sm font-bold">
                                {collections.length}
                              </span>
                            </div>

                            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                              <div className="flex items-center gap-3">
                                <div className="size-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                                  <TagIcon className="size-4" />
                                </div>
                                <span className="text-sm font-medium">
                                  Tags
                                </span>
                              </div>
                              <span className="text-sm font-bold">
                                {tags.length}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="lg:col-span-3 space-y-6">
                      <Card className="h-full border-dashed border-2 flex flex-col items-center justify-center p-8 text-center bg-muted/5 min-h-[300px]">
                        <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6">
                          <SettingsIcon className="size-8 animate-pulse text-muted-foreground" />
                        </div>
                        <CardTitle className="text-2xl mb-2 text-foreground">
                          Welcome to your Space
                        </CardTitle>
                        <CardDescription className="max-w-md mx-auto text-base text-muted-foreground">
                          This is your central hub for managing your personal
                          library. Use the tabs above to organize your
                          collections, update your information, or secure your
                          account.
                        </CardDescription>
                        <div className="mt-8 flex flex-wrap justify-center gap-3">
                          <Button
                            variant="outline"
                            onClick={() => router.push("/bookmarks")}
                          >
                            Go to Dashboard
                          </Button>
                          <Button onClick={() => setIsAddCollectionOpen(true)}>
                            <Plus className="mr-2 size-4" /> New Collection
                          </Button>
                        </div>
                      </Card>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="collections" className="space-y-6 m-0">
                  <Card>
                    <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <CardTitle className="text-base">
                          My Collections
                        </CardTitle>
                        <CardDescription>
                          Manage and organize your bookmark collections.
                        </CardDescription>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => setIsAddCollectionOpen(true)}
                        className="w-full sm:w-auto"
                      >
                        <Plus className="mr-2 size-4" /> Add Collection
                      </Button>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow className="hover:bg-transparent border-none">
                              <TableHead className="pl-6 h-10">
                                Collection Name
                              </TableHead>
                              <TableHead className="h-10">Bookmarks</TableHead>
                              <TableHead className="h-10">
                                Created Date
                              </TableHead>
                              <TableHead className="h-10 text-right pr-6">
                                Action
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {collections.length === 0 ? (
                              <TableRow>
                                <TableCell
                                  colSpan={4}
                                  className="text-center py-10 text-muted-foreground"
                                >
                                  No collections found. Create your first one to
                                  get started!
                                </TableCell>
                              </TableRow>
                            ) : (
                              collections.map((collection) => {
                                const count = bookmarks.filter(
                                  (b) => b.collectionId === collection.id
                                ).length;
                                const IconComponent =
                                  (collection.icon &&
                                    collectionIconsMap[collection.icon]) ||
                                  Folder;
                                return (
                                  <TableRow
                                    key={collection.id}
                                    className="hover:bg-muted/50 border-border/50"
                                  >
                                    <TableCell className="pl-6 py-4 font-medium text-sm flex items-center gap-2">
                                      <div className="size-8 rounded-md flex items-center justify-center bg-primary/10 text-primary">
                                        <IconComponent className="size-4" />
                                      </div>
                                      {collection.name}
                                    </TableCell>
                                    <TableCell className="py-4 text-sm text-muted-foreground">
                                      {count} bookmarks
                                    </TableCell>
                                    <TableCell
                                      className="py-4 text-sm text-muted-foreground whitespace-nowrap"
                                      suppressHydrationWarning
                                    >
                                      {collection.created_at
                                        ? new Date(
                                            collection.created_at
                                          ).toLocaleDateString()
                                        : "N/A"}
                                    </TableCell>
                                    <TableCell className="py-4 text-right pr-6">
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                        onClick={() => {
                                          setCollectionToDelete(collection.id);
                                          setIsDeleteOpen(true);
                                        }}
                                      >
                                        <Trash2 className="size-4" />
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                );
                              })
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="information" className="space-y-6">
                  <div className="max-w-2xl mx-auto space-y-8 py-6">
                    <div className="space-y-6">
                      <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b">
                        <Avatar className="size-24 sm:size-32">
                          <AvatarImage src={avatarUrl} />
                          <AvatarFallback className="text-4xl">
                            {email?.[0]?.toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-center sm:text-left space-y-1">
                          <div className="flex items-center justify-center sm:justify-start gap-2">
                            <h3 className="text-2xl font-bold">
                              {fullName || "User"}
                            </h3>
                            <Image
                              src="/Verified_Badge.svg"
                              alt="Verified"
                              width={20}
                              height={20}
                              className="size-5"
                            />
                          </div>
                          <p className="text-muted-foreground">{email}</p>
                          <Badge variant="secondary" className="mt-2">
                            Pro Member
                          </Badge>
                        </div>
                      </div>

                      <form
                        onSubmit={handleUpdateProfile}
                        className="space-y-6"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="email-info">Email Address</Label>
                            <Input
                              id="email-info"
                              value={email}
                              disabled
                              className="bg-muted text-muted-foreground"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="fullName-info">Full Name</Label>
                            <Input
                              id="fullName-info"
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              placeholder="John Doe"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <Button type="submit" disabled={updatingProfile}>
                            {updatingProfile && (
                              <Loader2 className="mr-2 size-4 animate-spin" />
                            )}
                            Save Changes
                          </Button>
                        </div>
                      </form>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="password" className="space-y-6">
                  <div className="max-w-xl mx-auto space-y-8 py-6">
                    <div className="space-y-1">
                      <h2 className="text-xl font-bold">Update Password</h2>
                      <p className="text-sm text-muted-foreground">
                        Stay secure with a long, random password.
                      </p>
                    </div>
                    <form
                      onSubmit={handleUpdatePassword}
                      className="space-y-6 p-6 border rounded-lg bg-card/50"
                    >
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="newPassword">New Password</Label>
                          <Input
                            id="newPassword"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="••••••••"
                            minLength={6}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">
                            Confirm Password
                          </Label>
                          <Input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            minLength={6}
                          />
                        </div>
                      </div>
                      <Button
                        type="submit"
                        disabled={updatingPassword}
                        className="w-full"
                      >
                        {updatingPassword && (
                          <Loader2 className="mr-2 size-4 animate-spin" />
                        )}
                        Update Password
                      </Button>
                    </form>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>

        <AddCollectionDialog
          open={isAddCollectionOpen}
          onOpenChange={setIsAddCollectionOpen}
        />
        <DeleteConfirmDialog
          open={isDeleteOpen}
          onOpenChange={setIsDeleteOpen}
          onConfirm={confirmDeleteCollection}
          title="Delete Collection?"
          description="This action cannot be undone. All bookmarks in this collection will be moved to 'Uncategorized'."
          variant="permanent"
        />
      </SidebarProvider>
    </>
  );
}
