import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Settings } from "@/types/settings";
import type { CarModel, WheelPosition } from "@/constants/wheelPositions";
import type { WheelDesign } from "@/constants/wheelDesigns";
import { calculateWheelPosition } from "./common/wheelPositionCalculator";

// --- knobs for fitting a .glb design onto the default wheel ---------------

// 1 means the model's bounding box exactly fills the nominal wheel size, so it
// occupies the same space the default barrel cylinders do. Real wheels measure
// ~1" over nominal across the flanges, so nudge these up if it reads small
// inside the tire. Shared by every .glb design.
const DIAMETER_FIT = 1.02;
const WIDTH_FIT = 1.02;

// The default wheel's plate sits on the centreline, so that's where the face
// goes. Turning this on moves it to where offset actually puts the mounting
// face, which makes the wheel dish as offset changes.
const PLATE_FOLLOWS_OFFSET = false;
const MAX_PLATE_FRACTION_OF_HALF_WIDTH = 0.9;

interface WheelModelConfig {
    path: string;
    // Where this model's own hub plate sits, as a fraction of overall width in
    // from the outboard flange. It's the plane pinned to the default wheel's
    // plate, so it needs to be roughly right. Read it off the model as the
    // point where the vertex radius drops to zero, i.e. the hub bore.
    plateFraction: number;
    // Which end of the model's axle carries the spoke face.
    outboardEnd: "min" | "max";
}

// Every design but "default" is a .glb. Typing it against WheelDesign makes
// adding one to WHEEL_DESIGNS without a model here a compile error.
const WHEEL_MODELS: Record<Exclude<WheelDesign, "default">, WheelModelConfig> = {
    advan: {
        path: "/superadvan.glb",
        plateFraction: 0.28,
        outboardEnd: "min",
    },
    sp1: {
        path: "/sp1.glb",
        plateFraction: 0.25,
        outboardEnd: "min",
    },
};

// -------------------------------------------------------------------------

interface WheelPart {
    geometry: THREE.BufferGeometry;
    material: THREE.Material | THREE.Material[];
}

// One fetch, parse and normalise per design, shared by all four corners, and
// only for designs actually selected.
const wheelModelPromises = new Map<string, Promise<WheelPart[]>>();

// Bakes the .glb into a canonical shape the fitter can work in: Y is the axle
// with +Y outboard, Y runs 0 (inboard flange) to 1 (outboard flange), and the
// radial axes are centred on the axle with a max radius of 1. Doing this once
// means re-exporting the model at a different orientation or scale costs
// nothing.
function normalizeWheelModel(
    scene: THREE.Object3D,
    config: WheelModelConfig,
): WheelPart[] {
    scene.updateWorldMatrix(true, true);

    const parts: WheelPart[] = [];
    scene.traverse((child) => {
        const mesh = child as THREE.Mesh;
        if (!mesh.isMesh) return;
        const geometry = mesh.geometry.clone();
        geometry.applyMatrix4(mesh.matrixWorld);
        parts.push({ geometry, material: mesh.material });
    });

    const box = new THREE.Box3();
    for (const part of parts) {
        part.geometry.computeBoundingBox();
        box.union(part.geometry.boundingBox!);
    }
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    // A wheel is always narrower than it is round, so the shortest side of the
    // bounding box is the axle.
    const toAxleY = new THREE.Matrix4();
    let axleLength: number;
    let radialLength: number;
    if (size.x <= size.y && size.x <= size.z) {
        toAxleY.makeRotationZ(Math.PI / 2);
        axleLength = size.x;
        radialLength = Math.max(size.y, size.z);
    } else if (size.y <= size.z) {
        axleLength = size.y;
        radialLength = Math.max(size.x, size.z);
    } else {
        toAxleY.makeRotationX(-Math.PI / 2);
        axleLength = size.z;
        radialLength = Math.max(size.x, size.y);
    }
    if (config.outboardEnd === "min") {
        toAxleY.premultiply(new THREE.Matrix4().makeRotationX(Math.PI));
    }

    const normalize = new THREE.Matrix4()
        .multiply(new THREE.Matrix4().makeTranslation(0, 0.5, 0))
        .multiply(
            new THREE.Matrix4().makeScale(
                2 / radialLength,
                1 / axleLength,
                2 / radialLength,
            ),
        )
        .multiply(toAxleY)
        .multiply(
            new THREE.Matrix4().makeTranslation(-center.x, -center.y, -center.z),
        );

    for (const part of parts) part.geometry.applyMatrix4(normalize);
    return parts;
}

function loadWheelModel(
    design: Exclude<WheelDesign, "default">,
): Promise<WheelPart[]> {
    const config = WHEEL_MODELS[design];
    let promise = wheelModelPromises.get(design);
    if (!promise) {
        promise = new Promise((resolve, reject) => {
            new GLTFLoader().load(
                config.path,
                (gltf) => resolve(normalizeWheelModel(gltf.scene, config)),
                undefined,
                (error) => reject(error),
            );
        });
        wheelModelPromises.set(design, promise);
    }
    return promise;
}

// Pins the model's hub plate to plateY and grows the barrel and lip out from
// there to the flanges, rather than scaling the whole thing as one block. That
// keeps the face where the default wheel's plate is at any width, and leaves
// room for the plate to track offset later.
function fitWheelModel(
    parts: WheelPart[],
    wheelWidth: number,
    wheelDiameter: number,
    plateY: number,
    plateFraction: number,
) {
    // Same units as the default wheel: scene units are feet, specs are inches.
    const halfWidth = ((wheelWidth / 2) * WIDTH_FIT) / 12;
    const radius = ((wheelDiameter / 2) * DIAMETER_FIT) / 12;
    const plateLimit = halfWidth * MAX_PLATE_FRACTION_OF_HALF_WIDTH;
    const plate = THREE.MathUtils.clamp(plateY, -plateLimit, plateLimit);

    // Normalised axle coordinate of the model's plate, from the inboard flange.
    const plateAt = 1 - plateFraction;

    const group = new THREE.Group();
    for (const part of parts) {
        const geometry = part.geometry.clone();
        const position = geometry.attributes.position as THREE.BufferAttribute;

        for (let i = 0; i < position.count; i++) {
            const a = position.getY(i);
            const y =
                a >= plateAt
                    ? plate + ((a - plateAt) / (1 - plateAt)) * (halfWidth - plate)
                    : -halfWidth + (a / plateAt) * (plate + halfWidth);
            position.setXYZ(
                i,
                position.getX(i) * radius,
                y,
                position.getZ(i) * radius,
            );
        }

        position.needsUpdate = true;
        // The stretch is non-uniform, so the baked normals no longer match the
        // surface. Hard edges survive because the export splits vertices there.
        geometry.computeVertexNormals();
        group.add(new THREE.Mesh(geometry, part.material));
    }
    return group;
}

export function makeWheels(
    wheelWidth: number,
    wheelDiameter: number,
    position: WheelPosition,
    settings: Settings,
    model: CarModel = "na",
    design: WheelDesign = "default"
) {
    const wheelGeometry = new THREE.CylinderGeometry(7/12, 7/12, 0.01/12, 32);
    const wheelMaterial = new THREE.MeshBasicMaterial({color: 0xC0C0C0, transparent: true, opacity: 0.5});
    const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);

    const sideCylinderGeometry = new THREE.CylinderGeometry(
        (wheelDiameter/2)/12,
        (wheelDiameter/2)/12,
        (wheelWidth/2)/12,
        32
    );
    const sideCylinderMaterial = new THREE.MeshPhysicalMaterial({color: 0xFFFFFF});
    sideCylinderMaterial.roughness = 0.2;
    sideCylinderMaterial.metalness = .5;
    sideCylinderMaterial.specularIntensity = 1;
    sideCylinderMaterial.clearcoat = 1;
    sideCylinderMaterial.clearcoatRoughness = 0.1;

    const sideCylinder1 = new THREE.Mesh(sideCylinderGeometry, sideCylinderMaterial);
    sideCylinder1.position.y = (wheelWidth/4)/12;
    wheel.add(sideCylinder1);

    const sideCylinder2 = new THREE.Mesh(sideCylinderGeometry, sideCylinderMaterial);
    sideCylinder2.position.y = -(wheelWidth/4)/12;
    wheel.add(sideCylinder2);

    // Calculate wheel position and rotation
    const wheelData = calculateWheelPosition(position, settings, model);

    // Apply position and rotation
    wheel.rotation.x = wheelData.rotation.x;
    wheel.rotation.z = wheelData.rotation.z;
    wheel.position.x = wheelData.position.x;
    wheel.position.y = wheelData.position.y;
    wheel.position.z = wheelData.position.z;

    if (design !== "default") {
        // Everything above stays exactly where it is -- sizing, placement and
        // the bounce simulation all still read off these meshes. The default
        // design just stops being drawn.
        wheelMaterial.visible = false;
        sideCylinder1.visible = false;
        sideCylinder2.visible = false;

        const isLeft = position.endsWith("L");
        const wheelOffset = position.startsWith("F")
            ? settings.frontWheelOffset
            : settings.rearWheelOffset;
        // The plate mesh sits at the wheel's centreline, so y = 0 is the plate.
        const plateY = PLATE_FOLLOWS_OFFSET ? wheelOffset / 25.4 / 12 : 0;

        // The model arrives after this returns; the caller has already placed
        // the wheel by then, so it just pops in a frame later.
        loadWheelModel(design)
            .then((parts) => {
                const fitted = fitWheelModel(
                    parts,
                    wheelWidth,
                    wheelDiameter,
                    plateY,
                    WHEEL_MODELS[design].plateFraction,
                );
                // Both sides get the same rotation onto the axle, so local +Y
                // points outboard on the left of the car and inboard on the
                // right. Spin the right side round to keep the face outside.
                if (!isLeft) fitted.rotation.x = Math.PI;
                wheel.add(fitted);
            })
            .catch((error) =>
                console.error(
                    "Failed to load wheel model",
                    WHEEL_MODELS[design].path,
                    error,
                ),
            );
    }

    return wheel;
}
