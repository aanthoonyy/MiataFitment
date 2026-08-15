import { makeTires } from "@/assets/tire";
import { makeWheels } from "@/assets/wheels";
import { axleSettings } from "@/assets/common/axleSettings";
import { calculateWheelPosition } from "@/assets/common/wheelPositionCalculator";
import rollingDiameter from "@/assets/common/rollingDiameter";
import {
    AXLES,
    CAR_MODELS,
    CORNERS,
    isLeft,
    type Axle,
    type CarModel,
    type WheelPosition,
} from "@/constants/wheelPositions";
import { DEFAULT_WHEEL_DESIGN } from "@/constants/wheelDesigns";
import {
    BUMP_AT_DEFAULT_RATE,
    createBounceState,
    isBounceSettled,
    stepBounce,
} from "@/utils/bounceSimulation";
import { bounceCornerRotation } from "@/utils/bounceFrame";
import {
    RIDE_HEIGHT_RANGE,
    STOCK_RIDE_HEIGHT,
    camberFromHubToFender,
    hubToFenderAtRest,
} from "@/utils/suspensionGeometry";
import { FITMENT_CASES, type FitmentCase } from "./fitmentCases";
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

// Body drop swept well past what a real bounce reaches, in both directions, so
// the rebound overshoot above ride height is covered as well as compression.
const BOUNCE_DROP_MIN_IN = -1;
const BOUNCE_DROP_MAX_IN = 3;
const BOUNCE_DROP_STEP_IN = 0.01;

// The drop the default spring rate peaks at, so the landmark values below are
// readable as "what this corner looks like at the top of a normal bump".
const LANDMARK_DROP_IN = BUMP_AT_DEFAULT_RATE;

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

export interface BounceRotationCapture {
    camberAtLandmarkDeg: number;
    toeAtLandmarkRad: number;
    digest: string;
}

export interface Goldens {
    corners: Record<string, CornerCapture>;
    bounce: Record<string, BounceCapture>;
    suspension: Record<string, SuspensionCapture>;
    bounceRotations: Record<string, BounceRotationCapture>;
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

export function captureSuspension(axle: Axle): SuspensionCapture {
    const traced: number[] = [];
    for (const rideHeight of rideHeightSweep()) {
        const hubToFenderIn = hubToFenderAtRest(rideHeight, axle);
        traced.push(hubToFenderIn, camberFromHubToFender(axle, hubToFenderIn));
    }

    const atStockIn = hubToFenderAtRest(STOCK_RIDE_HEIGHT, axle);
    const atLowestIn = hubToFenderAtRest(RIDE_HEIGHT_RANGE.min, axle);

    return {
        hubToFenderAtStockIn: forReading(atStockIn),
        camberAtStockDeg: forReading(camberFromHubToFender(axle, atStockIn)),
        hubToFenderAtLowestIn: forReading(atLowestIn),
        camberAtLowestDeg: forReading(camberFromHubToFender(axle, atLowestIn)),
        digest: digestNumbers(traced),
    };
}

// The per-corner rotation the bounce loop applies each frame. Nothing else in
// the harness reaches it: the corner captures above are all at rest, and the
// bounce traces only cover how far the body moves, not what that does to the
// wheels.
export function captureBounceRotation(
    fitmentCase: FitmentCase,
    corner: WheelPosition,
): BounceRotationCapture {
    const swept: number[] = [];
    const stepCount = Math.round(
        (BOUNCE_DROP_MAX_IN - BOUNCE_DROP_MIN_IN) / BOUNCE_DROP_STEP_IN,
    );
    for (let index = 0; index <= stepCount; index++) {
        const bodyDropIn = BOUNCE_DROP_MIN_IN + index * BOUNCE_DROP_STEP_IN;
        const { xRad, zRad } = bounceCornerRotation(
            corner,
            fitmentCase.settings,
            bodyDropIn,
        );
        swept.push(xRad, zRad);
    }

    const atLandmark = bounceCornerRotation(
        corner,
        fitmentCase.settings,
        LANDMARK_DROP_IN,
    );
    // Backed out of the rotation so the golden reads as an alignment figure
    // rather than a raw axle angle.
    const camberRad = isLeft(corner)
        ? atLandmark.xRad - Math.PI / 2
        : Math.PI / 2 - atLandmark.xRad;

    return {
        camberAtLandmarkDeg: forReading((camberRad * 180) / Math.PI),
        toeAtLandmarkRad: forReading(atLandmark.zRad),
        digest: digestNumbers(swept),
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

    const bounceRotations: Record<string, BounceRotationCapture> = {};
    for (const fitmentCase of FITMENT_CASES) {
        for (const corner of CORNERS) {
            bounceRotations[`${fitmentCase.name}/${corner}`] =
                captureBounceRotation(fitmentCase, corner);
        }
    }

    const suspension: Record<string, SuspensionCapture> = {};
    for (const axle of AXLES) suspension[axle] = captureSuspension(axle);

    return { corners, bounce, suspension, bounceRotations };
}
