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
  frontCamber: -4.1,
  rearCamber: -4.1,
  frontCaster: 5,
  frontToe: 0,
  rearToe: 0,
  rideHeightFront: -2.51,
  rideHeightRear: -2.51,
  frontTireWidth: 185,
  frontTireSidewall: 55,
  frontWheelWidth: 8.5,
  frontWheelDiameter: 14,
  frontWheelOffset: -7,
  frontWheelSpacer: 5,
  rearTireWidth: 185,
  rearTireSidewall: 55,
  rearWheelWidth: 8.5,
  rearWheelDiameter: 14,
  rearWheelOffset: -7,
  rearWheelSpacer: 0,
}; 