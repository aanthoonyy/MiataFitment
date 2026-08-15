import * as THREE from "three";
import type { Carcass } from "@/types/tire";

// --- how the carcass reacts to the rim it's mounted on --------------------
//
// A tire's quoted section width only holds on its "measuring rim". Mount it
// wider and the sidewalls get pulled taut: the widest point slides down towards
// the bead, the tread tucks inside the rim flanges, and the bulge disappears --
// stretch. Mount it narrower and the sidewalls balloon outwards, the widest
// point climbs towards the shoulder, and the tread rounds over.
//
// Everything here is worked in inches, and in the cross section only: nothing
// in this file knows the wheel's diameter or where the corner sits on the car.

const MM_PER_INCH = 25.4;

// Measuring rim runs about 1.5" under the section width. Checks out against the
// published figures: 185 -> 5.8" (5.5 actual), 205 -> 6.6" (6.5), 225 -> 7.4"
// (7.5).
const MEASURING_RIM_DROP = 1.5;
const MIN_MEASURING_RIM = 3;

// Industry rule of thumb: section width moves ~10mm per inch of rim width away
// from the measuring rim.
const SECTION_WIDTH_PER_RIM_INCH = 10 / MM_PER_INCH;
const MIN_SECTION_WIDTH = 1;

// Tread is always narrower than the section width -- the widest part of a tire
// is its sidewall, not its contact patch. Measured against the width the tire
// was BUILT at, never the width it ends up at once mounted: the belt package is
// a fixed lump of steel and rubber, so pulling the bead out onto a wider rim
// moves the sidewalls and leaves the tread where it was.
const TREAD_WIDTH_RATIO = 0.82;
// The shoulder has to stay inside the widest point of the carcass, even for a
// tire squeezed onto a rim far too narrow for it.
const MAX_TREAD_TO_SECTION = 0.95;

// Stretching also lifts the shoulders slightly off the road, taking a little
// tread width with them. Small, but it sharpens the look.
const TREAD_LIFT_PER_RIM_INCH = 0.02;
const MAX_TREAD_LIFT = 0.12;

// Height of the widest point up the sidewall, 0 at the bead and 1 at the
// shoulder. Half way on the measuring rim, sliding down as the rim widens.
export const NEUTRAL_BULGE_HEIGHT = 0.5;
const BULGE_HEIGHT_PER_RIM_INCH = 0.12;
const MIN_BULGE_HEIGHT = 0.15;
const MAX_BULGE_HEIGHT = 0.8;

// Sliding the widest point down is only half of stretch. Pulling the bead out
// onto a wider rim also puts the sidewall in tension, and a taut membrane is
// straight -- so everything above the widest point flattens into one long run
// up to the shoulder. That straight run over a short hook off the bead is the J
// a stretched tire makes in section; a relaxed carcass keeps its belly and
// makes a C. Straightens the easing above the widest point towards linear.
const SIDEWALL_TAUT_PER_RIM_INCH = 0.35;
// Never dead straight: even a hard stretch leaves a little belly in the cords.
const MAX_SIDEWALL_TAUT = 0.95;

// --- easings ---------------------------------------------------------------

const smoothstep = (t: number) => t * t * (3 - 2 * t);

// The easing used above the widest point, from round to straight. Since the
// radius climbs linearly with h, a linear width against h is a dead straight
// line in section -- so tautness really does straighten the sidewall rather
// than just redistributing where it curves.
export const tautEase = (u: number, taut: number) =>
    THREE.MathUtils.lerp(smoothstep(u), u, taut);
export const tautEaseSlope = (u: number, taut: number) =>
    THREE.MathUtils.lerp(6 * u * (1 - u), 1, taut);

// --- the carcass -----------------------------------------------------------

export function mountCarcass(tireWidthMm: number, wheelWidthIn: number): Carcass {
    const nominalSectionWidth = tireWidthMm / MM_PER_INCH;
    const measuringRim = Math.max(
        MIN_MEASURING_RIM,
        nominalSectionWidth - MEASURING_RIM_DROP,
    );
    // Positive when mounted wider than the tire was measured on: stretch.
    const rimDelta = wheelWidthIn - measuringRim;

    const sectionHalfWidth =
        Math.max(
            nominalSectionWidth + rimDelta * SECTION_WIDTH_PER_RIM_INCH,
            MIN_SECTION_WIDTH,
        ) / 2;
    // Off the nominal width, not the mounted one, so the contact patch stays
    // put while the rim pulls the sidewalls out from under it. That gap is the
    // whole visual of stretch.
    const treadLift = THREE.MathUtils.clamp(
        rimDelta * TREAD_LIFT_PER_RIM_INCH,
        0,
        MAX_TREAD_LIFT,
    );
    return {
        nominalSectionWidth,
        beadHalfWidth: wheelWidthIn / 2,
        sectionHalfWidth,
        treadHalfWidth: Math.min(
            ((nominalSectionWidth * TREAD_WIDTH_RATIO) / 2) * (1 - treadLift),
            sectionHalfWidth * MAX_TREAD_TO_SECTION,
        ),
        bulgeHeight: THREE.MathUtils.clamp(
            NEUTRAL_BULGE_HEIGHT - rimDelta * BULGE_HEIGHT_PER_RIM_INCH,
            MIN_BULGE_HEIGHT,
            MAX_BULGE_HEIGHT,
        ),
        // Only stretch pulls the sidewall taut. Squeezing a tire onto a narrow
        // rim leaves the cords slack, so the belly stays.
        taut: THREE.MathUtils.clamp(
            rimDelta * SIDEWALL_TAUT_PER_RIM_INCH,
            0,
            MAX_SIDEWALL_TAUT,
        ),
    };
}

// Half width of the carcass at height h up the sidewall, 0 at the bead and 1 at
// the shoulder: out from the bead to the widest point, then back in to the
// tread. Shaping width against height, rather than curving through the widest
// point in both axes, is what keeps the radius climbing steadily -- a bezier
// aimed through a low widest point puts its control behind the bead and dents
// the sidewall inside the rim.
//
// The hook off the bead stays round however hard the tire is pulled: that part
// is the carcass wrapping the flange, not membrane under tension.
export function sidewallHalfWidthAt(h: number, carcass: Carcass) {
    const { beadHalfWidth, sectionHalfWidth, treadHalfWidth, bulgeHeight } =
        carcass;
    if (h <= bulgeHeight) {
        return THREE.MathUtils.lerp(
            beadHalfWidth,
            sectionHalfWidth,
            smoothstep(h / bulgeHeight),
        );
    }
    return THREE.MathUtils.lerp(
        sectionHalfWidth,
        treadHalfWidth,
        tautEase((h - bulgeHeight) / (1 - bulgeHeight), carcass.taut),
    );
}
