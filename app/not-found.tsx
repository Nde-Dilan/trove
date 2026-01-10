"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { GalleryVerticalEnd, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[600px] aspect-square bg-primary/5 rounded-full blur-[120px] -z-10" />

      <div className="max-w-md w-full text-center space-y-8 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="space-y-2">
          <h1 className="text-9xl font-black tracking-tighter text-primary/10 select-none leading-none">
            404
          </h1>
          <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Lost in the archives?
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              The page you're looking for was moved, deleted, or never existed
              in your Trove.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Button
            variant="outline"
            className="px-6 w-full sm:w-auto gap-2"
            onClick={() => router.back()}
          >
            <ArrowLeft size={18} />
            Go Back
          </Button>
          <Button className="px-6 w-full sm:w-auto shadow-primary/20" asChild>
            <Link href="/" className="gap-2">
              <Home size={18} />
              Return Home
            </Link>
          </Button>
        </div>
      </div>

      {/* Footer-like element */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 font-bold text-sm tracking-tight opacity-20">
        <GalleryVerticalEnd size={14} />
        Trove
      </div>
    </div>
  );
}
