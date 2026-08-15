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
        camberDeg: front ? settings.frontCamberDeg : settings.rearCamberDeg,
        toeRad: front ? settings.frontToeRad : settings.rearToeRad,
        rideHeightFt: front ? settings.rideHeightFrontFt : settings.rideHeightRearFt,
        wheelDiameterIn: front
            ? settings.frontWheelDiameterIn
            : settings.rearWheelDiameterIn,
        wheelWidthIn: front ? settings.frontWheelWidthIn : settings.rearWheelWidthIn,
        wheelOffsetMm: front
            ? settings.frontWheelOffsetMm
            : settings.rearWheelOffsetMm,
        wheelSpacerMm: front
            ? settings.frontWheelSpacerMm
            : settings.rearWheelSpacerMm,
        tireWidthMm: front ? settings.frontTireWidthMm : settings.rearTireWidthMm,
        tireAspectRatio: front
            ? settings.frontTireAspectRatio
            : settings.rearTireAspectRatio,
    };
}
