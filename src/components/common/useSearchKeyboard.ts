"use client";

import { useEffect, useCallback } from "react";
import type { Post } from "@/types";

interface UseSearchKeyboardOptions {
  inputRef: React.RefObject<HTMLInputElement | null>;
  results: Post[];
  activeIndex: number;
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
  onOpen: () => void;
  onClose: () => void;
  onSelect: (post: Post) => void;
}

export function useSearchKeyboard({
  inputRef,
  results,
  activeIndex,
  setActiveIndex,
  onOpen,
  onClose,
  onSelect,
}: UseSearchKeyboardOptions) {
  // Global keyboard shortcut: Cmd/Ctrl+K to focus search
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        onOpen();
      }
      if (e.key === "Escape") {
        onClose();
        inputRef.current?.blur();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [inputRef, onOpen, onClose]);

  // Input-specific keyboard navigation
  const handleInputKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) => Math.min(prev + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) => Math.max(prev - 1, -1));
      } else if (
        e.key === "Enter" &&
        activeIndex >= 0 &&
        results[activeIndex]
      ) {
        e.preventDefault();
        onSelect(results[activeIndex]);
      }
    },
    [results, activeIndex, setActiveIndex, onSelect]
  );

  return { handleInputKeyDown };
}
