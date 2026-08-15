import * as THREE from "three";
import type { Settings } from "@/types/settings";
import type { CarModel, WheelPosition } from "@/constants/wheelPositions";
import rollingDiameter from "../common/rollingDiameter";
import { axleSettings } from "../common/axleSettings";
import { calculateWheelPosition } from "../common/wheelPositionCalculator";
import { mountCarcass } from "./carcass";
import { solveTreadChain } from "./treadChain";
import { tireProfile } from "./profile";

// Keep a sliver of sidewall even on absurd settings, so the profile can't
// invert.
const MIN_SIDEWALL_HEIGHT = 0.5;

const LATHE_SEGMENTS = 64;

const TIRE_COLOR = 0x202227;
const TIRE_ROUGHNESS = 0.5;
const TIRE_METALNESS = 0;
const TIRE_SPECULAR_INTENSITY = 0.1;

function makeTireMaterial() {
    const material = new THREE.MeshPhysicalMaterial({ color: TIRE_COLOR });
    material.roughness = TIRE_ROUGHNESS;
    material.metalness = TIRE_METALNESS;
    material.specularIntensity = TIRE_SPECULAR_INTENSITY;
    return material;
}

function placeOnAxle(
    tire: THREE.Mesh,
    position: WheelPosition,
    settings: Settings,
    model: CarModel,
) {
    const { rotation, position: offset } = calculateWheelPosition(
        position,
        settings,
        model,
    );
    tire.rotation.x = rotation.x;
    tire.rotation.z = rotation.z;
    tire.position.x = offset.x;
    tire.position.y = offset.y;
    tire.position.z = offset.z;
}

export function makeTires(
    position: WheelPosition,
    settings: Settings,
    model: CarModel = "na",
) {
    const { wheelDiameterIn, wheelWidthIn, tireWidthMm, tireSidewallPct } = axleSettings(
        position,
        settings,
    );

    const rimRadius = wheelDiameterIn / 2;
    const treadRadius = Math.max(
        rollingDiameter(wheelDiameterIn, tireWidthMm, tireSidewallPct) / 2,
        rimRadius + MIN_SIDEWALL_HEIGHT,
    );

    const carcass = mountCarcass(tireWidthMm, wheelWidthIn);
    const chain = solveTreadChain(carcass, rimRadius, treadRadius);

    const tire = new THREE.Mesh(
        new THREE.LatheGeometry(tireProfile(chain, rimRadius), LATHE_SEGMENTS),
        makeTireMaterial(),
    );
    placeOnAxle(tire, position, settings, model);
    return tire;
}
