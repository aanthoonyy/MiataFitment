// Damped spring simulation state for the "Simulate Bounce" action.
export interface BounceState {
    displacement: number; // inches, positive = compression (body dropped)
    velocity: number; // inches/sec
    released: boolean;
    pressElapsed: number;
    pressFrom: number;
}

// Tuned for a Miata: default ~6k lb/in spring rate, 0.3-0.7 damping ratio
export interface BounceParams {
    springRateLbIn?: number;
    dampingRatio?: number;
}
