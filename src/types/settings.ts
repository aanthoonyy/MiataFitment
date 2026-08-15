import { STOCK_RIDE_HEIGHT } from "@/utils/suspensionGeometry";
import { DEFAULT_SPRING_RATE_LB_IN } from "@/utils/bounceSimulation";

// A type alias rather than an interface on purpose: it gets an implicit index
// signature, which is what lets a Settings object be written straight into the
// loosely typed payload that goes to the database.
export type Settings = {
  frontCamberDeg: number;
  rearCamberDeg: number;
  frontCasterDeg: number;
  frontToeRad: number;
  rearToeRad: number;
  rideHeightFrontFt: number;
  rideHeightRearFt: number;
  springRateLbIn: number;
  frontTireWidthMm: number;
  frontTireAspectRatio: number;
  frontWheelWidthIn: number;
  frontWheelDiameterIn: number;
  frontWheelOffsetMm: number;
  frontWheelSpacerMm: number;
  rearTireWidthMm: number;
  rearTireAspectRatio: number;
  rearWheelWidthIn: number;
  rearWheelDiameterIn: number;
  rearWheelOffsetMm: number;
  rearWheelSpacerMm: number;
}

export const DEFAULT_SETTINGS: Settings = {
  frontCamberDeg: -0.5,
  rearCamberDeg: -0.5,
  frontCasterDeg: 5,
  frontToeRad: 0,
  rearToeRad: 0,

  // SuspensionSettings compares ride height against STOCK_RIDE_HEIGHT with
  // === to show the "Stock (…)" label, so these must stay exactly equal.
  rideHeightFrontFt: STOCK_RIDE_HEIGHT,
  rideHeightRearFt: STOCK_RIDE_HEIGHT,

  springRateLbIn: DEFAULT_SPRING_RATE_LB_IN,

  frontTireWidthMm: 185,
  frontTireAspectRatio: 60,

  frontWheelWidthIn: 6,
  frontWheelDiameterIn: 14,
  frontWheelOffsetMm: 45,
  frontWheelSpacerMm: 0,

  rearTireWidthMm: 185,
  rearTireAspectRatio: 60,

  rearWheelWidthIn: 6,
  rearWheelDiameterIn: 14,
  rearWheelOffsetMm: 45,
  rearWheelSpacerMm: 0,
};
