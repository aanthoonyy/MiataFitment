export interface Settings {
  frontCamber: number;
  rearCamber: number;
  frontCaster: number;
  frontToe: number;
  rearToe: number;
  rideHeightFront: number;
  rideHeightRear: number;
  frontTireWidth: number;
  frontTireSidewall: number;
  frontWheelWidth: number;
  frontWheelDiameter: number;
  frontWheelOffset: number;
  frontWheelSpacer: number;
  rearTireWidth: number;
  rearTireSidewall: number;
  rearWheelWidth: number;
  rearWheelDiameter: number;
  rearWheelOffset: number;
  rearWheelSpacer: number;
}

export const DEFAULT_SETTINGS: Settings = {
  frontCamber: -0.5,
  rearCamber: -0.5,
  frontCaster: 5,
  frontToe: 0,
  rearToe: 0,

  rideHeightFront: -2.65,
  rideHeightRear: -2.65,

  frontTireWidth: 185,
  frontTireSidewall: 60,

  frontWheelWidth: 6,
  frontWheelDiameter: 14,
  frontWheelOffset: 45,
  frontWheelSpacer: 0,

  rearTireWidth: 185,
  rearTireSidewall: 60,

  rearWheelWidth: 6,
  rearWheelDiameter: 14,
  rearWheelOffset: 45,
  rearWheelSpacer: 0,
};
