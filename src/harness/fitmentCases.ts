import { DEFAULT_SETTINGS, type Settings } from "@/types/settings";
import { RIDE_HEIGHT_RANGE, CAMBER_RANGE } from "@/utils/suspensionGeometry";

export interface FitmentCase {
    name: string;
    settings: Settings;
}

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
            frontCamberDeg: -3,
            rearCamberDeg: -3,
            frontTireWidthMm: 195,
            frontTireSidewallPct: 45,
            frontWheelWidthIn: 9,
            frontWheelDiameterIn: 15,
            frontWheelOffsetMm: 15,
            rearTireWidthMm: 195,
            rearTireSidewallPct: 45,
            rearWheelWidthIn: 9,
            rearWheelDiameterIn: 15,
            rearWheelOffsetMm: 15,
        }),
    },
    {
        // Rim under the measuring rim: slack cords, the carcass keeps its belly
        // and the tread rounds over. Exercises the taut = 0 branch.
        name: "squeezed",
        settings: withSettings({
            frontTireWidthMm: 235,
            frontTireSidewallPct: 45,
            frontWheelWidthIn: 7,
            frontWheelDiameterIn: 15,
            frontWheelOffsetMm: 35,
            rearTireWidthMm: 235,
            rearTireSidewallPct: 45,
            rearWheelWidthIn: 7,
            rearWheelDiameterIn: 15,
            rearWheelOffsetMm: 35,
        }),
    },
    {
        // Every paired setting different front to rear, so anything that reads
        // the wrong axle's value shows up immediately.
        name: "staggered",
        settings: withSettings({
            frontCamberDeg: -2.5,
            rearCamberDeg: -1.5,
            frontToeRad: 0.02,
            rearToeRad: -0.01,
            frontCasterDeg: 6.5,
            rideHeightFrontFt: -2.8,
            rideHeightRearFt: -2.7,
            frontTireWidthMm: 205,
            frontTireSidewallPct: 45,
            frontWheelWidthIn: 8,
            frontWheelDiameterIn: 16,
            frontWheelOffsetMm: 30,
            frontWheelSpacerMm: 5,
            rearTireWidthMm: 225,
            rearTireSidewallPct: 40,
            rearWheelWidthIn: 9,
            rearWheelDiameterIn: 16,
            rearWheelOffsetMm: 20,
            rearWheelSpacerMm: 10,
        }),
    },
    {
        // Bottom of the ride-height range with real camberDeg and toeRad dialled in.
        name: "slammed",
        settings: withSettings({
            frontCamberDeg: -12,
            rearCamberDeg: -10,
            frontToeRad: 0.04,
            rearToeRad: -0.04,
            frontCasterDeg: 8,
            rideHeightFrontFt: RIDE_HEIGHT_RANGE.min,
            rideHeightRearFt: RIDE_HEIGHT_RANGE.min,
            frontTireWidthMm: 205,
            frontTireSidewallPct: 50,
            frontWheelWidthIn: 7.5,
            frontWheelDiameterIn: 15,
            frontWheelOffsetMm: 25,
            frontWheelSpacerMm: 15,
            rearTireWidthMm: 205,
            rearTireSidewallPct: 50,
            rearWheelWidthIn: 7.5,
            rearWheelDiameterIn: 15,
            rearWheelOffsetMm: 25,
            rearWheelSpacerMm: 20,
        }),
    },
    {
        // Nothing anyone would fit, chosen to pin the clamps: max camberDeg, a
        // narrow tire on a very wide rim, and a spacer past anything sensible.
        name: "clamped",
        settings: withSettings({
            frontCamberDeg: CAMBER_RANGE.min,
            rearCamberDeg: CAMBER_RANGE.min,
            frontCasterDeg: 5,
            frontTireWidthMm: 165,
            frontTireSidewallPct: 35,
            frontWheelWidthIn: 12,
            frontWheelDiameterIn: 17,
            frontWheelOffsetMm: 0,
            frontWheelSpacerMm: 25,
            rearTireWidthMm: 165,
            rearTireSidewallPct: 35,
            rearWheelWidthIn: 12,
            rearWheelDiameterIn: 17,
            rearWheelOffsetMm: 0,
            rearWheelSpacerMm: 25,
        }),
    },
];
