import * as THREE from "three";
import { sidewallHalfWidthAt } from "./carcass";
import type { TreadChain } from "@/types/tire";

// --- turning the solved section into lathe points -------------------------

// Everything upstream is worked in inches; the scene is in feet.
const INCHES_PER_FOOT = 12;

const SIDEWALL_SEGMENTS = 14;
const SHOULDER_SEGMENTS = 8;
const CROWN_SEGMENTS = 5;

// An arc swept about `centre`, with the angle measured off the tread centreline
// and opening out towards the shoulder -- so angle 0 is the crown and larger
// angles walk down the outboard side. Both endpoints are included.
function arcPoints(
    centre: THREE.Vector2,
    radius: number,
    fromAngle: number,
    toAngle: number,
    segments: number,
): THREE.Vector2[] {
    const points: THREE.Vector2[] = [];
    for (let i = 0; i <= segments; i++) {
        const angle = fromAngle + ((toAngle - fromAngle) * i) / segments;
        points.push(
            new THREE.Vector2(
                centre.x + radius * Math.cos(angle),
                centre.y - radius * Math.sin(angle),
            ),
        );
    }
    return points;
}

// The bead stays exactly on the rim at exactly the rim's width whatever the
// carcass does, so the tire still seats on the wheel.
function sidewallPoints(chain: TreadChain, rimRadius: number): THREE.Vector2[] {
    const points: THREE.Vector2[] = [];
    for (let i = 0; i <= SIDEWALL_SEGMENTS; i++) {
        const h = (i / SIDEWALL_SEGMENTS) * chain.handoverHeight;
        points.push(
            new THREE.Vector2(
                rimRadius + h * chain.sidewallSpan,
                -sidewallHalfWidthAt(h, chain.aimedCarcass),
            ),
        );
    }
    return points;
}

// Half the cross section, from the outboard bead round to the centre of the
// tread. Each run shares its first point with the previous run's last, so the
// joins are dropped as they are concatenated.
function halfProfile(chain: TreadChain, rimRadius: number): THREE.Vector2[] {
    const sidewall = sidewallPoints(chain, rimRadius);
    const shoulder = arcPoints(
        chain.shoulderCentre,
        chain.shoulderRadius,
        Math.PI / 2 - chain.joinAngle,
        chain.crownAngle,
        SHOULDER_SEGMENTS,
    );
    const crown = arcPoints(
        chain.crownCentre,
        chain.crownRadius,
        chain.crownAngle,
        0,
        CROWN_SEGMENTS,
    );
    return [...sidewall, ...shoulder.slice(1), ...crown.slice(1)];
}

// The full section for the lathe: half of it mirrored about the tread centre
// back out to the far bead, then converted to the scene's units.
export function tireProfile(
    chain: TreadChain,
    rimRadius: number,
): THREE.Vector2[] {
    const half = halfProfile(chain, rimRadius);
    const points = half.slice();
    for (let i = half.length - 2; i >= 0; i--) {
        points.push(new THREE.Vector2(half[i].x, -half[i].y));
    }
    for (const point of points) point.divideScalar(INCHES_PER_FOOT);
    return points;
}
