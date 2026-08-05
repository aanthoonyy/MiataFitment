import type * as THREE from "three";

// The shape the rubber takes once it is mounted: everything about the section
// that depends on the rim it was pulled onto.
export interface Carcass {
    /** Quoted section width in inches, before the rim has its say. */
    nominalSectionWidth: number;
    beadHalfWidth: number;
    sectionHalfWidth: number;
    treadHalfWidth: number;
    /** Height of the widest point, 0 at the bead and 1 at the shoulder. */
    bulgeHeight: number;
    /** 0 for a relaxed carcass, towards 1 as the sidewall is pulled straight. */
    taut: number;
}

// The solved sidewall -> shoulder -> crown chain, in profile coordinates: x is
// radius, y is half width and runs negative on the outboard side.
export interface TreadChain {
    /** Radial rise from the bead to the point the sidewall hands over at. */
    sidewallSpan: number;
    handoverHeight: number;
    aimedCarcass: Carcass;
    shoulderRadius: number;
    crownRadius: number;
    shoulderCentre: THREE.Vector2;
    crownCentre: THREE.Vector2;
    /** Angle off radial at which the sidewall meets the shoulder. */
    joinAngle: number;
    /** Angular extent of the crown arc, measured off the tread centreline. */
    crownAngle: number;
}
