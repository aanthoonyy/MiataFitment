// Damped spring simulation for the "Simulate Bounce" action.
// Suspension geometry (hub-to-fender, camber curves) lives in
// ./suspensionGeometry.
import type { BounceState, BounceParams } from "@/types/bounce";

export const DEFAULT_SPRING_RATE_LB_IN = 6000;
const MIN_SPRING_RATE_LB_IN = 2000;
const MAX_SPRING_RATE_LB_IN = 40000;

/**
 * Effective sprung mass, chosen so 6000 lb/in lands at ~1.5 Hz.
 * Exported because the persisted-state migration in fitmentStore needs the
 * same value to convert a legacy springRateHz back into lb/in.
 */
export const SPRING_MASS = 68;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const dampingRatioFromSpringRate = (springRateLbIn: number) => {
  const clamped = clamp(
    springRateLbIn,
    MIN_SPRING_RATE_LB_IN,
    MAX_SPRING_RATE_LB_IN,
  );
  const t =
    (clamped - DEFAULT_SPRING_RATE_LB_IN) /
    (MAX_SPRING_RATE_LB_IN - DEFAULT_SPRING_RATE_LB_IN);
  return clamp(0.25 + t * 0.45, 0.25, 0.7);
};

/** Peak body drop, in inches, that the default spring rate gets from a bump. */
export const BUMP_AT_DEFAULT_RATE = 1.0;
const MIN_BUMP_INCHES = 0.4;
const MAX_BUMP_INCHES = 2.0;

/**
 * Peak body drop for a given spring rate, in inches.
 *
 * The bump is modelled as a fixed velocity input — the same pothole, hit at the
 * same speed, whatever is holding the corner up. Peak travel for a velocity
 * input goes as 1/sqrt(k), so a stiff coilover rides over what a soft spring
 * squats through. This used to be a flat 1.5in at every rate, which made stiff
 * setups show fender contact they would never actually see.
 */
export function bumpDisplacement(springRateLbIn = DEFAULT_SPRING_RATE_LB_IN) {
  const scaled =
    BUMP_AT_DEFAULT_RATE *
    Math.sqrt(DEFAULT_SPRING_RATE_LB_IN / springRateLbIn);
  return clamp(scaled, MIN_BUMP_INCHES, MAX_BUMP_INCHES);
}

/**
 * The press-down lead-in, as a fraction of the spring's natural period.
 *
 * Scaling with the period keeps the press in proportion to the bounce it sets
 * up: a stiff coilover snaps back quickly, so a fixed-length press would end up
 * dominating its animation.
 */
const PRESS_PERIOD_FRACTION = 0.35;
const MIN_PRESS_SECONDS = 0.1;
const MAX_PRESS_SECONDS = 0.25;

const naturalFrequency = (springRateLbIn: number) =>
  Math.sqrt(springRateLbIn / SPRING_MASS);

/** Duration of the press-down that precedes the release, in seconds. */
export function pressSeconds(springRateLbIn = DEFAULT_SPRING_RATE_LB_IN) {
  const period = (2 * Math.PI) / naturalFrequency(springRateLbIn);
  return clamp(
    period * PRESS_PERIOD_FRACTION,
    MIN_PRESS_SECONDS,
    MAX_PRESS_SECONDS,
  );
}

/**
 * Start a bounce. Pass the in-flight state when re-triggering mid-bounce so the
 * press-down eases from wherever the body currently is instead of jumping.
 */
export function createBounceState(current?: BounceState | null): BounceState {
  return {
    displacement: current?.displacement ?? 0,
    velocity: current?.velocity ?? 0,
    released: false,
    pressElapsed: 0,
    pressFrom: current?.displacement ?? 0,
  };
}

// Smoothstep — zero slope at both ends, so the press starts without a visible
// jerk and hands over to the spring at rest, matching a release from full
// compression.
const smoothstep = (u: number) => u * u * (3 - 2 * u);

export function stepBounce(
  state: BounceState,
  dt: number,
  params: BounceParams = {},
): BounceState {
  // Clamp dt to prevent instability on tab-switch
  const cdt = Math.min(dt, 0.05);
  const springRateLbIn = params.springRateLbIn ?? DEFAULT_SPRING_RATE_LB_IN;

  if (!state.released) {
    const duration = pressSeconds(springRateLbIn);
    const target = bumpDisplacement(springRateLbIn);
    const pressElapsed = state.pressElapsed + cdt;
    const u = clamp(pressElapsed / duration, 0, 1);
    const displacement =
      state.pressFrom + (target - state.pressFrom) * smoothstep(u);
    return {
      ...state,
      displacement,
      // Carry the press's own speed into the release so the two phases join
      // without a kink.
      velocity: cdt > 0 ? (displacement - state.displacement) / cdt : 0,
      released: u >= 1,
      pressElapsed,
    };
  }

  const omega = naturalFrequency(springRateLbIn);
  const zeta =
    params.dampingRatio ?? dampingRatioFromSpringRate(springRateLbIn);
  const k = omega * omega; // spring stiffness (normalized, m=1)
  const c = 2 * zeta * omega; // damping coefficient
  const accel = -k * state.displacement - c * state.velocity;
  const velocity = state.velocity + accel * cdt;
  const displacement = state.displacement + velocity * cdt;
  return { ...state, displacement, velocity };
}

export function isBounceSettled(state: BounceState): boolean {
  // A press-down starts at rest, which would otherwise read as settled.
  if (!state.released) return false;
  return Math.abs(state.displacement) < 0.01 && Math.abs(state.velocity) < 0.01;
}
