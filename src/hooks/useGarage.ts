import { GarageProps, SavedConfig } from "@/types/garage";
import React from "react";

export function useGarage({
  maxSaves,
  initialConfigs,
  onSave,
  onLoad,
  onDelete,
  onRename,
  onOverwrite,
}: Required<Pick<GarageProps, "maxSaves" | "initialConfigs">> &
  Omit<GarageProps, "maxSaves" | "initialConfigs">) {
  const [configs, setConfigs] = React.useState<SavedConfig[]>(initialConfigs);

  const [saveName, setSaveName] = React.useState("");
  const [saveOpen, setSaveOpen] = React.useState(false);

  const [renameId, setRenameId] = React.useState<string | null>(null);
  const [renameValue, setRenameValue] = React.useState("");

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
    if (nameTaken) return "A config with this name already exists — overwrite it?";
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

    await onSave?.(name);

    const now = new Date().toISOString();
    setConfigs((prev) => [
      {
        id: crypto.randomUUID(),
        name,
        payloadPreview: "NA • 15x8 • -3° camber (example)",
        updatedAt: now,
      },
      ...prev,
    ]);

    resetSave();
  };

  const handleLoad = async (id: string) => {
    await onLoad?.(id);
  };

  const handleDelete = async (id: string) => {
    await onDelete?.(id);
    setConfigs((prev) => prev.filter((c) => c.id !== id));
    // If you delete the one you're renaming, cancel rename cleanly
    if (renameId === id) {
      setRenameId(null);
      setRenameValue("");
    }
  };

  const startRename = (c: SavedConfig) => {
    setRenameId(c.id);
    setRenameValue(c.name);
  };

  const cancelRename = () => {
    setRenameId(null);
    setRenameValue("");
  };

  const commitRename = async () => {
    if (!renameId) return;

    const next = renameValue.trim();
    if (next.length < 2) return;

    const collision = configs.some(
      (c) => c.id !== renameId && c.name.toLowerCase() === next.toLowerCase()
    );
    if (collision) return;

    await onRename?.(renameId, next);

    setConfigs((prev) =>
      prev.map((c) =>
        c.id === renameId
          ? { ...c, name: next, updatedAt: new Date().toISOString() }
          : c
      )
    );

    cancelRename();
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
    renameId,
    renameValue,

    // derived
    isAtLimit,
    canSaveName,
    nameTaken,
    saveHelperText,

    // setters / actions
    setSaveName,
    setSaveOpen,
    setRenameValue,

    handleSave,
    handleLoad,
    handleDelete,

    startRename,
    cancelRename,
    commitRename,

    handleOverwriteByName,
  };
}