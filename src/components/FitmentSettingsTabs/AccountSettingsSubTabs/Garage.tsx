import * as React from "react";
import { Separator } from "@/components/ui/separator";
import type { GarageProps } from "@/types/garage";
import {
  useGarageStore,
  selectIsAtLimit,
  selectCanSaveName,
  selectNameTaken,
  selectSaveHelperText,
} from "@/stores/garageStore";
import { useFitmentStore } from "@/stores/fitmentStore";
import { GarageHeader } from "./GarageHeader";
import { GarageCard } from "./GarageCard";
import { ConfigList } from "./GarageConfigList";
import { EmptyState } from "./GarageEmptyState";
import { SaveConfigRow } from "./GarageSaveConfigRow";
import { payloadToFitmentConfig } from "@/services/fitmentNormalize";

export const Garage: React.FC<GarageProps> = ({
  userId,
  maxSaves = 5,
  onLoad,
  onDelete,
  onOverwrite,
}) => {
  const loadConfig = useFitmentStore((s) => s.loadConfig);
  const model = useFitmentStore((s) => s.model);
  const settings = useFitmentStore((s) => s.settings);

  const configs = useGarageStore((s) => s.configs);
  const saveName = useGarageStore((s) => s.saveName);
  const saveOpen = useGarageStore((s) => s.saveDialogOpen);
  const setSaveName = useGarageStore((s) => s.setSaveName);
  const setSaveOpen = useGarageStore((s) => s.setSaveDialogOpen);
  const setMaxSaves = useGarageStore((s) => s.setMaxSaves);
  const fetchConfigs = useGarageStore((s) => s.fetchConfigs);
  const saveConfig = useGarageStore((s) => s.saveConfig);
  const deleteConfig = useGarageStore((s) => s.deleteConfig);
  const updateConfigLocally = useGarageStore((s) => s.updateConfigLocally);
  const resetSaveDialog = useGarageStore((s) => s.resetSaveDialog);

  // Derived selectors
  const isAtLimit = useGarageStore(selectIsAtLimit);
  const canSaveName = useGarageStore(selectCanSaveName);
  const nameTaken = useGarageStore(selectNameTaken);
  const saveHelperText = useGarageStore(selectSaveHelperText);

  // Set max saves on mount/change
  React.useEffect(() => {
    setMaxSaves(maxSaves);
  }, [maxSaves, setMaxSaves]);

  // Fetch configs on mount
  React.useEffect(() => {
    if (userId) {
      fetchConfigs(userId);
    }
  }, [userId, fetchConfigs]);

  const handleSave = async () => {
    if (!userId) return;
    const currentConfig = { model, settings };
    await saveConfig(userId, saveName, currentConfig, "Saved config");
  };

  const handleLoad = async (id: string) => {
    const row = configs.find((c) => c.id === id);
    if (!row) return;

    const next = payloadToFitmentConfig(row.payload);
    loadConfig(next);
    await onLoad?.(id);
  };

  const handleDelete = async (id: string) => {
    await onDelete?.(id);
    await deleteConfig(id);
  };

  const handleOverwriteByName = async () => {
    const name = saveName.trim();
    if (!name || name.length < 2) return;

    const existing = configs.find(
      (c) => c.name.toLowerCase() === name.toLowerCase()
    );
    if (!existing) return;

    await onOverwrite?.(existing.id, name);

    updateConfigLocally(existing.id, {
      updatedAt: new Date().toISOString(),
      payloadPreview: "Updated current config",
    });

    resetSaveDialog();
  };

  return (
    <GarageCard>
      <GarageHeader maxSaves={maxSaves} count={configs.length} />

      <Separator className="my-3" />

      <SaveConfigRow
        saveName={saveName}
        setSaveName={setSaveName}
        helperText={saveHelperText}
        canSave={canSaveName}
        nameTaken={nameTaken}
        isAtLimit={isAtLimit}
        saveOpen={saveOpen}
        setSaveOpen={setSaveOpen}
        onSave={handleSave}
        onOverwrite={handleOverwriteByName}
      />

      <Separator className="my-4" />

      {configs.length === 0 ? (
        <EmptyState />
      ) : (
        <ConfigList
          configs={configs}
          onLoad={handleLoad}
          onDelete={handleDelete}
        />
      )}
    </GarageCard>
  );
};
