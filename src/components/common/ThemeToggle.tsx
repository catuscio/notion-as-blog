"use client";

import { Button } from "@/components/ui/button";
import { useMounted } from "@/hooks/useMounted";
import { useThemePreference } from "@/hooks/useThemePreference";

function SunIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    >
      <path d="M20.99 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.78 9.79Z" />
    </svg>
  );
}

export function ThemeToggle() {
  const mounted = useMounted();
  const { resolvedTheme, setPreference } = useThemePreference();
  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => mounted && setPreference(isDark ? "light" : "dark")}
      className="rounded-full"
      aria-label="Toggle theme"
      aria-pressed={mounted ? isDark : undefined}
    >
      {mounted ? (isDark ? <SunIcon /> : <MoonIcon />) : <span className="inline-block h-5 w-5" />}
    </Button>
  );
}
