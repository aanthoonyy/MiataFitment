import * as THREE from "three";

import { makeWheels } from "./wheels";
import { makeTires } from "./tire";
import { axleSettings } from "./common/axleSettings";
import { calculateWheelPosition } from "./common/wheelPositionCalculator";
import { disposeObject } from "./common/disposeObject";
import { CORNERS, type CarModel } from "@/constants/wheelPositions";
import type { WheelDesign } from "@/constants/wheelDesigns";
import type { Settings } from "@/types/settings";

// A corner is a wheel and the tire around it, built, placed and torn down
// together. Everything here works on all four at once, because nothing in the
// scene ever wants just one.

export interface Corners {
    wheels: THREE.Object3D[];
    tires: THREE.Object3D[];
}

export const noCorners = (): Corners => ({ wheels: [], tires: [] });

const cornerObjects = (corners: Corners): THREE.Object3D[] => [
    ...corners.wheels,
    ...corners.tires,
];

export function buildCorners(
    settings: Settings,
    model: CarModel,
    design: WheelDesign,
): Corners {
    return {
        wheels: CORNERS.map((corner) => {
            const { wheelWidthIn, wheelDiameterIn } = axleSettings(corner, settings);
            return makeWheels(
                wheelWidthIn,
                wheelDiameterIn,
                corner,
                settings,
                model,
                design,
            );
        }),
        tires: CORNERS.map((corner) =>
            makeTires(corner, settings, model),
        ),
    };
}

export function addCorners(scene: THREE.Scene, corners: Corners): void {
    for (const object of cornerObjects(corners)) scene.add(object);
}

export function removeCorners(scene: THREE.Scene, corners: Corners): void {
    for (const object of cornerObjects(corners)) {
        scene.remove(object);
        disposeObject(object);
    }
}

// Puts every corner back where the settings say it belongs, undoing whatever
// the bounce left behind.
export function placeCorners(
    corners: Corners,
    settings: Settings,
    model: CarModel,
): void {
    CORNERS.forEach((corner, index) => {
        const { rotation, position } = calculateWheelPosition(
            corner,
            settings,
            model,
        );
        for (const object of [corners.wheels[index], corners.tires[index]]) {
            if (!object) continue;
            object.rotation.set(rotation.x, 0, rotation.z);
            object.position.set(position.x, position.y, position.z);
        }
    });
}
