import {
  createGarageConfig,
  listGarageConfigs,
  deleteGarageConfig,
} from "@/services/garageAPI";
import { GarageProps, SavedConfig } from "@/types/garage";
import React from "react";

export function useGarage({
  userId,
  maxSaves,
  initialConfigs,
  onLoad,
  onDelete,
  onOverwrite,
  getCurrentPayload,
}: Required<Pick<GarageProps, "maxSaves" | "initialConfigs">> &
  Omit<GarageProps, "maxSaves" | "initialConfigs">) {
  const [configs, setConfigs] = React.useState<SavedConfig[]>(initialConfigs);

  const [saveName, setSaveName] = React.useState("");
  const [saveOpen, setSaveOpen] = React.useState(false);


  React.useEffect(() => {
    if (!userId) return;

    let cancelled = false;

    (async () => {
      try {
        const rows = await listGarageConfigs(userId);
        if (!cancelled) setConfigs(rows);
      } catch (e) {
        console.error("Failed to load garage configs", e);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  const isAtLimit = configs.length >= maxSaves;

  const canSaveName = saveName.trim().length >= 2;
  const nameTaken = React.useMemo(
    () =>
      configs.some(
        (c) => c.name.toLowerCase() === saveName.trim().toLowerCase()
      ),
    [configs, saveName]
  );

  const saveHelperText = React.useMemo(() => {
    if (nameTaken)
      return "A config with this name already exists — overwrite it?";
    if (isAtLimit)
      return `You’ve hit the ${maxSaves}-save limit. Delete one to save a new config.`;
    return "Tip: include wheel/tire/alignment in the name.";
  }, [nameTaken, isAtLimit, maxSaves]);

  const resetSave = () => {
    setSaveName("");
    setSaveOpen(false);
  };

  const handleSave = async () => {
    const name = saveName.trim();
    if (!name || name.length < 2) return;
    if (nameTaken) return;
    if (isAtLimit) return;
    if (!userId) return;

    try {
      const payload = getCurrentPayload?.() ?? { version: 1, example: true };

      const saved = await createGarageConfig({
        userId,
        name,
        payload,
        payloadPreview: "Example saved config",
      });

      setConfigs((prev) => [{ ...saved, payload }, ...prev]);

      resetSave();
    } catch (e) {
      console.error("Garage save failed", { userId, name }, e);
    }
  };

  const handleLoad = async (id: string) => {
    try {
      await onLoad?.(id);
    } catch (error) {
      console.error("error in handle load", onload);
    }
  };

  const handleDelete = async (id: string) => {
    if (!userId) return;

    try {
      await onDelete?.(id);

      await deleteGarageConfig(id);

      setConfigs((prev) => prev.filter((c) => c.id !== id));

    } catch (e) {
      console.error("Garage delete failed", { id }, e);
    }
  };

  const handleOverwriteByName = async () => {
    const name = saveName.trim();
    if (!name || name.length < 2) return;

    const existing = configs.find(
      (c) => c.name.toLowerCase() === name.toLowerCase()
    );
    if (!existing) return;

    await onOverwrite?.(existing.id, name);

    setConfigs((prev) =>
      prev.map((c) =>
        c.id === existing.id
          ? {
              ...c,
              updatedAt: new Date().toISOString(),
              payloadPreview: "Updated current config (example)",
            }
          : c
      )
    );

    resetSave();
  };

  return {
    // state
    configs,
    saveName,
    saveOpen,

    // derived
    isAtLimit,
    canSaveName,
    nameTaken,
    saveHelperText,

    // setters / actions
    setSaveName,
    setSaveOpen,

    handleSave,
    handleLoad,
    handleDelete,

    handleOverwriteByName,
  };
}
