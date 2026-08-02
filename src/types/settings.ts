import { STOCK_RIDE_HEIGHT } from "@/utils/suspensionGeometry";
import { DEFAULT_SPRING_RATE_LB_IN } from "@/utils/bounceSimulation";

export interface Settings {
  frontCamber: number;
  rearCamber: number;
  frontCaster: number;
  frontToe: number;
  rearToe: number;
  rideHeightFront: number;
  rideHeightRear: number;
  springRateLbIn: number;
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

  // SuspensionSettings compares ride height against STOCK_RIDE_HEIGHT with
  // === to show the "Stock (…)" label, so these must stay exactly equal.
  rideHeightFront: STOCK_RIDE_HEIGHT,
  rideHeightRear: STOCK_RIDE_HEIGHT,

  springRateLbIn: DEFAULT_SPRING_RATE_LB_IN,

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
