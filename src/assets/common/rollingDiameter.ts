import { mmToInches } from "@/utils/unitConversions";

const PERCENT = 100;

/** Overall tire diameter in inches, rim plus a sidewall at each end. */
export default function rollingDiameter(
    wheelDiameterIn: number,
    tireWidthMm: number,
    tireSidewallPct: number,
) {
    const sidewallHeightIn = mmToInches(tireWidthMm * (tireSidewallPct / PERCENT));
    return wheelDiameterIn + 2 * sidewallHeightIn;
}
