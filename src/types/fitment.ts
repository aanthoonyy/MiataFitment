// Front and rear carry independent fitment. Which set applies is decided by the
// corner being built, so anything that takes a WheelPosition can read its own
// dimensions off the settings rather than having them passed down alongside.
export interface AxleFitment {
    wheelDiameter: number;
    wheelWidth: number;
    tireWidth: number;
    tireSidewall: number;
}

// Where a corner ends up once camber, toe, offset, spacer and ride height have
// all been applied.
export interface WheelPositionData {
    rotation: {
        x: number;
        z: number;
    };
    position: {
        x: number;
        y: number;
        z: number;
    };
}
