import type { Settings } from "@/types/settings";
import type { WheelPosition } from "@/constants/wheelPositions";
import type { AxleFitment } from "@/types/fitment";

export function axleFitment(
    position: WheelPosition,
    settings: Settings,
): AxleFitment {
    const isFront = position.startsWith("F");
    return {
        wheelDiameter: isFront
            ? settings.frontWheelDiameter
            : settings.rearWheelDiameter,
        wheelWidth: isFront ? settings.frontWheelWidth : settings.rearWheelWidth,
        tireWidth: isFront ? settings.frontTireWidth : settings.rearTireWidth,
        tireSidewall: isFront
            ? settings.frontTireSidewall
            : settings.rearTireSidewall,
    };
}
