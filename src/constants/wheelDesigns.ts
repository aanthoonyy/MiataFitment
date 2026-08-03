// Wheel designs are a visual choice layered on top of the fitment geometry:
// every design occupies the same space the default one does, so nothing about
// sizing, positioning or the bounce simulation changes when you switch.
export const WHEEL_DESIGNS = [
  { value: "default", label: "Default" },
  { value: "advan", label: "Super Advan" },
  { value: "sp1", label: "SP1" },
] as const;

export type WheelDesign = (typeof WHEEL_DESIGNS)[number]["value"];

export const DEFAULT_WHEEL_DESIGN: WheelDesign = "default";
