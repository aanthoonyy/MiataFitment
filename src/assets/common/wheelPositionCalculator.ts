import { Settings } from "@/types/settings";
import {
  getWheelPositions,
  type CarModel,
  type WheelPosition,
} from "@/constants/wheelPositions";
import rollingDiameter from "./rollingDiameter";
import { axleSettings } from "./axleSettings";
import { clampCamber } from "@/utils/suspensionGeometry";
import type { WheelPositionData } from "@/types/fitment";

const mmToFeet = (mm: number) => mm / 25.4 / 12;

export function calculateWheelPosition(
    position: WheelPosition, 
    settings: Settings,
    model: CarModel = "na" // Default to NA for backward compatibility
): WheelPositionData {
    const isFront = position.startsWith("F");
    const isLeft = position.endsWith("L");

    const {
        camber,
        toe,
        rideHeight,
        wheelDiameter,
        wheelOffset,
        wheelSpacer,
        tireWidth,
        tireSidewall,
    } = axleSettings(position, settings);

    const wheelPositions = getWheelPositions(model);
    let baseX: number;
    let baseZ: number;

    if (isFront) {
        const frontWheelPos = isLeft ? wheelPositions.FRONT.LEFT : wheelPositions.FRONT.RIGHT;
        baseX = frontWheelPos.x - mmToFeet(settings.frontCaster / frontWheelPos.casterOffset);
        baseZ = frontWheelPos.z;
    } else {
        const rearWheelPos = isLeft ? wheelPositions.REAR.LEFT : wheelPositions.REAR.RIGHT;
        baseX = rearWheelPos.x;
        baseZ = rearWheelPos.z;
    }

    const camberRad = (clampCamber(camber) * Math.PI) / 180;
    const toeRadiusComp = (rollingDiameter(wheelDiameter, tireWidth, tireSidewall) * 
        Math.sin(isLeft ? toe : -toe)) / 12;

    const offset = mmToFeet(isLeft ? -wheelOffset : wheelOffset);
    const spacer = mmToFeet(isLeft ? wheelSpacer : -wheelSpacer);
    const zPos = baseZ + offset + spacer;

    return {
        rotation: {
            x: isLeft ? Math.PI / 2 + camberRad : Math.PI / 2 - camberRad,
            z: toeRadiusComp
        },
        position: {
            x: baseX,
            y: rideHeight,
            z: zPos
        }
    };
} 