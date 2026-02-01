import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Settings } from "@/types/settings";
import { DEFAULT_SETTINGS } from "@/types/settings";

export type CarModel = "na" | "nb" | "nc" | "nd" | string;

export interface FitmentConfig {
  model: CarModel;
  settings: Settings;
}

interface FitmentStore {
  // State
  model: CarModel;
  settings: Settings;

  // Actions
  setModel: (model: CarModel) => void;
  updateSettings: (patch: Partial<Settings>) => void;
  resetSettings: () => void;
  loadConfig: (config: FitmentConfig) => void;
}

export const useFitmentStore = create<FitmentStore>()(
  persist(
    (set) => ({
      model: "na",
      settings: DEFAULT_SETTINGS,

      setModel: (model) => set({ model }),

      updateSettings: (patch) =>
        set((state) => ({
          settings: { ...state.settings, ...patch },
        })),

      resetSettings: () => set({ settings: DEFAULT_SETTINGS }),

      loadConfig: (config) =>
        set({
          model: config.model,
          settings: config.settings,
        }),
    }),
    {
      name: "fitment-storage",
    }
  )
);
