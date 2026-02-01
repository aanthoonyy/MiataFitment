import { create } from "zustand";

export type SettingsTab = "alignment" | "wheels" | "tires" | "car" | "account";

interface UIStore {
  // Settings panel state
  isSettingsOpen: boolean;
  activeTab: SettingsTab;

  // Match toggles
  matchWheels: boolean;
  matchTires: boolean;

  // Actions
  setSettingsOpen: (open: boolean) => void;
  toggleSettings: () => void;
  setActiveTab: (tab: SettingsTab) => void;
  setMatchWheels: (match: boolean) => void;
  setMatchTires: (match: boolean) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  isSettingsOpen: false,
  activeTab: "alignment",
  matchWheels: false,
  matchTires: false,

  setSettingsOpen: (open) => set({ isSettingsOpen: open }),
  toggleSettings: () => set((state) => ({ isSettingsOpen: !state.isSettingsOpen })),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setMatchWheels: (match) => set({ matchWheels: match }),
  setMatchTires: (match) => set({ matchTires: match }),
}));
