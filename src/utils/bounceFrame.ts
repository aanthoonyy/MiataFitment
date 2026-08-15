import { axleSettings } from "@/assets/common/axleSettings";
import rollingDiameter from "@/assets/common/rollingDiameter";
import {
    frontCamberFromHubToFender,
    hubToFenderAtRest,
    rearCamberFromHubToFender,
} from "./suspensionGeometry";
import type { WheelPosition } from "@/constants/wheelPositions";
import type { Settings } from "@/types/settings";

const INCHES_PER_FOOT = 12;

export interface CornerRotation {
    xRad: number;
    zRad: number;
}

// Compressing the suspension closes up hub-to-fender, and hub-to-fender drives
// camber, so a corner gains camber as the body drops. Only the change is
// applied on top of the user's setting: the static part is already in it.
//
// Deliberately not routed through calculateWheelPosition, which clamps camber
// to the slider's range. Mid-bounce camber can legitimately leave that range.
export function bounceCornerRotation(
    corner: WheelPosition,
    settings: Settings,
    bodyDropIn: number,
): CornerRotation {
    const isRear = corner.startsWith("B");
    const isLeft = corner.endsWith("L");

    const { camber, toe, rideHeight, wheelDiameter, tireWidth, tireSidewall } =
        axleSettings(corner, settings);

    const camberFromHubToFender = isRear
        ? rearCamberFromHubToFender
        : frontCamberFromHubToFender;

    const hubToFenderRestIn = hubToFenderAtRest(rideHeight, isRear);
    const camberDeltaDeg =
        camberFromHubToFender(hubToFenderRestIn - bodyDropIn) -
        camberFromHubToFender(hubToFenderRestIn);

    const camberRad = ((camber + camberDeltaDeg) * Math.PI) / 180;
    const toeRad =
        (rollingDiameter(wheelDiameter, tireWidth, tireSidewall) *
            Math.sin(isLeft ? toe : -toe)) /
        INCHES_PER_FOOT;

    return {
        xRad: isLeft ? Math.PI / 2 + camberRad : Math.PI / 2 - camberRad,
        zRad: toeRad,
    };
}
