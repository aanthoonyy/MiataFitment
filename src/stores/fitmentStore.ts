import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Settings } from "@/types/settings";
import { DEFAULT_SETTINGS } from "@/types/settings";
import type { CarModel } from "@/constants/wheelPositions";

export type { CarModel };

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
      merge: (persistedState, currentState) => {
        const typedState = persistedState as FitmentStore | undefined;
        if (!typedState) return currentState;
        const legacyHz = (typedState.settings as { springRateHz?: number })
          ?.springRateHz;
        const legacySpringRateLbIn =
          typeof legacyHz === "number" && Number.isFinite(legacyHz)
            ? Math.round(Math.pow(2 * Math.PI * legacyHz, 2) * 68)
            : undefined;
        return {
          ...currentState,
          ...typedState,
          settings: {
            ...DEFAULT_SETTINGS,
            ...(typedState.settings ?? {}),
            springRateLbIn:
              typedState.settings?.springRateLbIn ??
              legacySpringRateLbIn ??
              DEFAULT_SETTINGS.springRateLbIn,
          },
        };
      },
    }
  )
);
