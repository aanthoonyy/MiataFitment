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

// Sliding the widest point down is only half of stretch. Pulling the bead out
// onto a wider rim also puts the sidewall in tension, and a taut membrane is
// straight -- so everything above the widest point flattens into one long run
// up to the shoulder. That straight run over a short hook off the bead is the J
// a stretched tire makes in section; a relaxed carcass keeps its belly and
// makes a C. Straightens the easing above the widest point towards linear.
const SIDEWALL_TAUT_PER_RIM_INCH = 0.35;
// Never dead straight: even a hard stretch leaves a little belly in the cords.
const MAX_SIDEWALL_TAUT = 0.95;

// How much the CROWN alone falls away from centre to shoulder, as a fraction of
// tread half width. A stretched tire pulls the crown flat; a bulged one rounds
// it. The shoulder round-over below adds its own drop on top of this -- the two
// are separate features on a real tire and can't share one curve.
const CROWN_DROP = 0.08;
const CROWN_DROP_PER_BULGE = 0.06;

// The shoulder round-over is a physical radius in the mould, about 17mm on a
// 225, and it does not scale with how flat the crown is. Left to CROWN_DROP it
// comes out at fractions of a millimetre on a wide tire -- a knife edge where
// the sidewall hands over to the tread.
const SHOULDER_RADIUS_RATIO = 0.075;

const SIDEWALL_SEGMENTS = 14;
const SHOULDER_SEGMENTS = 8;
const CROWN_SEGMENTS = 5;
const LATHE_SEGMENTS = 64;

const smoothstep = (t: number) => t * t * (3 - 2 * t);

// The easing used above the widest point, from round to straight. Since the
// radius climbs linearly with h, a linear width against h is a dead straight
// line in section -- so tautness really does straighten the sidewall rather
// than just redistributing where it curves.
const tautEase = (u: number, taut: number) =>
    THREE.MathUtils.lerp(smoothstep(u), u, taut);
const tautEaseSlope = (u: number, taut: number) =>
    THREE.MathUtils.lerp(6 * u * (1 - u), 1, taut);

// Half width of the carcass at height h up the sidewall, 0 at the bead and 1 at
// the shoulder: out from the bead to the widest point, then back in to the
// tread. Shaping width against height, rather than curving through the widest
// point in both axes, is what keeps the radius climbing steadily -- a bezier
// aimed through a low widest point puts its control behind the bead and dents
// the sidewall inside the rim.
//
// The hook off the bead stays round however hard the tire is pulled: that part
// is the carcass wrapping the flange, not membrane under tension.
function sidewallHalfWidthAt(
    h: number,
    bulgeHeight: number,
    beadHalfWidth: number,
    sectionHalfWidth: number,
    treadHalfWidth: number,
    taut: number,
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
        tautEase((h - bulgeHeight) / (1 - bulgeHeight), taut),
    );
}

// An arc swept about `centre`, with the angle measured off the tread centreline
// and opening out towards the shoulder -- so angle 0 is the crown and larger
// angles walk down the outboard side.
function sampleArc(
    centre: THREE.Vector2,
    radius: number,
    fromAngle: number,
    toAngle: number,
    segments: number,
    into: THREE.Vector2[],
) {
    // Starts at i = 1: the arc's first point is already the last point pushed.
    for (let i = 1; i <= segments; i++) {
        const angle = fromAngle + ((toAngle - fromAngle) * i) / segments;
        into.push(
            new THREE.Vector2(
                centre.x + radius * Math.cos(angle),
                centre.y - radius * Math.sin(angle),
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
    // Only stretch pulls the sidewall taut. Squeezing a tire onto a narrow rim
    // leaves the cords slack, so the belly stays.
    const sidewallTaut = THREE.MathUtils.clamp(
        rimDelta * SIDEWALL_TAUT_PER_RIM_INCH,
        0,
        MAX_SIDEWALL_TAUT,
    );

    // --- tread: sidewall, then shoulder round-over, then crown -------------
    //
    // Three radii, each tangent to the next, instead of one curve doing all of
    // it. The shoulder is small and physical, the crown is enormous and nearly
    // flat, and the sidewall hands over part way up its easing so it arrives
    // already sweeping inboard.

    const shoulderRadius = Math.min(
        nominalSectionWidth * SHOULDER_RADIUS_RATIO,
        treadHalfWidth * 0.4,
        // Never let the round-over eat a low profile tire's whole sidewall.
        sidewallHeight * 0.2,
    );

    // Drop belonging to the crown on its own, which fixes its radius: a shallow
    // drop over a wide tread is a very large arc.
    const crownDrop = Math.min(
        treadHalfWidth *
            Math.max(
                CROWN_DROP +
                    (bulgeHeight - NEUTRAL_BULGE_HEIGHT) * CROWN_DROP_PER_BULGE,
                0.01,
            ),
        sidewallHeight * 0.25,
    );
    const crownRadius = Math.max(
        (treadHalfWidth * treadHalfWidth) / (2 * crownDrop),
        // The crown still has to be able to swallow the shoulder arc inside it.
        (treadHalfWidth + shoulderRadius) / 0.9,
    );

    // The easing is flat at both ends, so carrying the sidewall all the way to
    // h = 1 leaves the profile stalled -- moving purely radially, width
    // momentarily constant -- exactly where the tread wants to be sweeping
    // hardest inboard. Hand over at the easing's inflection instead. The easing
    // is then aimed at a narrower tread than the tire really has, so that by
    // the handover it has arrived at the real tread half width.
    const handover = THREE.MathUtils.clamp(
        // Pushed past the inflection only when the tire is stretched hard
        // enough that the aimed-at width below would otherwise go silly. Past
        // half way every easing here returns at least its own input, so using
        // the ratio directly is enough to hold that floor without inverting the
        // easing -- which has no closed form once it is blended towards
        // straight anyway.
        (sectionHalfWidth - treadHalfWidth) /
            (sectionHalfWidth - treadHalfWidth * 0.25),
        0.5,
        0.9,
    );
    const handoverHeight = bulgeHeight + (1 - bulgeHeight) * handover;
    const easedTreadHalfWidth =
        sectionHalfWidth -
        (sectionHalfWidth - treadHalfWidth) / tautEase(handover, sidewallTaut);
    // d(half width)/dh at the handover, from the easing's derivative.
    const handoverSlope =
        ((sectionHalfWidth - easedTreadHalfWidth) *
            tautEaseSlope(handover, sidewallTaut)) /
        (1 - bulgeHeight);

    // Closing the chain is mildly circular: how far the sidewall climbs sets
    // the angle it arrives at, which sets how much of the quarter turn the
    // shoulder and crown have left to make, which sets how deep the tread sits
    // and so how far the sidewall climbs. It settles in a couple of passes.
    let treadDrop = 0;
    let joinAngle = 0;
    let crownAngle = 0;
    let sidewallSpan = 0;
    for (let pass = 0; pass < 12; pass++) {
        sidewallSpan = (treadRadius - treadDrop - rimRadius) / handoverHeight;
        // Angle of the profile off radial where the sidewall meets the
        // shoulder. Capped so a hugely stretched, very low profile tire can't
        // demand more turn than the shoulder and crown have left between them.
        joinAngle = Math.min(Math.atan(handoverSlope / sidewallSpan), 1.1);
        // How much of the turn the crown takes, fixed by the shoulder having to
        // come out at exactly the tread half width.
        crownAngle = Math.asin(
            THREE.MathUtils.clamp(
                (treadHalfWidth - shoulderRadius * Math.cos(joinAngle)) /
                    (crownRadius - shoulderRadius),
                0,
                1,
            ),
        );
        treadDrop =
            crownRadius * (1 - Math.cos(crownAngle)) +
            shoulderRadius * (Math.cos(crownAngle) - Math.sin(joinAngle));
    }

    // Half the cross section, from the left bead round to the centre of the
    // tread. The bead stays exactly on the rim at exactly the rim's width
    // whatever the carcass does, so the tire still seats on the wheel.
    const half: THREE.Vector2[] = [];
    for (let i = 0; i <= SIDEWALL_SEGMENTS; i++) {
        const h = (i / SIDEWALL_SEGMENTS) * handoverHeight;
        half.push(
            new THREE.Vector2(
                rimRadius + h * sidewallSpan,
                -sidewallHalfWidthAt(
                    h,
                    bulgeHeight,
                    rimHalfWidth,
                    sectionHalfWidth,
                    easedTreadHalfWidth,
                    sidewallTaut,
                ),
            ),
        );
    }

    // Shoulder and crown share a centre line, the shoulder sitting inside the
    // crown circle and touching it, which is what makes them tangent.
    const crownCentre = new THREE.Vector2(treadRadius - crownRadius, 0);
    const shoulderCentre = new THREE.Vector2(
        crownCentre.x + (crownRadius - shoulderRadius) * Math.cos(crownAngle),
        -(crownRadius - shoulderRadius) * Math.sin(crownAngle),
    );
    // Up over the shoulder from the sidewall...
    sampleArc(
        shoulderCentre,
        shoulderRadius,
        Math.PI / 2 - joinAngle,
        crownAngle,
        SHOULDER_SEGMENTS,
        half,
    );
    // ...then across the crown to the centre of the tread.
    sampleArc(crownCentre, crownRadius, crownAngle, 0, CROWN_SEGMENTS, half);

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
