// Real Miata suspension geometry.
//
// Single source for these constants and formulas. They were previously
// duplicated across bounceSimulation.ts, SuspensionSettings.tsx and
// FitmentSettings.tsx, with a comment in one file pointing at another.

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

/** Clamp a camber value to the range the renderer will actually honour. */
export function clampCamber(camber: number): number {
  return Math.min(Math.max(camber, CAMBER_RANGE.min), CAMBER_RANGE.max);
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
export function stockHubToFender(isRear: boolean): number {
  return isRear ? 13.0 : 13.5;
}

/** How much hub-to-fender closes up per inch of body drop. */
function dropToHubTravelRatio(isRear: boolean): number {
  return isRear ? 1.5 / 5.0 : 2.5 / 4.0;
}

/** Inches of body drop for a given ride-height setting. */
export function rideHeightDropInches(rideHeight: number): number {
  return (rideHeight - STOCK_RIDE_HEIGHT) * RIDE_HEIGHT_DROP_SCALE;
}

/** Hub-to-fender distance (inches) with the car sitting at rest. */
export function hubToFenderAtRest(rideHeight: number, isRear: boolean): number {
  return (
    stockHubToFender(isRear) -
    rideHeightDropInches(rideHeight) * dropToHubTravelRatio(isRear)
  );
}

// --- Camber as a function of hub-to-fender, fitted from real geometry ---

export function frontCamberFromHubToFender(h: number): number {
  return -0.09632 * h * h + 3.37758 * h - 29.64574;
}

export function rearCamberFromHubToFender(h: number): number {
  return -0.07764 * h * h + 2.73651 * h - 24.17385;
}
