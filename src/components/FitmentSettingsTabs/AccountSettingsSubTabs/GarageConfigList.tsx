import type { SavedConfig } from "@/types/garage";
import { ConfigRow } from "./GarageConfigRow";

type ConfigListProps = {
  configs: SavedConfig[];

  onLoad: (id: string) => void;
  onDelete: (id: string) => void;
};

export function ConfigList({ configs, onLoad, onDelete }: ConfigListProps) {
  return (
    <div className="space-y-2">
      {configs.map((c) => (
        <ConfigRow
          key={c.id}
          config={c}
          onLoad={() => onLoad(c.id)}
          onDelete={() => onDelete(c.id)}
        />
      ))}
    </div>
  );
}
