import type { Settings } from "@/types/settings";
import { isFront, type WheelPosition } from "@/constants/wheelPositions";
import type { AxleSettings } from "@/types/fitment";

// The one place front/rear gets picked apart. Every consumer takes the whole
// slice, so a new paired setting is added here once rather than in each caller.
export function axleSettings(
    position: WheelPosition,
    settings: Settings,
): AxleSettings {
    const front = isFront(position);
    return {
        camber: front ? settings.frontCamber : settings.rearCamber,
        toe: front ? settings.frontToe : settings.rearToe,
        rideHeight: front ? settings.rideHeightFront : settings.rideHeightRear,
        wheelDiameter: front
            ? settings.frontWheelDiameter
            : settings.rearWheelDiameter,
        wheelWidth: front ? settings.frontWheelWidth : settings.rearWheelWidth,
        wheelOffset: front
            ? settings.frontWheelOffset
            : settings.rearWheelOffset,
        wheelSpacer: front
            ? settings.frontWheelSpacer
            : settings.rearWheelSpacer,
        tireWidth: front ? settings.frontTireWidth : settings.rearTireWidth,
        tireSidewall: front
            ? settings.frontTireSidewall
            : settings.rearTireSidewall,
    };
}
