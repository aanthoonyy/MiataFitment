import milliMeterToInch from "./MilliMeterToInch";

export default function rollingDiameter(wheelDiameter: number, tireWidth: number, tireSideWall: number) {
    const sidewallHeightInInches = milliMeterToInch(tireWidth * (tireSideWall / 100));
    const totalDiameter = wheelDiameter + (2 * sidewallHeightInInches);
    return totalDiameter;
}