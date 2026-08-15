// Nearly every setting comes as a front/rear pair, and which half applies is
// decided by the corner being worked on. This is that half, resolved once, so
// anything taking a WheelPosition can read its own values rather than having
// them passed down alongside -- or picking them apart a second time.
//
// Caster is deliberately absent: it is a front-only setting with no rear twin.
export interface AxleSettings {
    camberDeg: number;
    toeRad: number;
    rideHeightFt: number;
    wheelDiameterIn: number;
    wheelWidthIn: number;
    wheelOffsetMm: number;
    wheelSpacerMm: number;
    tireWidthMm: number;
    tireSidewallPct: number;
}

// Where a corner ends up once camberDeg, toeRad, offset, spacer and ride height have
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
