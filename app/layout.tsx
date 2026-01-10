import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster as Sonner } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Trove - Bookmarks Manager",
  description: "A simple and elegant bookmarks manager to organize your web discoveries.",
  openGraph: {
    title: "Trove - Bookmarks Manager",
    description: "A simple and elegant bookmarks manager to organize your web discoveries.",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "Trove",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Trove - Bookmarks Manager",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Trove - Bookmarks Manager",
    description: "A simple and elegant bookmarks manager to organize your web discoveries.",
    images: ["/og-image.png"],
    creator: "@trove",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Sonner
            position="top-right"
            expand={false}
            richColors
            toastOptions={{
              style: {
                borderRadius: "0.75rem",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
