"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/integrations/supabase/supabase";
import { GalleryVerticalEnd, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Supabase handle automatically the tokens from URL hash
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("Auth callback error:", error.message);
          toast.error("Authentication failed. Please try again.");
          // Wait 2 seconds before redirecting on error
          await new Promise((resolve) => setTimeout(resolve, 2000));
          router.push("/login");
          return;
        }

        if (session) {
          toast.success("Successfully signed in with GitHub!");
          // Wait 5 seconds before redirecting to show loading screen
          await new Promise((resolve) => setTimeout(resolve, 5000));
          router.push("/bookmarks");
        } else {
          // If no session, redirect to login
          await new Promise((resolve) => setTimeout(resolve, 2000));
          router.push("/login");
        }
      } catch (error: any) {
        console.error("Unexpected error:", error);
        toast.error("An error occurred during authentication.");
        await new Promise((resolve) => setTimeout(resolve, 2000));
        router.push("/login");
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-background relative overflow-hidden">
      <div className="flex flex-col items-center gap-10 text-center px-4 relative z-10">
        {/* Brand Logo Section */}
        <div className="flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="bg-primary text-primary-foreground flex size-10 items-center justify-center rounded-lg">
            <GalleryVerticalEnd className="size-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Trove
          </h1>
        </div>

        {/* Status Card */}
        <div className="w-full max-w-sm bg-card border border-border/50 rounded-lg p-8 space-y-8 animate-in fade-in zoom-in duration-1000 delay-300">
          <div className="flex flex-col items-center gap-6">
            <div className="relative flex size-20 items-center justify-center">
              <div className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin" />
              <div className="size-16 rounded-full bg-muted flex items-center justify-center border">
                <Sparkles className="size-7 text-primary" />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                Authenticating...
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed px-2">
                Securely connecting to your account and synchronizing your
                digital library.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 py-3 px-6 bg-muted border rounded-lg">
            <Loader2 className="size-4 animate-spin text-primary" />
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Setting up your space
            </span>
          </div>
        </div>

        <p className="text-[10px] text-muted-foreground/40 max-w-[250px] italic">
          Please wait while we prepare your encrypted dashboard. You will be
          redirected automatically.
        </p>
      </div>
    </div>
  );
}
