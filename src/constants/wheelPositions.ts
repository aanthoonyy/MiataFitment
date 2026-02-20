export enum WheelPosition {
  FRONT_LEFT = "FL",
  FRONT_RIGHT = "FR",
  REAR_LEFT = "BL",
  REAR_RIGHT = "BR",
}

export type CarModel = "na" | "nb" | "nc" | "nd";

interface BaseWheelPosition {
  x: number;
  z: number;
}

interface FrontWheelPosition extends BaseWheelPosition {
  casterOffset: number;
}

interface RearWheelPosition extends BaseWheelPosition {}

interface WheelPositions {
  FRONT: {
    LEFT: FrontWheelPosition;
    RIGHT: FrontWheelPosition;
  };
  REAR: {
    LEFT: RearWheelPosition;
    RIGHT: RearWheelPosition;
  };
}

// All measurements are in feet (1 unit = 1 foot in Three.js)
// X: Positive values move wheels towards rear of car, negative towards front
// Z: Positive values move wheels towards left side, negative towards right
// Y (ride height): Controlled by settings.rideHeightFront/Rear
// Right = left looking at the front of the car
// Left = right looking at the front of the car

// NA Miata wheel positions
const NA_WHEEL_POSITIONS: WheelPositions = {
  FRONT: {
    LEFT: {
      x: -4.85, // Distance from car center to front wheel center (negative = front of car)
      z: 2.5, // Distance from car centerline to wheel center (positive = left side)
      casterOffset: 5.74 / 12, // Used to calculate caster effect (converts degrees to feet)
    },
    RIGHT: {
      x: -4.85, // Same as left, but mirrored
      z: -2.5, // Negative of left side (mirrored)
      casterOffset: 5.74 / 12, // Same as left side
    },
  },
  REAR: {
    LEFT: {
      x: 2.85, // Distance from car center to rear wheel center (positive = rear of car)
      z: 2.53, // Slightly wider than front for typical rear track width
    },
    RIGHT: {
      x: 2.85, // Same as left, but mirrored
      z: -2.53, // Negative of left side (mirrored)
    },
  },
};

// NB Miata wheel positions
const NB_WHEEL_POSITIONS: WheelPositions = {
  FRONT: {
    LEFT: {
      x: -15.35, // Same as NA
      z: 2.5, // Same as NA
      casterOffset: 5.74 / 12, // Same as NA
    },
    RIGHT: {
      x: -15.35, // Same as NA
      z: -2.5, // Same as NA
      casterOffset: 5.74 / 12, // Same as NA
    },
  },
  REAR: {
    LEFT: {
      x: 2.85, // Same as NA
      z: 2.35, // Narrower than NA (was 2.53)
    },
    RIGHT: {
      x: 2.85, // Same as NA
      z: -2.35, // Narrower than NA (was -2.53)
    },
  },
};

// NC Miata wheel positions (placeholder - to be filled in later)
const NC_WHEEL_POSITIONS: WheelPositions = {
  ...NA_WHEEL_POSITIONS, // Temporarily using NA positions until NC measurements are available
};

// ND Miata wheel positions
const ND_WHEEL_POSITIONS: WheelPositions = {
  FRONT: {
    LEFT: {
      x: -15.37,
      z: 2.67,
      casterOffset: 5.74 / 12,
    },
    RIGHT: {
      x: -15.37,
      z: -2.67,
      casterOffset: 5.74 / 12,
    },
  },
  REAR: {
    LEFT: {
      x: 2.77,
      z: 2.68,
    },
    RIGHT: {
      x: 2.77,
      z: -2.68,
    },
  },
};

// Map of car models to their wheel positions
const MODEL_WHEEL_POSITIONS: Record<CarModel, WheelPositions> = {
  na: NA_WHEEL_POSITIONS,
  nb: NB_WHEEL_POSITIONS,
  nc: NC_WHEEL_POSITIONS,
  nd: ND_WHEEL_POSITIONS,
};

// Function to get wheel positions for a specific model
export function getWheelPositions(model: CarModel): WheelPositions {
  return MODEL_WHEEL_POSITIONS[model];
}

// For backward compatibility, export NA positions as default
export const WHEEL_POSITIONS = NA_WHEEL_POSITIONS; 