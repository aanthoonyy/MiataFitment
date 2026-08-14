import { createHash } from "node:crypto";
import * as THREE from "three";

// Transcendental functions are not bit-identical across platforms or V8
// versions, so hashing raw floats would make a golden captured on one machine
// useless on another. Nine decimals sits far below any change a refactor can
// cause -- a vertex moving 1e-9 feet is a third of a nanometre -- and far above
// that noise.
const DIGEST_DECIMALS = 9;

// Enough to read a placement out of the golden file and recognise it, no more.
const LANDMARK_DECIMALS = 6;

export interface BoundsFt {
    minXFt: number;
    minYFt: number;
    minZFt: number;
    maxXFt: number;
    maxYFt: number;
    maxZFt: number;
}

export interface GeometryDigest {
    vertexCount: number;
    boundsFt: BoundsFt;
    digest: string;
}

export function quantize(value: number, decimals = DIGEST_DECIMALS): number {
    const rounded = Number(value.toFixed(decimals));
    // toFixed keeps the sign on negative zero, which would digest differently
    // from the positive zero an equivalent expression can produce.
    return Object.is(rounded, -0) ? 0 : rounded;
}

export const forReading = (value: number): number =>
    quantize(value, LANDMARK_DECIMALS);

export function digestNumbers(values: readonly number[]): string {
    const hash = createHash("sha256");
    for (const value of values) hash.update(`${quantize(value)};`);
    return hash.digest("hex");
}

// Constrained to records whose values are all numbers, rather than to an index
// signature, so a plain interface like AxleSettings satisfies it without having
// to be widened.
export function digestFields<T extends Record<keyof T, number>>(
    fields: T,
): Record<string, number> {
    const readable: Record<string, number> = {};
    for (const name of Object.keys(fields) as (keyof T & string)[]) {
        readable[name] = forReading(fields[name]);
    }
    return readable;
}

function emptyBounds(): BoundsFt {
    return {
        minXFt: 0,
        minYFt: 0,
        minZFt: 0,
        maxXFt: 0,
        maxYFt: 0,
        maxZFt: 0,
    };
}

// World space rather than local, so one digest covers the mesh's shape, the
// offsets of its children, and where the whole thing was placed on the car. A
// refactor that moves a corner shows up here even if the geometry is untouched.
export function digestWorldGeometry(object: THREE.Object3D): GeometryDigest {
    object.updateWorldMatrix(true, true);

    const coordinates: number[] = [];
    const bounds = new THREE.Box3().makeEmpty();
    const vertex = new THREE.Vector3();

    object.traverse((child) => {
        const mesh = child as THREE.Mesh;
        if (!mesh.isMesh) return;

        const positions = mesh.geometry.attributes
            .position as THREE.BufferAttribute;
        for (let index = 0; index < positions.count; index++) {
            vertex.fromBufferAttribute(positions, index);
            vertex.applyMatrix4(mesh.matrixWorld);
            coordinates.push(vertex.x, vertex.y, vertex.z);
            bounds.expandByPoint(vertex);
        }
    });

    return {
        vertexCount: coordinates.length / 3,
        boundsFt: bounds.isEmpty()
            ? emptyBounds()
            : {
                  minXFt: forReading(bounds.min.x),
                  minYFt: forReading(bounds.min.y),
                  minZFt: forReading(bounds.min.z),
                  maxXFt: forReading(bounds.max.x),
                  maxYFt: forReading(bounds.max.y),
                  maxZFt: forReading(bounds.max.z),
              },
        digest: digestNumbers(coordinates),
    };
}
