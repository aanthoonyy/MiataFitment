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
        camber: front ? settings.frontCamberDeg : settings.rearCamberDeg,
        toe: front ? settings.frontToeRad : settings.rearToeRad,
        rideHeight: front ? settings.rideHeightFrontFt : settings.rideHeightRearFt,
        wheelDiameter: front
            ? settings.frontWheelDiameterIn
            : settings.rearWheelDiameterIn,
        wheelWidth: front ? settings.frontWheelWidthIn : settings.rearWheelWidthIn,
        wheelOffset: front
            ? settings.frontWheelOffsetMm
            : settings.rearWheelOffsetMm,
        wheelSpacer: front
            ? settings.frontWheelSpacerMm
            : settings.rearWheelSpacerMm,
        tireWidth: front ? settings.frontTireWidthMm : settings.rearTireWidthMm,
        tireSidewall: front
            ? settings.frontTireSidewallPct
            : settings.rearTireSidewallPct,
    };
}
