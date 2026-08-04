import * as THREE from "three";
import { Settings } from "@/types/settings";
import type { CarModel, WheelPosition } from "@/constants/wheelPositions";
import rollingDiameter from "./common/rollingDiameter";
import { calculateWheelPosition } from "./common/wheelPositionCalculator";

// --- how the carcass reacts to the rim it's mounted on --------------------
//
// A tire's quoted section width only holds on its "measuring rim". Mount it
// wider and the sidewalls get pulled taut: the widest point slides down towards
// the bead, the tread tucks inside the rim flanges, and the bulge disappears --
// stretch. Mount it narrower and the sidewalls balloon outwards, the widest
// point climbs towards the shoulder, and the tread rounds over.

// Measuring rim runs about 1.5" under the section width. Checks out against the
// published figures: 185 -> 5.8" (5.5 actual), 205 -> 6.6" (6.5), 225 -> 7.4"
// (7.5).
const MEASURING_RIM_DROP = 1.5;

// Industry rule of thumb: section width moves ~10mm per inch of rim width away
// from the measuring rim.
const SECTION_WIDTH_PER_RIM_INCH = 10 / 25.4;

// Tread is always narrower than the section width -- the widest part of a tire
// is its sidewall, not its contact patch. Measured against the width the tire
// was BUILT at, never the width it ends up at once mounted: the belt package is
// a fixed lump of steel and rubber, so pulling the bead out onto a wider rim
// moves the sidewalls and leaves the tread where it was.
const TREAD_WIDTH_RATIO = 0.82;

// Stretching also lifts the shoulders slightly off the road, taking a little
// tread width with them. Small, but it sharpens the look.
const TREAD_LIFT_PER_RIM_INCH = 0.02;
const MAX_TREAD_LIFT = 0.12;

// Height of the widest point up the sidewall, 0 at the bead and 1 at the
// shoulder. Half way on the measuring rim, sliding down as the rim widens.
const NEUTRAL_BULGE_HEIGHT = 0.5;
const BULGE_HEIGHT_PER_RIM_INCH = 0.12;
const MIN_BULGE_HEIGHT = 0.15;
const MAX_BULGE_HEIGHT = 0.8;

// How much the tread falls away from centre to shoulder, as a fraction of tread
// half width. A stretched tire pulls the crown flat; a bulged one rounds it.
const CROWN_DROP = 0.08;
const CROWN_DROP_PER_BULGE = 0.06;

const SIDEWALL_SEGMENTS = 14;
const TREAD_SEGMENTS = 8;
const LATHE_SEGMENTS = 64;

const smoothstep = (t: number) => t * t * (3 - 2 * t);

// Half width of the carcass at height h up the sidewall, 0 at the bead and 1 at
// the shoulder: out from the bead to the widest point, then back in to the
// tread. Shaping width against height, rather than curving through the widest
// point in both axes, is what keeps the radius climbing steadily -- a bezier
// aimed through a low widest point puts its control behind the bead and dents
// the sidewall inside the rim.
function sidewallHalfWidthAt(
    h: number,
    bulgeHeight: number,
    beadHalfWidth: number,
    sectionHalfWidth: number,
    treadHalfWidth: number,
) {
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
        smoothstep((h - bulgeHeight) / (1 - bulgeHeight)),
    );
}

function sampleQuadratic(
    from: THREE.Vector2,
    control: THREE.Vector2,
    to: THREE.Vector2,
    segments: number,
    into: THREE.Vector2[],
) {
    // Starts at i = 1: `from` is already the last point pushed.
    for (let i = 1; i <= segments; i++) {
        const t = i / segments;
        const u = 1 - t;
        into.push(
            new THREE.Vector2(
                u * u * from.x + 2 * u * t * control.x + t * t * to.x,
                u * u * from.y + 2 * u * t * control.y + t * t * to.y,
            ),
        );
    }
}

export function makeTires(
    wheelDiameter: number,
    wheelWidth: number,
    tireWidth: number,
    tireSidewall: number,
    position: WheelPosition,
    settings: Settings,
    model: CarModel = "na"
) {
    // Worked in inches, converted to feet at the end like the rest of the scene.
    const rimRadius = wheelDiameter / 2;
    const rimHalfWidth = wheelWidth / 2;
    // Keep a sliver of sidewall even on absurd settings, so the profile can't
    // invert.
    const treadRadius = Math.max(
        rollingDiameter(wheelDiameter, tireWidth, tireSidewall) / 2,
        rimRadius + 0.5,
    );
    const sidewallHeight = treadRadius - rimRadius;

    const nominalSectionWidth = tireWidth / 25.4;
    const measuringRim = Math.max(3, nominalSectionWidth - MEASURING_RIM_DROP);
    // Positive when mounted wider than the tire was measured on: stretch.
    const rimDelta = wheelWidth - measuringRim;

    const sectionHalfWidth =
        Math.max(
            nominalSectionWidth + rimDelta * SECTION_WIDTH_PER_RIM_INCH,
            1,
        ) / 2;
    // Off the nominal width, not the mounted one, so the contact patch stays
    // put while the rim pulls the sidewalls out from under it. That gap is the
    // whole visual of stretch.
    const treadLift = THREE.MathUtils.clamp(
        rimDelta * TREAD_LIFT_PER_RIM_INCH,
        0,
        MAX_TREAD_LIFT,
    );
    const treadHalfWidth = Math.min(
        ((nominalSectionWidth * TREAD_WIDTH_RATIO) / 2) * (1 - treadLift),
        // The shoulder has to stay inside the widest point of the carcass, even
        // for a tire squeezed onto a rim far too narrow for it.
        sectionHalfWidth * 0.95,
    );

    const bulgeHeight = THREE.MathUtils.clamp(
        NEUTRAL_BULGE_HEIGHT - rimDelta * BULGE_HEIGHT_PER_RIM_INCH,
        MIN_BULGE_HEIGHT,
        MAX_BULGE_HEIGHT,
    );
    // Never let the crown eat the whole sidewall on a very low profile tire.
    const crownDrop = Math.min(
        treadHalfWidth *
            (CROWN_DROP +
                (bulgeHeight - NEUTRAL_BULGE_HEIGHT) * CROWN_DROP_PER_BULGE),
        sidewallHeight * 0.4,
    );
    const shoulderRadius = treadRadius - crownDrop;

    // Half the cross section, from the left bead round to the centre of the
    // tread. The bead stays exactly on the rim at exactly the rim's width
    // whatever the carcass does, so the tire still seats on the wheel.
    const half: THREE.Vector2[] = [];
    for (let i = 0; i <= SIDEWALL_SEGMENTS; i++) {
        const h = i / SIDEWALL_SEGMENTS;
        half.push(
            new THREE.Vector2(
                rimRadius + h * (shoulderRadius - rimRadius),
                -sidewallHalfWidthAt(
                    h,
                    bulgeHeight,
                    rimHalfWidth,
                    sectionHalfWidth,
                    treadHalfWidth,
                ),
            ),
        );
    }

    // Shoulder rounding into the crown of the tread.
    sampleQuadratic(
        half[half.length - 1],
        new THREE.Vector2(treadRadius, -treadHalfWidth),
        new THREE.Vector2(treadRadius, 0),
        TREAD_SEGMENTS,
        half,
    );

    // Mirror everything but the centre point back out to the right bead.
    const points = half.slice();
    for (let i = half.length - 2; i >= 0; i--) {
        points.push(new THREE.Vector2(half[i].x, -half[i].y));
    }
    for (const point of points) point.divideScalar(12);

    const tireGeometry = new THREE.LatheGeometry(points, LATHE_SEGMENTS);
    const tireMaterial = new THREE.MeshPhysicalMaterial({color: 0x202227});
    tireMaterial.roughness = 0.5;
    tireMaterial.metalness = 0;
    tireMaterial.specularIntensity = 0.1;
    const tire = new THREE.Mesh(tireGeometry, tireMaterial);

    const wheelData = calculateWheelPosition(position, settings, model);

    tire.rotation.x = wheelData.rotation.x;
    tire.rotation.z = wheelData.rotation.z;
    tire.position.x = wheelData.position.x;
    tire.position.y = wheelData.position.y;
    tire.position.z = wheelData.position.z;

    return tire;
}
