export type SavedConfigPayload =
  | {
      version?: number;
      model?: string;
      settings?: {
        frontCamber?: number;
        rearCamber?: number;
        frontToe?: number;
        rearToe?: number;
        frontCaster?: number;

        frontWheelWidth?: number;
        frontWheelDiameter?: number;
        frontWheelOffset?: number;
        frontWheelSpacer?: number;

        rearWheelWidth?: number;
        rearWheelDiameter?: number;
        rearWheelOffset?: number;
        rearWheelSpacer?: number;

        frontTireWidth?: number;
        frontTireSidewall?: number;
        rearTireWidth?: number;
        rearTireSidewall?: number;
      };
    }
  | any;

export type SavedConfig = {
  id: string;
  name: string;
  updatedAt: string;
  payload?: SavedConfigPayload;
  payloadPreview?: string;
};

export type GarageProps = {
  userId: string;

  maxSaves?: number;

  onSave?: (name: string) => Promise<void> | void;
  onLoad?: (id: string) => Promise<void> | void;
  onDelete?: (id: string) => Promise<void> | void;
  onRename?: (id: string, newName: string) => Promise<void> | void;
  onOverwrite?: (id: string, name: string) => Promise<void> | void;

  initialConfigs?: SavedConfig[];

  getCurrentPayload?: () => any;
};
