import milliMeterToInch from "./MilliMeterToInch";

export default function rollingDiameter(wheelDiameterIn: number, tireWidthMm: number, tireSidewallPct: number) {
    const sidewallHeightInInches = milliMeterToInch(tireWidthMm * (tireSidewallPct / 100));
    const totalDiameter = wheelDiameterIn + (2 * sidewallHeightInInches);
    return totalDiameter;
}