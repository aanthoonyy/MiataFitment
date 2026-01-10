import * as React from "react";
import { Separator } from "@/components/ui/separator";
import { GarageProps } from "@/types/garage";
import { useGarage } from "@/hooks/useGarage";
import { GarageHeader } from "./GarageHeader";
import { GarageCard } from "./GarageCard";
import { ConfigList } from "./GarageConfigList";
import { EmptyState } from "./GarageEmptyState";
import { SaveConfigRow } from "./GarageSaveConfigRow";
import { useFitmentConfig } from "@/contexts/FitmentSettingsContext";
import { payloadToFitmentConfig } from "@/services/fitmentNormalize";

export const Garage: React.FC<GarageProps> = ({
  userId,
  maxSaves = 5,
  initialConfigs = [],
  onLoad,
  onDelete,
  onRename,
  onOverwrite,
}) => {
  const { setConfig, config } = useFitmentConfig();

  const g = useGarage({
    userId,
    maxSaves,
    initialConfigs,
    onLoad,
    onDelete,
    onRename,
    onOverwrite,
    getCurrentPayload: () => config,
  });

  const handleLoad = async (id: string) => {
    const row = g.configs.find((c) => c.id === id);
    if (!row) return;

    const next = payloadToFitmentConfig(row.payload);
    setConfig(next);
  };

  return (
    <GarageCard>
      <GarageHeader maxSaves={maxSaves} count={g.configs.length} />

      <Separator className="my-3" />

      <SaveConfigRow
        saveName={g.saveName}
        setSaveName={g.setSaveName}
        helperText={g.saveHelperText}
        canSave={g.canSaveName}
        nameTaken={g.nameTaken}
        isAtLimit={g.isAtLimit}
        saveOpen={g.saveOpen}
        setSaveOpen={g.setSaveOpen}
        onSave={g.handleSave}
        onOverwrite={g.handleOverwriteByName}
      />

      <Separator className="my-4" />

      {g.configs.length === 0 ? (
        <EmptyState />
      ) : (
        <ConfigList
          configs={g.configs}
          renameId={g.renameId}
          renameValue={g.renameValue}
          setRenameValue={g.setRenameValue}
          onLoad={handleLoad}
          onStartRename={g.startRename}
          onCommitRename={g.commitRename}
          onCancelRename={g.cancelRename}
          onDelete={g.handleDelete}
        />
      )}
    </GarageCard>
  );
};
