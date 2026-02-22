import { Settings } from "@/types/settings";
import { getWheelPositions, WheelPosition as WheelPositionEnum, CarModel } from "../../constants/wheelPositions";
import rollingDiameter from "./rollingDiameter";

const mmToFeet = (mm: number) => mm / 25.4 / 12;

export type WheelPosition = "FL" | "FR" | "BL" | "BR";

export interface WheelPositionData {
    rotation: {
        x: number;
        z: number;
    };
    position: {
        x: number;
        y: number;
        z: number;
    };
}

export function calculateWheelPosition(
    position: WheelPosition, 
    settings: Settings,
    model: CarModel = "na" // Default to NA for backward compatibility
): WheelPositionData {
    const isFront = position.startsWith("F");
    const isLeft = position.endsWith("L");
    
    const camber = isFront ? settings.frontCamber : settings.rearCamber;
    const toe = isFront ? settings.frontToe : settings.rearToe;
    const wheelDiameter = isFront ? settings.frontWheelDiameter : settings.rearWheelDiameter;
    const tireWidth = isFront ? settings.frontTireWidth : settings.rearTireWidth;
    const tireSidewall = isFront ? settings.frontTireSidewall : settings.rearTireSidewall;
    const wheelOffset = isFront ? settings.frontWheelOffset : settings.rearWheelOffset;
    const wheelSpacer = isFront ? settings.frontWheelSpacer : settings.rearWheelSpacer;
    const rideHeight = isFront ? settings.rideHeightFront : settings.rideHeightRear;

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

    const camberRad = (Math.min(Math.max(camber, -20), 1) * Math.PI) / 180;
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