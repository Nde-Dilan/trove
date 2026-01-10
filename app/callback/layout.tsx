import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Callback - Trove",
};

export default function CallbackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
