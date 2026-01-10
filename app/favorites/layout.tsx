import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Favorites - Trove",
};

export default function FavoritesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
