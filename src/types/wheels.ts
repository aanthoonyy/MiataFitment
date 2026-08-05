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

// All measurements are in feet (1 unit = 1 foot in Three.js).
interface BaseWheelPosition {
    x: number;
    z: number;
}

interface FrontWheelPosition extends BaseWheelPosition {
    casterOffset: number;
}

interface RearWheelPosition extends BaseWheelPosition {}

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
