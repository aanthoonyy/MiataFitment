// --- Camber functions from real suspension geometry ---
export function frontCamberFromHubToFender(h: number): number {
  return -0.09632 * h * h + 3.37758 * h - 29.64574;
}

export function rearCamberFromHubToFender(h: number): number {
  return -0.07764 * h * h + 2.73651 * h - 24.17385;
}

// --- Damped spring simulation ---
export interface BounceState {
  displacement: number; // inches, positive = compression (body dropped)
  velocity: number; // inches/sec
}

// Tuned for a Miata: default ~6k lb/in spring rate, 0.3-0.7 damping ratio
export interface BounceParams {
  springRateLbIn?: number;
  dampingRatio?: number;
}

const DEFAULT_SPRING_RATE_LB_IN = 6000;
const MIN_SPRING_RATE_LB_IN = 2000;
const MAX_SPRING_RATE_LB_IN = 40000;
const SPRING_MASS = 68; // chosen so 6000 lb/in ≈ 1.5 Hz

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

// --- Hub-to-fender at rest (same formula as SuspensionSettings.tsx) ---
const STOCK_RIDE_HEIGHT = -2.65;
const MM_TO_INCHES = 25.4;

export function hubToFenderAtRest(rideHeight: number, isRear: boolean): number {
  const dropIn = (rideHeight - STOCK_RIDE_HEIGHT) * MM_TO_INCHES;
  const stockHubFender = isRear ? 13.0 : 13.5;
  const ratio = isRear ? 1.5 / 5.0 : 2.5 / 4.0;
  return stockHubFender - dropIn * ratio;
}
