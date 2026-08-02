// Damped spring simulation for the "Simulate Bounce" action.
// Suspension geometry (hub-to-fender, camber curves) lives in
// ./suspensionGeometry.

export interface BounceState {
  displacement: number; // inches, positive = compression (body dropped)
  velocity: number; // inches/sec
}

// Tuned for a Miata: default ~6k lb/in spring rate, 0.3-0.7 damping ratio
export interface BounceParams {
  springRateLbIn?: number;
  dampingRatio?: number;
}

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

export const INITIAL_DISPLACEMENT = 1.5; // inches — initial bump input

export function stepBounce(
  state: BounceState,
  dt: number,
  params: BounceParams = {},
): BounceState {
  // Clamp dt to prevent instability on tab-switch
  const cdt = Math.min(dt, 0.05);
  const springRateLbIn = params.springRateLbIn ?? DEFAULT_SPRING_RATE_LB_IN;
  const omega = Math.sqrt(springRateLbIn / SPRING_MASS);
  const zeta =
    params.dampingRatio ?? dampingRatioFromSpringRate(springRateLbIn);
  const k = omega * omega; // spring stiffness (normalized, m=1)
  const c = 2 * zeta * omega; // damping coefficient
  const accel = -k * state.displacement - c * state.velocity;
  const velocity = state.velocity + accel * cdt;
  const displacement = state.displacement + velocity * cdt;
  return { displacement, velocity };
}

export function isBounceSettled(state: BounceState): boolean {
  return Math.abs(state.displacement) < 0.01 && Math.abs(state.velocity) < 0.01;
}
