import type { SavedConfig } from "@/types/garage";
import { ConfigRow } from "./GarageConfigRow";

type ConfigListProps = {
  configs: SavedConfig[];
  renameId: string | null;

  renameValue: string;
  setRenameValue: (v: string) => void;

  onLoad: (id: string) => void;
  onStartRename: (c: SavedConfig) => void;
  onCommitRename: () => void;
  onCancelRename: () => void;
  onDelete: (id: string) => void;
};

export function ConfigList({
  configs,
  renameId,
  renameValue,
  setRenameValue,
  onLoad,
  onStartRename,
  onCommitRename,
  onCancelRename,
  onDelete,
}: ConfigListProps) {
  return (
    <div className="space-y-2">
      {configs.map((c) => (
        <ConfigRow
          key={c.id}
          config={c}
          isRenaming={renameId === c.id}
          renameValue={renameValue}
          setRenameValue={setRenameValue}
          onLoad={() => onLoad(c.id)}
          onStartRename={() => onStartRename(c)}
          onCommitRename={onCommitRename}
          onCancelRename={onCancelRename}
          onDelete={() => onDelete(c.id)}
        />
      ))}
    </div>
  );
}
