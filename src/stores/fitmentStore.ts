import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_SETTINGS } from "@/types/settings";
import type { CarModel } from "@/constants/wheelPositions";
import { DEFAULT_WHEEL_DESIGN } from "@/constants/wheelDesigns";
import { SPRING_MASS } from "@/utils/bounceSimulation";
import type { FitmentStore } from "@/types/stores";

export type { CarModel };

export const useFitmentStore = create<FitmentStore>()(
  persist(
    (set) => ({
      model: "na",
      settings: DEFAULT_SETTINGS,
      wheelDesign: DEFAULT_WHEEL_DESIGN,

      setModel: (model) => set({ model }),

      setWheelDesign: (design) => set({ wheelDesign: design }),

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
        // Inverse of omega = sqrt(k / m) — recover lb/in from a legacy Hz value.
        const legacySpringRateLbIn =
          typeof legacyHz === "number" && Number.isFinite(legacyHz)
            ? Math.round(Math.pow(2 * Math.PI * legacyHz, 2) * SPRING_MASS)
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
