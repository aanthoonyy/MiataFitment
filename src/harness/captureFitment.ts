import { makeTires } from "@/assets/tire";
import { makeWheels } from "@/assets/wheels";
import { axleSettings } from "@/assets/common/axleSettings";
import { calculateWheelPosition } from "@/assets/common/wheelPositionCalculator";
import rollingDiameter from "@/assets/common/rollingDiameter";
import { CAR_MODELS, type CarModel, type WheelPosition } from "@/constants/wheelPositions";
import { DEFAULT_WHEEL_DESIGN } from "@/constants/wheelDesigns";
import {
    createBounceState,
    isBounceSettled,
    stepBounce,
} from "@/utils/bounceSimulation";
import {
    RIDE_HEIGHT_RANGE,
    STOCK_RIDE_HEIGHT,
    frontCamberFromHubToFender,
    hubToFenderAtRest,
    rearCamberFromHubToFender,
} from "@/utils/suspensionGeometry";
import { CORNERS, FITMENT_CASES, type FitmentCase } from "./fitmentCases";
import {
    digestFields,
    digestNumbers,
    digestWorldGeometry,
    forReading,
    type GeometryDigest,
} from "./geometryDigest";

// Only the built-in procedural wheel is captured. Every .glb design is fitted
// into the same envelope by the same code path, and loading one needs a network
// fetch this harness deliberately does not have.
const CAPTURED_DESIGN = DEFAULT_WHEEL_DESIGN;

// Sixty steps a second is what the render loop feeds it. Ten seconds is well
// past the point every rate in the sweep has settled.
const BOUNCE_STEP_SECONDS = 1 / 60;
const BOUNCE_STEPS = 600;

// The clamped ends of the spring-rate range plus the default, so the damping
// curve is pinned at both stops and in the middle.
const CAPTURED_SPRING_RATES_LB_IN = [2000, 6000, 12000, 40000];

export interface CornerCapture {
    axle: Record<string, number>;
    placement: Record<string, number>;
    rollingDiameterIn: number;
    tire: GeometryDigest;
    wheel: GeometryDigest;
}

export interface BounceCapture {
    peakDropIn: number;
    settledAtStep: number;
    digest: string;
}

export interface SuspensionCapture {
    hubToFenderAtStockIn: number;
    camberAtStockDeg: number;
    hubToFenderAtLowestIn: number;
    camberAtLowestDeg: number;
    digest: string;
}

export interface Goldens {
    corners: Record<string, CornerCapture>;
    bounce: Record<string, BounceCapture>;
    suspension: Record<string, SuspensionCapture>;
}

export const cornerKey = (
    caseName: string,
    model: CarModel,
    corner: WheelPosition,
) => `${caseName}/${model}/${corner}`;

export function captureCorner(
    fitmentCase: FitmentCase,
    model: CarModel,
    corner: WheelPosition,
): CornerCapture {
    const { settings } = fitmentCase;
    const axle = axleSettings(corner, settings);
    const placement = calculateWheelPosition(corner, settings, model);

    const tire = makeTires(corner, settings, model);
    const wheel = makeWheels(
        axle.wheelWidth,
        axle.wheelDiameter,
        corner,
        settings,
        model,
        CAPTURED_DESIGN,
    );

    return {
        axle: digestFields(axle),
        placement: digestFields({
            rotationXRad: placement.rotation.x,
            rotationZRad: placement.rotation.z,
            positionXFt: placement.position.x,
            positionYFt: placement.position.y,
            positionZFt: placement.position.z,
        }),
        rollingDiameterIn: forReading(
            rollingDiameter(
                axle.wheelDiameter,
                axle.tireWidth,
                axle.tireSidewall,
            ),
        ),
        tire: digestWorldGeometry(tire),
        wheel: digestWorldGeometry(wheel),
    };
}

export function captureBounce(springRateLbIn: number): BounceCapture {
    let state = createBounceState();
    const displacementsIn: number[] = [];
    let settledAtStep = -1;

    for (let step = 0; step < BOUNCE_STEPS; step++) {
        state = stepBounce(state, BOUNCE_STEP_SECONDS, { springRateLbIn });
        displacementsIn.push(state.displacement);
        if (settledAtStep < 0 && isBounceSettled(state)) settledAtStep = step;
    }

    return {
        peakDropIn: forReading(Math.max(...displacementsIn)),
        settledAtStep,
        digest: digestNumbers(displacementsIn),
    };
}

// Indexed rather than accumulated, so the sweep hits the same ride heights
// every run instead of drifting with floating point addition.
function rideHeightSweep(): number[] {
    const { min, max, step } = RIDE_HEIGHT_RANGE;
    const stepCount = Math.round((max - min) / step);
    const heights: number[] = [];
    for (let index = 0; index <= stepCount; index++) {
        heights.push(min + index * step);
    }
    return heights;
}

export function captureSuspension(isRear: boolean): SuspensionCapture {
    const camberFromHubToFender = isRear
        ? rearCamberFromHubToFender
        : frontCamberFromHubToFender;

    const traced: number[] = [];
    for (const rideHeight of rideHeightSweep()) {
        const hubToFenderIn = hubToFenderAtRest(rideHeight, isRear);
        traced.push(hubToFenderIn, camberFromHubToFender(hubToFenderIn));
    }

    const atStockIn = hubToFenderAtRest(STOCK_RIDE_HEIGHT, isRear);
    const atLowestIn = hubToFenderAtRest(RIDE_HEIGHT_RANGE.min, isRear);

    return {
        hubToFenderAtStockIn: forReading(atStockIn),
        camberAtStockDeg: forReading(camberFromHubToFender(atStockIn)),
        hubToFenderAtLowestIn: forReading(atLowestIn),
        camberAtLowestDeg: forReading(camberFromHubToFender(atLowestIn)),
        digest: digestNumbers(traced),
    };
}

export function captureGoldens(): Goldens {
    const corners: Record<string, CornerCapture> = {};
    for (const fitmentCase of FITMENT_CASES) {
        for (const model of CAR_MODELS) {
            for (const corner of CORNERS) {
                corners[cornerKey(fitmentCase.name, model, corner)] =
                    captureCorner(fitmentCase, model, corner);
            }
        }
    }

    const bounce: Record<string, BounceCapture> = {};
    for (const springRateLbIn of CAPTURED_SPRING_RATES_LB_IN) {
        bounce[`${springRateLbIn}lbin`] = captureBounce(springRateLbIn);
    }

    return {
        corners,
        bounce,
        suspension: {
            front: captureSuspension(false),
            rear: captureSuspension(true),
        },
    };
}
