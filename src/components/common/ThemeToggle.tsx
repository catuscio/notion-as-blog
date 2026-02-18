"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => mounted && setTheme(theme === "dark" ? "light" : "dark")}
      className="rounded-full"
      aria-label="Toggle theme"
    >
      <span className="material-symbols-outlined text-[20px]">
        {mounted ? (theme === "dark" ? "light_mode" : "dark_mode") : "dark_mode"}
      </span>
    </Button>
  );
}
