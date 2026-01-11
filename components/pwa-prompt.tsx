"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

type PWAInstallPromptProps = {
  delayMs?: number;
};

const DISMISS_STORAGE_KEY = "trove_pwa_prompt_dismissed";

const isStandaloneMode = () => {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as any)?.standalone === true
  );
};

const PWAInstallPrompt = ({ delayMs = 10000 }: PWAInstallPromptProps) => {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [ready, setReady] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [standalone, setStandalone] = useState(false);

  // Load dismissal state from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    const wasDismissed = localStorage.getItem(DISMISS_STORAGE_KEY) === "true";
    setDismissed(wasDismissed);
    setStandalone(isStandaloneMode());
  }, []);

  // Delay before showing the prompt
  useEffect(() => {
    if (typeof window === "undefined") return;
    const timer = window.setTimeout(() => setReady(true), delayMs);
    return () => window.clearTimeout(timer);
  }, [delayMs]);

  // Listen for beforeinstallprompt event
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setInstallEvent(null);
      setDismissed(true);
      localStorage.setItem(DISMISS_STORAGE_KEY, "true");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installEvent) return;

    try {
      installEvent.prompt();
      const choice = await installEvent.userChoice;
      
      if (choice.outcome === "accepted") {
        setInstallEvent(null);
        setDismissed(true);
        localStorage.setItem(DISMISS_STORAGE_KEY, "true");
      }
    } catch (error) {
      console.error("Error during PWA installation:", error);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem(DISMISS_STORAGE_KEY, "true");
  };

  const shouldDisplay = ready && installEvent && !dismissed && !standalone;

  if (!shouldDisplay) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-4 z-50 flex justify-center px-4 animate-in slide-in-from-bottom-5 duration-500">
      <div className="flex w-full max-w-md flex-col gap-3 rounded-lg border border-border bg-background px-4 py-3 shadow-lg backdrop-blur-sm">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm text-foreground">
            Install the <strong>Trove</strong> app for a better experience and quick access 🚀
          </p>
          <Button
            size="icon"
            variant="ghost"
            onClick={handleDismiss}
            aria-label="Close"
            className="h-6 w-6 shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <Button
          size="sm"
          onClick={handleInstallClick}
          className="h-9 gap-2 w-full sm:w-auto"
        >
          <Download className="h-4 w-4" />
          Install
        </Button>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;