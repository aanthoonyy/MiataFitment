import type { Settings } from "@/types/settings";
import type { WheelPosition } from "@/constants/wheelPositions";
import type { AxleSettings } from "@/types/fitment";

// The one place front/rear gets picked apart. Every consumer takes the whole
// slice, so a new paired setting is added here once rather than in each caller.
export function axleSettings(
    position: WheelPosition,
    settings: Settings,
): AxleSettings {
    const isFront = position.startsWith("F");
    return {
        camber: isFront ? settings.frontCamber : settings.rearCamber,
        toe: isFront ? settings.frontToe : settings.rearToe,
        rideHeight: isFront ? settings.rideHeightFront : settings.rideHeightRear,
        wheelDiameter: isFront
            ? settings.frontWheelDiameter
            : settings.rearWheelDiameter,
        wheelWidth: isFront ? settings.frontWheelWidth : settings.rearWheelWidth,
        wheelOffset: isFront
            ? settings.frontWheelOffset
            : settings.rearWheelOffset,
        wheelSpacer: isFront
            ? settings.frontWheelSpacer
            : settings.rearWheelSpacer,
        tireWidth: isFront ? settings.frontTireWidth : settings.rearTireWidth,
        tireSidewall: isFront
            ? settings.frontTireSidewall
            : settings.rearTireSidewall,
    };
}
