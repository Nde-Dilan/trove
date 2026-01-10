import { GalleryVerticalEnd } from "lucide-react";
import Link from "next/link";
import { LoginForm } from "@/components/login-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - Trove",
  description: "Access your Trove bookmark library. Secure and simple login.",
  openGraph: {
    title: "Login - Trove",
    description: "Access your Trove bookmark library. Secure and simple login.",
    type: "website",
    siteName: "Trove",
    url: process.env.NEXT_PUBLIC_APP_URL,
    images: [
      {
        url: `/og-image.png`,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Login - Trove",
    description: "Access your Trove bookmark library. Secure and simple login.",
    images: [
      {
        url: `/og-image.png`,
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10 bg-background">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl tracking-tight"
          >
            <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-lg">
              <GalleryVerticalEnd className="size-5" />
            </div>
            Trove
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block overflow-hidden border-l">
        <img
          src="/auth-hero.png"
          alt="Trove Dashboard Preview"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-primary/10 backdrop-blur-[2px]" />
      </div>
    </div>
  );
}
