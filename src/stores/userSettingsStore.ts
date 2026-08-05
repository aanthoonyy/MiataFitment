import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getUserSettings, saveUserSettings } from "@/services/userSettingsAPI";
import type { UserSettingsStore } from "@/types/stores";


export const useUserSettingsStore = create<UserSettingsStore>()(
  persist(
    (set, get) => ({
      darkMode: false,
      metric: false,
      loading: false,
      saving: false,
      error: null,

      fetchSettings: async (userId) => {
        if (!userId) return;

        set({ loading: true, error: null });

        try {
          const row = await getUserSettings(userId);
          if (row) {
            set({ darkMode: row.darkMode, metric: row.metric });
          }
        } catch (e) {
          set({ error: e });
          console.error("Failed to load user settings", e);
        } finally {
          set({ loading: false });
        }
      },

      setDarkMode: async (value, userId) => {
        const prev = get().darkMode;
        set({ darkMode: value });

        if (!userId) return;

        set({ saving: true, error: null });

        try {
          await saveUserSettings({
            userId,
            darkMode: value,
            metric: get().metric,
          });
        } catch (e) {
          set({ darkMode: prev, error: e });
          console.error("Failed to save user settings", e);
        } finally {
          set({ saving: false });
        }
      },

      setMetric: async (value, userId) => {
        const prev = get().metric;
        set({ metric: value });

        if (!userId) return;

        set({ saving: true, error: null });

        try {
          await saveUserSettings({
            userId,
            darkMode: get().darkMode,
            metric: value,
          });
        } catch (e) {
          set({ metric: prev, error: e });
          console.error("Failed to save user settings", e);
        } finally {
          set({ saving: false });
        }
      },

      toggleDarkMode: async (userId) => {
        const { darkMode, setDarkMode } = get();
        return setDarkMode(!darkMode, userId);
      },

      toggleMetric: async (userId) => {
        const { metric, setMetric } = get();
        return setMetric(!metric, userId);
      },
    }),
    {
      name: "user-settings-storage",
      partialize: (state) => ({
        darkMode: state.darkMode,
        metric: state.metric,
      }),
    }
  )
);
