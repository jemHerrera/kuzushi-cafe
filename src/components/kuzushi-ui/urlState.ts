"use client";

import { useSyncExternalStore } from "react";

const historyChangeEvent = "kuzushi-history-change";
let isHistoryPatched = false;

export function useCurrentSearch() {
  return useSyncExternalStore(subscribeToHistory, getCurrentSearch, () => "");
}

export function writeBrowserUrl(url: string, mode: "push" | "replace") {
  patchHistoryEvents();
  if (mode === "replace") {
    window.history.replaceState(window.history.state, "", url);
    return;
  }
  window.history.pushState(window.history.state, "", url);
}

function getCurrentSearch() {
  return typeof window === "undefined" ? "" : window.location.search;
}

function subscribeToHistory(onStoreChange: () => void) {
  patchHistoryEvents();
  window.addEventListener(historyChangeEvent, onStoreChange);
  window.addEventListener("popstate", onStoreChange);
  return () => {
    window.removeEventListener(historyChangeEvent, onStoreChange);
    window.removeEventListener("popstate", onStoreChange);
  };
}

function patchHistoryEvents() {
  if (isHistoryPatched || typeof window === "undefined") return;
  isHistoryPatched = true;

  const patch = (method: "pushState" | "replaceState") => {
    const original = window.history[method];
    window.history[method] = function patchedHistoryMethod(...args) {
      const result = original.apply(this, args);
      window.dispatchEvent(new Event(historyChangeEvent));
      return result;
    };
  };

  patch("pushState");
  patch("replaceState");
}
