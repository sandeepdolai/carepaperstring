"use client";

import { create } from "zustand";

type Overlay = "none" | "profile" | "newsletter";

interface SiteState {
  /** whether intro loader has finished */
  ready: boolean;
  setReady: (v: boolean) => void;
  overlay: Overlay;
  setOverlay: (o: Overlay) => void;
  toggleOverlay: (o: Overlay) => void;
}

export const useSite = create<SiteState>((set) => ({
  ready: false,
  setReady: (v) => set({ ready: v }),
  overlay: "none",
  setOverlay: (o) => set({ overlay: o }),
  toggleOverlay: (o) =>
    set((s) => ({ overlay: s.overlay === o ? "none" : o })),
}));
