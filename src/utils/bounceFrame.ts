import { axleSettings } from "@/assets/common/axleSettings";
import rollingDiameter from "@/assets/common/rollingDiameter";
import { camberFromHubToFender, hubToFenderAtRest } from "./suspensionGeometry";
import {
    axleOf,
    isLeft as isLeftCorner,
    type WheelPosition,
} from "@/constants/wheelPositions";
import type { Settings } from "@/types/settings";
import { inchesToFeet } from "./unitConversions";

export interface CornerRotation {
    xRad: number;
    zRad: number;
}

// Compressing the suspension closes up hub-to-fender, and hub-to-fender drives
// camberDeg, so a corner gains camberDeg as the body drops. Only the change is
// applied on top of the user's setting: the static part is already in it.
//
// Deliberately not routed through calculateWheelPosition, which clamps camberDeg
// to the slider's range. Mid-bounce camberDeg can legitimately leave that range.
export function bounceCornerRotation(
    corner: WheelPosition,
    settings: Settings,
    bodyDropIn: number,
): CornerRotation {
    const axle = axleOf(corner);
    const isLeft = isLeftCorner(corner);

    const {
        camberDeg,
        toeRad,
        rideHeightFt,
        wheelDiameterIn,
        tireWidthMm,
        tireAspectRatio,
    } = axleSettings(corner, settings);

    const hubToFenderRestIn = hubToFenderAtRest(rideHeightFt, axle);
    const camberDeltaDeg =
        camberFromHubToFender(axle, hubToFenderRestIn - bodyDropIn) -
        camberFromHubToFender(axle, hubToFenderRestIn);

    const camberRad = ((camberDeg + camberDeltaDeg) * Math.PI) / 180;
    // Not an angle despite feeding a rotation: it is the toe swing measured
    // across the tire's rolling diameter, in feet. Preserved as-is because it
    // is what the scene has always been drawn with.
    const toeRotation = inchesToFeet(
        rollingDiameter(wheelDiameterIn, tireWidthMm, tireAspectRatio) *
            Math.sin(isLeft ? toeRad : -toeRad),
    );

    return {
        xRad: isLeft ? Math.PI / 2 + camberRad : Math.PI / 2 - camberRad,
        zRad: toeRotation,
    };
}
