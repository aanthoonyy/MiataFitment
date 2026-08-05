export const WheelPosition = {
  FRONT_LEFT: "FL",
  FRONT_RIGHT: "FR",
  REAR_LEFT: "BL",
  REAR_RIGHT: "BR",
} as const;
import type { WheelPositions } from "@/types/wheels";

export type WheelPosition = (typeof WheelPosition)[keyof typeof WheelPosition];

export const CAR_MODELS = ["na", "nb", "nc", "nd"] as const;

export type CarModel = (typeof CAR_MODELS)[number];

export function isCarModel(value: unknown): value is CarModel {
  return (
    typeof value === "string" &&
    (CAR_MODELS as readonly string[]).includes(value)
  );
}

// All measurements are in feet (1 unit = 1 foot in Three.js)
// X: Positive values move wheels towards rear of car, negative towards front
// Z: Positive values move wheels towards left side, negative towards right
// Y (ride height): Controlled by settings.rideHeightFront/Rear
// Right = left looking at the front of the car
// Left = right looking at the front of the car

// Converts the caster setting (degrees) into a fore/aft offset in feet.
// Identical across every generation measured so far.
const CASTER_OFFSET_FEET = 5.74 / 12;

// NA Miata wheel positions
const NA_WHEEL_POSITIONS: WheelPositions = {
  FRONT: {
    LEFT: {
      x: -4.85, // Distance from car center to front wheel center (negative = front of car)
      z: 2.5, // Distance from car centerline to wheel center (positive = left side)
      casterOffset: CASTER_OFFSET_FEET,
    },
    RIGHT: {
      x: -4.85, // Same as left, but mirrored
      z: -2.5, // Negative of left side (mirrored)
      casterOffset: CASTER_OFFSET_FEET,
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
      x: -4.85, // Same as NA
      z: 2.5, // Same as NA
      casterOffset: CASTER_OFFSET_FEET,
    },
    RIGHT: {
      x: -4.85, // Same as NA
      z: -2.5, // Same as NA
      casterOffset: CASTER_OFFSET_FEET,
    },
  },
  REAR: {
    LEFT: {
      x: 2.85, // Same as NA
      z: 2.52, // Narrower than NA (was 2.53)
    },
    RIGHT: {
      x: 2.85, // Same as NA
      z: -2.52, // Narrower than NA (was -2.53)
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
      x: -4.85,
      z: 2.61,
      casterOffset: CASTER_OFFSET_FEET,
    },
    RIGHT: {
      x: -4.85,
      z: -2.61,
      casterOffset: CASTER_OFFSET_FEET,
    },
  },
  REAR: {
    LEFT: {
      x: 2.77,
      z: 2.63,
    },
    RIGHT: {
      x: 2.77,
      z: -2.63,
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