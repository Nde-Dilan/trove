"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/integrations/supabase/supabase";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  GalleryVerticalEnd,
  ArrowRight,
  Bookmark,
  Tag,
  Archive,
  Sparkles,
  Github,
} from "lucide-react";

export default function Home() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push("/bookmarks");
      } else {
        setLoading(false);
      }
    });

    // Listen for changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        router.push("/bookmarks");
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  if (loading && !session) {
    return null;
  }

  // Landing Page View (Not Logged In)
  return (
    <div className="flex min-h-svh flex-col bg-background selection:bg-primary/20">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 border-b bg-background/50 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5 font-bold text-xl tracking-tight">
            <div className="bg-primary text-primary-foreground flex size-9 items-center justify-center rounded-xl shadow-lg shadow-primary/10">
              <GalleryVerticalEnd size={20} />
            </div>
            Trove
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="hidden sm:flex gap-2"
            >
              <Link href="https://github.com" target="_blank">
                <Github size={18} />
                <span>View on GitHub</span>
              </Link>
            </Button>
            <ThemeToggle />
            <div className="w-px h-4 bg-border mx-1 hidden sm:block" />
            <Button size="sm" asChild className="px-5">
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center pt-32 pb-20 px-4 text-center relative overflow-hidden">
        {/* Dynamic Background */}
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-full max-w-[1000px] aspect-square bg-primary/5 rounded-full blur-[140px] -z-10 animate-pulse" />

        <div className="max-w-4xl space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 text-primary text-[10px] sm:text-xs font-bold tracking-[0.2em] border border-primary/10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Sparkles size={14} />
            ORGANIZE YOUR DIGITAL WORLD
          </div>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-foreground leading-[0.95] animate-in fade-in slide-in-from-bottom-8 duration-1000">
            Every link,{" "}
            <span className="italic font-serif text-primary/80">
              beautifully
            </span>{" "}
            archived.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground animate-in fade-in slide-in-from-bottom-10 duration-1000 max-w-2xl mx-auto leading-relaxed">
            The minimal bookmark manager designed for focused creators. Organize
            with elegance, synchronize with ease.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-in fade-in slide-in-from-bottom-12 duration-1000">
            <Button
              size="lg"
              className="px-10 h-14 text-md font-bold tracking-tight rounded-xl shadow-lg shadow-primary/10"
              asChild
            >
              <Link href="/register">
                Start your library
                <ArrowRight
                  size={20}
                  className="ml-2 group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </Button>
          </div>
        </div>

        {/* Hero Preview - Smart Light/Dark Screenshots */}
        <div className="mt-12 w-full max-w-6xl px-4 animate-in fade-in slide-in-from-bottom-16 duration-1000">
          <div className="relative group">
            {/* Ambient Glow */}
            <div className="absolute -inset-8 bg-primary/5 rounded-[3rem] blur-3xl opacity-0" />

            {/* Main Screenshot Container */}
            <div className="relative rounded-2xl overflow-hidden border border-border/50">
              {/* Light Mode Screenshot */}
              <img
                src="/dashboard-light.png"
                alt="Trove Dashboard Light Mode"
                className="w-full h-auto block dark:hidden"
              />
              {/* Dark Mode Screenshot */}
              <img
                src="/dashboard-dark.png"
                alt="Trove Dashboard Dark Mode"
                className="w-full h-auto hidden dark:block"
              />
            </div>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="mt-32 w-full max-w-6xl px-4 grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-16 duration-1000">
          {[
            {
              icon: Bookmark,
              title: "Smart Collections",
              desc: "Automatically categorize your links by project or theme.",
              color: "text-blue-500",
              bg: "bg-blue-500/10",
            },
            {
              icon: Tag,
              title: "Powerful Tagging",
              desc: "Deep tagging system to find any resource in milliseconds.",
              color: "text-purple-500",
              bg: "bg-purple-500/10",
            },
            {
              icon: Archive,
              title: "Clean Workspace",
              desc: "Stay focused with a clutter-free interface and smart archiving.",
              color: "text-emerald-500",
              bg: "bg-emerald-500/10",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="group p-8 rounded-[2rem] bg-card/40 backdrop-blur-sm border border-border/50 hover:border-primary/20 transition-all hover:translate-y-[-4px] text-left"
            >
              <div
                className={`size-12 rounded-2xl ${feature.bg} ${feature.color} flex items-center justify-center mb-6`}
              >
                <feature.icon size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-16 bg-muted/20">
        <div className="container mx-auto px-4 flex flex-col items-center gap-6">
          <div className="flex items-center gap-2.5 font-bold text-xl opacity-80">
            <div className="bg-primary text-primary-foreground p-2 rounded-lg">
              <GalleryVerticalEnd size={18} />
            </div>
            Trove
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground font-medium">
            <Link href="#" className="hover:text-primary transition-colors">
              Twitter
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              GitHub
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Privacy
            </Link>
          </div>
          <p className="text-xs text-muted-foreground/50 tabular-nums">
            © {new Date().getFullYear()} Trove. Designed for focus.
          </p>
        </div>
      </footer>
    </div>
  );
}
