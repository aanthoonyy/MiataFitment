import { create } from "zustand";
import {
  createGarageConfig,
  listGarageConfigs,
  deleteGarageConfig,
  updateGarageConfig,
} from "@/services/garageAPI";
import type { GarageStore } from "@/types/stores";


// Derived state selectors (use these to prevent re-renders)
export const selectIsAtLimit = (state: GarageStore) =>
  state.configs.length >= state.maxSaves;

export const selectCanSaveName = (state: GarageStore) =>
  state.saveName.trim().length >= 2;

export const selectNameTaken = (state: GarageStore) =>
  state.configs.some(
    (c) => c.name.toLowerCase() === state.saveName.trim().toLowerCase()
  );

export const selectSaveHelperText = (state: GarageStore) => {
  const nameTaken = selectNameTaken(state);
  const isAtLimit = selectIsAtLimit(state);

  if (nameTaken)
    return "A config with this name already exists — overwrite it?";
  if (isAtLimit)
    return `You've hit the ${state.maxSaves}-save limit. Delete one to save a new config.`;
  return "Tip: include wheel/tire/alignment in the name.";
};

export const useGarageStore = create<GarageStore>((set, get) => ({
  configs: [],
  saveName: "",
  saveDialogOpen: false,
  loading: false,
  maxSaves: 5,

  setConfigs: (configs) => set({ configs }),
  setSaveName: (name) => set({ saveName: name }),
  setSaveDialogOpen: (open) => set({ saveDialogOpen: open }),
  setMaxSaves: (max) => set({ maxSaves: max }),

  fetchConfigs: async (userId) => {
    if (!userId) return;

    set({ loading: true });
    try {
      const rows = await listGarageConfigs(userId);
      set({ configs: rows });
    } catch (e) {
      console.error("Failed to load garage configs", e);
    } finally {
      set({ loading: false });
    }
  },

  saveConfig: async (userId, name, payload) => {
    if (!userId) return;

    const state = get();
    const trimmedName = name.trim();

    if (!trimmedName || trimmedName.length < 2) return;
    if (selectNameTaken(state)) return;
    if (selectIsAtLimit(state)) return;

    try {
      const saved = await createGarageConfig({
        userId,
        name: trimmedName,
        payload,
      });

      set((s) => ({
        configs: [{ ...saved, payload }, ...s.configs],
      }));

      get().resetSaveDialog();
    } catch (e) {
      console.error("Garage save failed", { userId, name }, e);
    }
  },

  overwriteConfig: async (configId, payload) => {
    if (!configId) return;

    try {
      const updated = await updateGarageConfig({ id: configId, payload });

      set((s) => ({
        configs: s.configs.map((c) =>
          c.id === configId ? { ...c, ...updated, payload } : c
        ),
      }));

      get().resetSaveDialog();
    } catch (e) {
      console.error("Garage overwrite failed", { configId }, e);
    }
  },

  deleteConfig: async (configId) => {
    try {
      await deleteGarageConfig(configId);
      set((state) => ({
        configs: state.configs.filter((c) => c.id !== configId),
      }));
    } catch (e) {
      console.error("Garage delete failed", { configId }, e);
    }
  },

  resetSaveDialog: () => {
    set({ saveName: "", saveDialogOpen: false });
  },
}));
