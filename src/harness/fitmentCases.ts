import { DEFAULT_SETTINGS, type Settings } from "@/types/settings";
import { WheelPosition, type WheelPosition as Corner } from "@/constants/wheelPositions";
import { RIDE_HEIGHT_RANGE, CAMBER_RANGE } from "@/utils/suspensionGeometry";

export interface FitmentCase {
    name: string;
    settings: Settings;
}

// Derived rather than re-typed, so this stays correct if a corner is ever
// added or renamed.
export const CORNERS: Corner[] = Object.values(WheelPosition);

const withSettings = (patch: Partial<Settings>): Settings => ({
    ...DEFAULT_SETTINGS,
    ...patch,
});

// The cases exist to reach every branch in the geometry, not to look plausible
// in a showroom. Between them they cover both signs of rim delta (a tire
// stretched onto a wider rim and one squeezed onto a narrower one), an
// asymmetric front/rear pair, and settings that drive the carcass clamps to
// their stops.
export const FITMENT_CASES: FitmentCase[] = [
    {
        // 14x6 et45 on 185/60 -- what the car ships with.
        name: "stock",
        settings: DEFAULT_SETTINGS,
    },
    {
        // Rim well over the tire's measuring rim: taut sidewalls, low bulge.
        name: "stretched",
        settings: withSettings({
            frontCamber: -3,
            rearCamber: -3,
            frontTireWidth: 195,
            frontTireSidewall: 45,
            frontWheelWidth: 9,
            frontWheelDiameter: 15,
            frontWheelOffset: 15,
            rearTireWidth: 195,
            rearTireSidewall: 45,
            rearWheelWidth: 9,
            rearWheelDiameter: 15,
            rearWheelOffset: 15,
        }),
    },
    {
        // Rim under the measuring rim: slack cords, the carcass keeps its belly
        // and the tread rounds over. Exercises the taut = 0 branch.
        name: "squeezed",
        settings: withSettings({
            frontTireWidth: 235,
            frontTireSidewall: 45,
            frontWheelWidth: 7,
            frontWheelDiameter: 15,
            frontWheelOffset: 35,
            rearTireWidth: 235,
            rearTireSidewall: 45,
            rearWheelWidth: 7,
            rearWheelDiameter: 15,
            rearWheelOffset: 35,
        }),
    },
    {
        // Every paired setting different front to rear, so anything that reads
        // the wrong axle's value shows up immediately.
        name: "staggered",
        settings: withSettings({
            frontCamber: -2.5,
            rearCamber: -1.5,
            frontToe: 0.02,
            rearToe: -0.01,
            frontCaster: 6.5,
            rideHeightFront: -2.8,
            rideHeightRear: -2.7,
            frontTireWidth: 205,
            frontTireSidewall: 45,
            frontWheelWidth: 8,
            frontWheelDiameter: 16,
            frontWheelOffset: 30,
            frontWheelSpacer: 5,
            rearTireWidth: 225,
            rearTireSidewall: 40,
            rearWheelWidth: 9,
            rearWheelDiameter: 16,
            rearWheelOffset: 20,
            rearWheelSpacer: 10,
        }),
    },
    {
        // Bottom of the ride-height range with real camber and toe dialled in.
        name: "slammed",
        settings: withSettings({
            frontCamber: -12,
            rearCamber: -10,
            frontToe: 0.04,
            rearToe: -0.04,
            frontCaster: 8,
            rideHeightFront: RIDE_HEIGHT_RANGE.min,
            rideHeightRear: RIDE_HEIGHT_RANGE.min,
            frontTireWidth: 205,
            frontTireSidewall: 50,
            frontWheelWidth: 7.5,
            frontWheelDiameter: 15,
            frontWheelOffset: 25,
            frontWheelSpacer: 15,
            rearTireWidth: 205,
            rearTireSidewall: 50,
            rearWheelWidth: 7.5,
            rearWheelDiameter: 15,
            rearWheelOffset: 25,
            rearWheelSpacer: 20,
        }),
    },
    {
        // Nothing anyone would fit, chosen to pin the clamps: max camber, a
        // narrow tire on a very wide rim, and a spacer past anything sensible.
        name: "clamped",
        settings: withSettings({
            frontCamber: CAMBER_RANGE.min,
            rearCamber: CAMBER_RANGE.min,
            frontCaster: 5,
            frontTireWidth: 165,
            frontTireSidewall: 35,
            frontWheelWidth: 12,
            frontWheelDiameter: 17,
            frontWheelOffset: 0,
            frontWheelSpacer: 25,
            rearTireWidth: 165,
            rearTireSidewall: 35,
            rearWheelWidth: 12,
            rearWheelDiameter: 17,
            rearWheelOffset: 0,
            rearWheelSpacer: 25,
        }),
    },
];
