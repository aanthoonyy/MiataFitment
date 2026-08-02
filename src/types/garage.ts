export type SavedConfigPayload = {
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
};

export type SavedConfig = {
  id: string;
  name: string;
  updatedAt: string;
  payload?: SavedConfigPayload;
};

export type GarageProps = {
  userId: string;
  maxSaves?: number;
};
