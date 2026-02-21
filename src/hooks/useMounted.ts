"use client";

import { useSyncExternalStore } from "react";

const subscribeNoop = () => () => {};
const getMounted = () => true;
const getServerMounted = () => false;

/** Returns `true` only after client-side hydration is complete. */
export function useMounted(): boolean {
  return useSyncExternalStore(subscribeNoop, getMounted, getServerMounted);
}
