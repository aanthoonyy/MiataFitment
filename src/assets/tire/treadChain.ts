import * as THREE from "three";
import { NEUTRAL_BULGE_HEIGHT, tautEase, tautEaseSlope } from "./carcass";
import type { Carcass, TreadChain } from "@/types/tire";

// --- the tread: sidewall, then shoulder round-over, then crown ------------
//
// Three radii, each tangent to the next, instead of one curve doing all of it.
// The shoulder is small and physical, the crown is enormous and nearly flat,
// and the sidewall hands over part way up its easing so it arrives already
// sweeping inboard.
//
// Profile coordinates throughout: x is radius, y is half width and runs
// negative on the outboard side.

// How much the CROWN alone falls away from centre to shoulder, as a fraction of
// tread half width. A stretched tire pulls the crown flat; a bulged one rounds
// it. The shoulder round-over below adds its own drop on top of this -- the two
// are separate features on a real tire and can't share one curve.
const CROWN_DROP = 0.08;
const CROWN_DROP_PER_BULGE = 0.06;
const MIN_CROWN_DROP = 0.01;
const MAX_CROWN_DROP_TO_SIDEWALL = 0.25;
// The crown arc still has to be able to swallow the shoulder arc inside it.
const MAX_SHOULDER_WITHIN_CROWN = 0.9;

// The shoulder round-over is a physical radius in the mould, about 17mm on a
// 225, and it does not scale with how flat the crown is. Left to CROWN_DROP it
// comes out at fractions of a millimetre on a wide tire -- a knife edge where
// the sidewall hands over to the tread.
const SHOULDER_RADIUS_RATIO = 0.075;
const MAX_SHOULDER_TO_TREAD = 0.4;
// Never let the round-over eat a low profile tire's whole sidewall.
const MAX_SHOULDER_TO_SIDEWALL = 0.2;

// The easings are flat at both ends, so carrying the sidewall all the way to
// h = 1 leaves the profile stalled -- moving purely radially, width momentarily
// constant -- exactly where the tread wants to be sweeping hardest inboard.
// Handing over at the easing's inflection instead means the sidewall arrives
// already turning.
const EASING_INFLECTION = 0.5;
const MAX_HANDOVER = 0.9;
// Floor on the width the easing is aimed at, so a hard stretch can't send it
// negative.
const MIN_AIMED_TREAD_TO_TREAD = 0.25;

// A hugely stretched, very low profile tire must not be able to demand more
// turn at the join than the shoulder and crown have left between them.
const MAX_JOIN_ANGLE = 1.1;
// The chain closes on itself, so it is solved by iteration. It settles in about
// four passes; the rest are free insurance.
const CHAIN_SOLVE_PASSES = 12;

// How far up the run above the widest point the sidewall hands over to the
// shoulder, as a fraction of that run.
//
// Normally the easing's inflection. Pushed past it only when the tire is
// stretched hard enough that the width aimed at below would otherwise go silly.
// Past half way every easing here returns at least its own input, so the ratio
// can be used directly to hold that floor without inverting the easing -- which
// has no closed form once it is blended towards straight anyway.
function handoverFraction(carcass: Carcass) {
    const { sectionHalfWidth, treadHalfWidth } = carcass;
    return THREE.MathUtils.clamp(
        (sectionHalfWidth - treadHalfWidth) /
            (sectionHalfWidth - treadHalfWidth * MIN_AIMED_TREAD_TO_TREAD),
        EASING_INFLECTION,
        MAX_HANDOVER,
    );
}

// The same carcass with the easing aimed at a narrower tread than the tire
// really has, so that by the handover -- short of the easing's end -- it has
// arrived at the real tread half width.
function aimEasingAtHandover(carcass: Carcass, handover: number): Carcass {
    const { sectionHalfWidth, treadHalfWidth } = carcass;
    return {
        ...carcass,
        treadHalfWidth:
            sectionHalfWidth -
            (sectionHalfWidth - treadHalfWidth) /
                tautEase(handover, carcass.taut),
    };
}

// d(half width)/dh where the sidewall meets the shoulder.
function handoverWidthSlope(aimed: Carcass, handover: number) {
    return (
        ((aimed.sectionHalfWidth - aimed.treadHalfWidth) *
            tautEaseSlope(handover, aimed.taut)) /
        (1 - aimed.bulgeHeight)
    );
}

function shoulderRoundOverRadius(
    nominalSectionWidth: number,
    treadHalfWidth: number,
    sidewallHeight: number,
) {
    return Math.min(
        nominalSectionWidth * SHOULDER_RADIUS_RATIO,
        treadHalfWidth * MAX_SHOULDER_TO_TREAD,
        sidewallHeight * MAX_SHOULDER_TO_SIDEWALL,
    );
}

// The crown's own drop fixes its radius: a shallow drop over a wide tread is a
// very large arc.
function crownArcRadius(
    carcass: Carcass,
    sidewallHeight: number,
    shoulderRadius: number,
) {
    const { treadHalfWidth, bulgeHeight } = carcass;
    const crownDrop = Math.min(
        treadHalfWidth *
            Math.max(
                CROWN_DROP +
                    (bulgeHeight - NEUTRAL_BULGE_HEIGHT) * CROWN_DROP_PER_BULGE,
                MIN_CROWN_DROP,
            ),
        sidewallHeight * MAX_CROWN_DROP_TO_SIDEWALL,
    );
    return Math.max(
        (treadHalfWidth * treadHalfWidth) / (2 * crownDrop),
        (treadHalfWidth + shoulderRadius) / MAX_SHOULDER_WITHIN_CROWN,
    );
}

// Closing the chain is mildly circular: how far the sidewall climbs sets the
// angle it arrives at, which sets how much of the quarter turn the shoulder and
// crown have left to make, which sets how deep the tread sits and so how far the
// sidewall climbs.
function solveChainAngles(spec: {
    rimRadius: number;
    treadRadius: number;
    treadHalfWidth: number;
    shoulderRadius: number;
    crownRadius: number;
    handoverHeight: number;
    handoverSlope: number;
}) {
    const {
        rimRadius,
        treadRadius,
        treadHalfWidth,
        shoulderRadius,
        crownRadius,
        handoverHeight,
        handoverSlope,
    } = spec;

    let treadDrop = 0;
    let joinAngle = 0;
    let crownAngle = 0;
    let sidewallSpan = 0;
    for (let pass = 0; pass < CHAIN_SOLVE_PASSES; pass++) {
        sidewallSpan = (treadRadius - treadDrop - rimRadius) / handoverHeight;
        joinAngle = Math.min(
            Math.atan(handoverSlope / sidewallSpan),
            MAX_JOIN_ANGLE,
        );
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
    return { sidewallSpan, joinAngle, crownAngle };
}

export function solveTreadChain(
    carcass: Carcass,
    rimRadius: number,
    treadRadius: number,
): TreadChain {
    const sidewallHeight = treadRadius - rimRadius;
    const shoulderRadius = shoulderRoundOverRadius(
        carcass.nominalSectionWidth,
        carcass.treadHalfWidth,
        sidewallHeight,
    );
    const crownRadius = crownArcRadius(carcass, sidewallHeight, shoulderRadius);

    const handover = handoverFraction(carcass);
    const aimedCarcass = aimEasingAtHandover(carcass, handover);
    const handoverHeight =
        carcass.bulgeHeight + (1 - carcass.bulgeHeight) * handover;
    const { sidewallSpan, joinAngle, crownAngle } = solveChainAngles({
        rimRadius,
        treadRadius,
        treadHalfWidth: carcass.treadHalfWidth,
        shoulderRadius,
        crownRadius,
        handoverHeight,
        handoverSlope: handoverWidthSlope(aimedCarcass, handover),
    });

    // Shoulder and crown share a centre line, the shoulder sitting inside the
    // crown circle and touching it, which is what makes them tangent.
    const crownCentre = new THREE.Vector2(treadRadius - crownRadius, 0);
    const shoulderCentre = new THREE.Vector2(
        crownCentre.x + (crownRadius - shoulderRadius) * Math.cos(crownAngle),
        -(crownRadius - shoulderRadius) * Math.sin(crownAngle),
    );

    return {
        sidewallSpan,
        handoverHeight,
        aimedCarcass,
        shoulderRadius,
        crownRadius,
        shoulderCentre,
        crownCentre,
        joinAngle,
        crownAngle,
    };
}
