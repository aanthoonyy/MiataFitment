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

// Tuned for a Miata: ~1.5 Hz natural freq, 0.3 damping ratio
const OMEGA = 2 * Math.PI * 1.5; // ~9.42 rad/s
const ZETA = 0.3; // underdamped
const K = OMEGA * OMEGA; // spring stiffness (normalized, m=1)
const C = 2 * ZETA * OMEGA; // damping coefficient

export const INITIAL_DISPLACEMENT = 1.5; // inches — initial bump input

export function stepBounce(state: BounceState, dt: number): BounceState {
  // Clamp dt to prevent instability on tab-switch
  const cdt = Math.min(dt, 0.05);
  const accel = -K * state.displacement - C * state.velocity;
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
