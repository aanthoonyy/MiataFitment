// Real Miata suspension geometry.
//
// Single source for these constants and formulas. They were previously
// duplicated across bounceSimulation.ts, SuspensionSettings.tsx and
// FitmentSettings.tsx, with a comment in one file pointing at another.

import type { Axle } from "@/constants/wheelPositions";

/** Ride-height slider value corresponding to a stock car. */
export const STOCK_RIDE_HEIGHT = -2.65;

/**
 * Adjustable ranges for the alignment controls.
 *
 * These are shared deliberately: CAMBER_RANGE is both the slider's bounds and
 * the clamp applied in wheelPositionCalculator. They were previously two
 * independent copies, so a change to one would have let the UI offer a value
 * the renderer silently clamped away.
 */
export const RIDE_HEIGHT_RANGE = { min: -3, max: -2, step: 0.01 } as const;
export const CAMBER_RANGE = { min: -20, max: 1, step: 0.1 } as const;
export const CASTER_RANGE = { min: 5, max: 8, step: 0.1 } as const;
export const TOE_RANGE = { min: -0.05, max: 0.05, step: 0.01 } as const;

/** Clamp a camberDeg value to the range the renderer will actually honour. */
export function clampCamber(camberDeg: number): number {
  return Math.min(Math.max(camberDeg, CAMBER_RANGE.min), CAMBER_RANGE.max);
}

/**
 * Scales a ride-height delta into inches of body drop.
 *
 * NOTE: this was previously named MM_TO_INCHES, which it is not — 25.4 is the
 * inches-to-mm factor, and ride height is in Three.js feet (a true feet-to-
 * inches factor would be 12). It is an empirical calibration constant. The
 * value is preserved exactly so the existing readouts and the bounce
 * simulation keep behaving as before.
 */
export const RIDE_HEIGHT_DROP_SCALE = 25.4;

/** Hub-to-fender distance (inches) on an unmodified car. */
const STOCK_HUB_TO_FENDER_IN: Record<Axle, number> = {
  front: 13.5,
  rear: 13.0,
};

export function stockHubToFender(axle: Axle): number {
  return STOCK_HUB_TO_FENDER_IN[axle];
}

/** How much hub-to-fender closes up per inch of body drop. */
const DROP_TO_HUB_TRAVEL_RATIO: Record<Axle, number> = {
  front: 2.5 / 4.0,
  rear: 1.5 / 5.0,
};

/** Inches of body drop for a given ride-height setting. */
export function rideHeightDropInches(rideHeightFt: number): number {
  return (rideHeightFt - STOCK_RIDE_HEIGHT) * RIDE_HEIGHT_DROP_SCALE;
}

/** Hub-to-fender distance (inches) with the car sitting at rest. */
export function hubToFenderAtRest(rideHeightFt: number, axle: Axle): number {
  return (
    stockHubToFender(axle) -
    rideHeightDropInches(rideHeightFt) * DROP_TO_HUB_TRAVEL_RATIO[axle]
  );
}

// --- Camber as a function of hub-to-fender, fitted from real geometry ---

// Quadratic, linear and constant terms of the fit for each axle.
const CAMBER_CURVE: Record<Axle, readonly [number, number, number]> = {
  front: [-0.09632, 3.37758, -29.64574],
  rear: [-0.07764, 2.73651, -24.17385],
};

export function camberFromHubToFender(
  axle: Axle,
  hubToFenderIn: number,
): number {
  const [square, linear, constant] = CAMBER_CURVE[axle];
  return (
    square * hubToFenderIn * hubToFenderIn + linear * hubToFenderIn + constant
  );
}
