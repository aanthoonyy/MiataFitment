import { create } from "zustand";
import type { UIStore } from "@/types/stores";

export const useUIStore = create<UIStore>((set) => ({
  isSettingsOpen: false,
  activeTab: "alignment",
  bounceRequested: false,

  setSettingsOpen: (open) => set({ isSettingsOpen: open }),
  toggleSettings: () => set((state) => ({ isSettingsOpen: !state.isSettingsOpen })),
  setActiveTab: (tab) => set({ activeTab: tab }),
  requestBounce: () => set({ bounceRequested: true }),
  clearBounceRequest: () => set({ bounceRequested: false }),
}));
