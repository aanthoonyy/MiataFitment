import type * as THREE from "three";

// A .glb wheel design flattened into world space and split into its drawable
// pieces.
export interface WheelPart {
    geometry: THREE.BufferGeometry;
    material: THREE.Material | THREE.Material[];
}

export interface WheelModel {
    parts: WheelPart[];
    // Where this model's hub plate sits, as a fraction of overall width in from
    // the outboard flange. Measured, not configured.
    plateFraction: number;
}

interface BaseWheelPosition {
    x: number;
    z: number;
}

interface FrontWheelPosition extends BaseWheelPosition {
    casterOffset: number;
}

type RearWheelPosition = BaseWheelPosition;

// Where one corner sits on the car before any of the user's settings apply.
// Only the front pair carries a caster offset, so reading it needs a narrowing
// check rather than an assumption about which axle you are on.
export type WheelAnchor = FrontWheelPosition | RearWheelPosition;

export interface WheelPositions {
    FRONT: {
        LEFT: FrontWheelPosition;
        RIGHT: FrontWheelPosition;
    };
    REAR: {
        LEFT: RearWheelPosition;
        RIGHT: RearWheelPosition;
    };
}
