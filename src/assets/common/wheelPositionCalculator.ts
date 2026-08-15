import { Settings } from "@/types/settings";
import {
    cornerAnchor,
    isLeft as isLeftCorner,
    type CarModel,
    type WheelPosition,
} from "@/constants/wheelPositions";
import rollingDiameter from "./rollingDiameter";
import { axleSettings } from "./axleSettings";
import { clampCamber } from "@/utils/suspensionGeometry";
import type { WheelPositionData } from "@/types/fitment";

const mmToFeet = (mm: number) => mm / 25.4 / 12;
const INCHES_PER_FOOT = 12;

export function calculateWheelPosition(
    position: WheelPosition,
    settings: Settings,
    model: CarModel = "na", // Default to NA for backward compatibility
): WheelPositionData {
    const isLeft = isLeftCorner(position);

    const {
        camberDeg,
        toeRad,
        rideHeightFt,
        wheelDiameterIn,
        wheelOffsetMm,
        wheelSpacerMm,
        tireWidthMm,
        tireSidewallPct,
    } = axleSettings(position, settings);

    // Caster rakes the front wheels fore and aft; there is no rear equivalent,
    // so the rear anchor simply has no offset to read.
    const anchor = cornerAnchor(model, position);
    const casterShift =
        "casterOffset" in anchor
            ? mmToFeet(settings.frontCasterDeg / anchor.casterOffset)
            : 0;

    const camberRad = (clampCamber(camberDeg) * Math.PI) / 180;
    const toeRadiusComp =
        (rollingDiameter(wheelDiameterIn, tireWidthMm, tireSidewallPct) *
            Math.sin(isLeft ? toeRad : -toeRad)) /
        INCHES_PER_FOOT;

    const offset = mmToFeet(isLeft ? -wheelOffsetMm : wheelOffsetMm);
    const spacer = mmToFeet(isLeft ? wheelSpacerMm : -wheelSpacerMm);

    return {
        rotation: {
            x: isLeft ? Math.PI / 2 + camberRad : Math.PI / 2 - camberRad,
            z: toeRadiusComp,
        },
        position: {
            x: anchor.x - casterShift,
            y: rideHeightFt,
            z: anchor.z + offset + spacer,
        },
    };
}
