"use client";

import { useCallback, useSyncExternalStore } from "react";

export type ThemePreference = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

export const THEME_STORAGE_KEY = "theme";
const THEME_EVENT = "themechange";

function isThemePreference(value: string | null): value is ThemePreference {
  return value === "light" || value === "dark" || value === "system";
}

function getSystemTheme(): ResolvedTheme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getStoredPreference(): ThemePreference {
  try {
    const value = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isThemePreference(value) ? value : "system";
  } catch {
    return "system";
  }
}

function resolvePreference(preference: ThemePreference): ResolvedTheme {
  return preference === "system" ? getSystemTheme() : preference;
}

function applyResolvedTheme(resolvedTheme: ResolvedTheme) {
  document.documentElement.classList.toggle("dark", resolvedTheme === "dark");
  document.documentElement.style.colorScheme = resolvedTheme;
}

export function setThemePreference(preference: ThemePreference) {
  try {
    if (preference === "system") {
      window.localStorage.removeItem(THEME_STORAGE_KEY);
    } else {
      window.localStorage.setItem(THEME_STORAGE_KEY, preference);
    }
  } catch {
    // Ignore storage failures and still apply the requested theme for this page view.
  }

  applyResolvedTheme(resolvePreference(preference));
  window.dispatchEvent(new Event(THEME_EVENT));
}

function getSnapshot() {
  const preference = getStoredPreference();
  return `${preference}:${resolvePreference(preference)}`;
}

function getServerSnapshot() {
  return "system:light";
}

function subscribe(callback: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const onSystemThemeChange = () => {
    if (getStoredPreference() === "system") {
      applyResolvedTheme(getSystemTheme());
      callback();
    }
  };
  const onStorageChange = (event: StorageEvent) => {
    if (event.key === THEME_STORAGE_KEY) callback();
  };

  window.addEventListener(THEME_EVENT, callback);
  window.addEventListener("storage", onStorageChange);
  media.addEventListener("change", onSystemThemeChange);

  return () => {
    window.removeEventListener(THEME_EVENT, callback);
    window.removeEventListener("storage", onStorageChange);
    media.removeEventListener("change", onSystemThemeChange);
  };
}

export function useThemePreference() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [preference, resolvedTheme] = snapshot.split(":") as [ThemePreference, ResolvedTheme];

  const setPreference = useCallback((nextPreference: ThemePreference) => {
    setThemePreference(nextPreference);
  }, []);

  return { preference, resolvedTheme, setPreference };
}
