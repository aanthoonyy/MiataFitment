export type SavedConfig = {
  id: string;
  name: string;
  payloadPreview?: string;
  updatedAt: string; // ISO string
};

export type GarageProps = {
  maxSaves?: number;

  onSave?: (name: string) => Promise<void> | void;
  onLoad?: (id: string) => Promise<void> | void;
  onDelete?: (id: string) => Promise<void> | void;
  onRename?: (id: string, newName: string) => Promise<void> | void;
  onOverwrite?: (id: string, name: string) => Promise<void> | void;

  initialConfigs?: SavedConfig[];
};