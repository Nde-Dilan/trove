import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bookmarks - Trove",
  description: "View and manage your bookmarks in your personal library.",
};

export default function BookmarksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
