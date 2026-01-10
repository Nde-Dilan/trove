import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Archive - Trove",
};

export default function ArchiveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
