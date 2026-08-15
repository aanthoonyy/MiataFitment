import { mmToInches } from "@/utils/unitConversions";

// Aspect ratio is quoted the way it is printed on the tire — 60 for a 185/60,
// not 0.6 — so it has to be scaled before it multiplies the section width.
const PERCENT = 100;

/** Overall tire diameter in inches, rim plus a sidewall at each end. */
export default function rollingDiameter(
    wheelDiameterIn: number,
    tireWidthMm: number,
    tireAspectRatio: number,
) {
    const sidewallHeightIn = mmToInches(tireWidthMm * (tireAspectRatio / PERCENT));
    return wheelDiameterIn + 2 * sidewallHeightIn;
}
