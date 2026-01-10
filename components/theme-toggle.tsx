"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";
import { flushSync } from "react-dom";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  // Function to sync the meta tag
  const updateThemeColor = (theme: string) => {
    const color = theme === "dark" ? "#000000" : "#ffffff";

    // Target all theme-color meta tags
    const metas = document.querySelectorAll('meta[name="theme-color"]');
    if (metas.length > 0) {
      metas.forEach((m) => ((m as HTMLMetaElement).content = color));
    } else {
      const newMeta = document.createElement("meta");
      newMeta.name = "theme-color";
      newMeta.content = color;
      document.head.appendChild(newMeta);
    }
  };

  // Sync on mount and every time resolvedTheme changes (system or manual)
  useEffect(() => {
    if (resolvedTheme) {
      updateThemeColor(resolvedTheme);
    }
  }, [resolvedTheme]);

  function toggleTheme() {
    const nextTheme = isDark ? "light" : "dark";

    // Force immediate state update for the next logic
    flushSync(() => {
      setTheme(nextTheme);
    });

    updateThemeColor(nextTheme);
  }

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme}>
      <Sun className="size-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-foreground" />
      <Moon className="absolute size-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-foreground" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
