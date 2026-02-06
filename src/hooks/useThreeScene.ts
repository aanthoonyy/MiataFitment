import * as THREE from "three";
import { useCallback, useEffect, useRef } from "react";

import { makeCar } from "@/assets/carMaker";
import { makeCamera } from "@/assets/cameraMaker";
import { render } from "@/assets/renderer";
import { setUpLighting } from "@/assets/lighting";
import { makeWheels } from "@/assets/wheels";
import { makeTires } from "@/assets/tire";
import rollingDiameter from "@/assets/common/rollingDiameter";
import type { Settings } from "@/types/settings";
import { WheelPosition, WHEEL_POSITIONS } from "@/constants/wheelPositions";
import { mmToFeet } from "@/utils/unitConversions";
import { useFitmentStore, useUIStore } from "@/stores";
import {
  type BounceState,
  INITIAL_DISPLACEMENT,
  stepBounce,
  isBounceSettled,
  frontCamberFromHubToFender,
  rearCamberFromHubToFender,
  hubToFenderAtRest,
} from "@/utils/bounceSimulation";
import { calculateWheelPosition } from "@/assets/common/wheelPositionCalculator";

export const useThreeScene = () => {
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const carRefs = useRef<THREE.Object3D[]>([]);
  const wheelRefs = useRef<THREE.Object3D[]>([]);
  const tireRefs = useRef<THREE.Object3D[]>([]);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<any>(null);
  const bounceStateRef = useRef<BounceState | null>(null);
  const prevTimeRef = useRef<number>(0);

  // Subscribe to store values
  const model = useFitmentStore((s) => s.model);
  const settings = useFitmentStore((s) => s.settings);

  useEffect(() => {
    if (sceneRef.current) createAndAddCar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model]);

  const updateWheelPosition = useCallback(
    (
      wheel: THREE.Object3D,
      tire: THREE.Object3D,
      position: string,
      settings: Settings,
    ) => {
      let camberDeg = 0,
        offset = 0,
        spacer = 0,
        toe = 0,
        baseX = 0,
        baseZ = 0,
        rideY = 0;

      switch (position) {
        case WheelPosition.FRONT_LEFT:
          camberDeg = settings.frontCamber;
          offset = -mmToFeet(settings.frontWheelOffset);
          spacer = mmToFeet(settings.frontWheelSpacer);
          toe = settings.frontToe;
          baseX =
            WHEEL_POSITIONS.FRONT.LEFT.x +
            settings.frontCaster / WHEEL_POSITIONS.FRONT.LEFT.casterOffset;
          baseZ = WHEEL_POSITIONS.FRONT.LEFT.z;
          rideY = settings.rideHeightFront;
          break;

        case WheelPosition.FRONT_RIGHT:
          camberDeg = settings.frontCamber;
          offset = mmToFeet(settings.frontWheelOffset);
          spacer = -mmToFeet(settings.frontWheelSpacer);
          toe = -settings.frontToe;
          baseX =
            WHEEL_POSITIONS.FRONT.RIGHT.x +
            settings.frontCaster / WHEEL_POSITIONS.FRONT.RIGHT.casterOffset;
          baseZ = WHEEL_POSITIONS.FRONT.RIGHT.z;
          rideY = settings.rideHeightFront;
          break;

        case WheelPosition.REAR_LEFT:
          camberDeg = settings.rearCamber;
          offset = -mmToFeet(settings.rearWheelOffset);
          spacer = mmToFeet(settings.rearWheelSpacer);
          toe = settings.rearToe;
          baseX = WHEEL_POSITIONS.REAR.LEFT.x;
          baseZ = WHEEL_POSITIONS.REAR.LEFT.z;
          rideY = settings.rideHeightRear;
          break;

        case WheelPosition.REAR_RIGHT:
          camberDeg = settings.rearCamber;
          offset = mmToFeet(settings.rearWheelOffset);
          spacer = -mmToFeet(settings.rearWheelSpacer);
          toe = -settings.rearToe;
          baseX = WHEEL_POSITIONS.REAR.RIGHT.x;
          baseZ = WHEEL_POSITIONS.REAR.RIGHT.z;
          rideY = settings.rideHeightRear;
          break;

        default:
          return;
      }

      const camberRad = (Math.min(Math.max(camberDeg, -20), 1) * Math.PI) / 180;

      const toeRadiusComp =
        (rollingDiameter(
          position.startsWith("F")
            ? settings.frontWheelDiameter
            : settings.rearWheelDiameter,
          position.startsWith("F")
            ? settings.frontTireWidth
            : settings.rearTireWidth,
          position.startsWith("F")
            ? settings.frontTireSidewall
            : settings.rearTireSidewall,
        ) *
          Math.sin(toe)) /
        12;

      const zPos = baseZ + offset + spacer;
      const rotX = Math.PI / 2 + camberRad;
      const rotZ = toeRadiusComp;

      wheel.rotation.set(rotX, 0, rotZ);
      wheel.position.set(baseX, rideY, zPos);

      tire.rotation.set(rotX, 0, rotZ);
      tire.position.set(baseX, rideY, zPos);
    },
    [],
  );

  const updateWheelAndTireSizes = useCallback((settings: Settings) => {
    if (!sceneRef.current || wheelRefs.current.length === 0) return;

    wheelRefs.current.forEach((wheel) => sceneRef.current?.remove(wheel));
    tireRefs.current.forEach((tire) => sceneRef.current?.remove(tire));

    const wheels = [
      makeWheels(
        THREE,
        WHEEL_POSITIONS.FRONT.LEFT.x,
        WHEEL_POSITIONS.FRONT.LEFT.z,
        1,
        settings.frontWheelWidth,
        settings.frontWheelDiameter,
        WheelPosition.FRONT_LEFT,
        settings,
      ),
      makeWheels(
        THREE,
        WHEEL_POSITIONS.REAR.LEFT.x,
        WHEEL_POSITIONS.REAR.LEFT.z,
        1,
        settings.rearWheelWidth,
        settings.rearWheelDiameter,
        WheelPosition.REAR_LEFT,
        settings,
      ),
      makeWheels(
        THREE,
        WHEEL_POSITIONS.REAR.RIGHT.x,
        WHEEL_POSITIONS.REAR.RIGHT.z,
        1,
        settings.rearWheelWidth,
        settings.rearWheelDiameter,
        WheelPosition.REAR_RIGHT,
        settings,
      ),
      makeWheels(
        THREE,
        WHEEL_POSITIONS.FRONT.RIGHT.x,
        WHEEL_POSITIONS.FRONT.RIGHT.z,
        1,
        settings.frontWheelWidth,
        settings.frontWheelDiameter,
        WheelPosition.FRONT_RIGHT,
        settings,
      ),
    ];
    wheelRefs.current = wheels;
    wheels.forEach((wheel) => sceneRef.current?.add(wheel));

    const tires = [
      makeTires(
        THREE,
        WHEEL_POSITIONS.FRONT.LEFT.x,
        WHEEL_POSITIONS.FRONT.LEFT.z,
        1,
        settings.frontWheelDiameter,
        settings.frontWheelWidth,
        settings.frontTireWidth,
        settings.frontTireSidewall,
        WheelPosition.FRONT_LEFT,
        settings,
      ),
      makeTires(
        THREE,
        WHEEL_POSITIONS.REAR.LEFT.x,
        WHEEL_POSITIONS.REAR.LEFT.z,
        1,
        settings.rearWheelDiameter,
        settings.rearWheelWidth,
        settings.rearTireWidth,
        settings.rearTireSidewall,
        WheelPosition.REAR_LEFT,
        settings,
      ),
      makeTires(
        THREE,
        WHEEL_POSITIONS.REAR.RIGHT.x,
        WHEEL_POSITIONS.REAR.RIGHT.z,
        1,
        settings.rearWheelDiameter,
        settings.rearWheelWidth,
        settings.rearTireWidth,
        settings.rearTireSidewall,
        WheelPosition.REAR_RIGHT,
        settings,
      ),
      makeTires(
        THREE,
        WHEEL_POSITIONS.FRONT.RIGHT.x,
        WHEEL_POSITIONS.FRONT.RIGHT.z,
        1,
        settings.frontWheelDiameter,
        settings.frontWheelWidth,
        settings.frontTireWidth,
        settings.frontTireSidewall,
        WheelPosition.FRONT_RIGHT,
        settings,
      ),
    ];
    tireRefs.current = tires;
    tires.forEach((tire) => sceneRef.current?.add(tire));
  }, []);

const carLoadIdRef = useRef(0);

const createAndAddCar = useCallback(async () => {
  if (!sceneRef.current) return;

  const loadId = ++carLoadIdRef.current;

  // remove existing immediately
  carRefs.current.forEach((c) => sceneRef.current!.remove(c));
  carRefs.current = [];

  const car = await makeCar(THREE, -1.4, model);

  // if a newer request happened while we were loading, ignore this result
  if (loadId !== carLoadIdRef.current) return;

  carRefs.current = [car];
  sceneRef.current.add(car);
}, [model]);


  const createAndAddTires = useCallback(() => {
    if (!sceneRef.current) return;

    tireRefs.current.forEach((tire) => sceneRef.current?.remove(tire));
    wheelRefs.current.forEach((wheel) => sceneRef.current?.remove(wheel));

    const wheels = [
      makeWheels(
        THREE,
        WHEEL_POSITIONS.FRONT.LEFT.x,
        WHEEL_POSITIONS.FRONT.LEFT.z,
        1,
        settings.frontWheelWidth,
        settings.frontWheelDiameter,
        WheelPosition.FRONT_LEFT,
        settings,
      ),
      makeWheels(
        THREE,
        WHEEL_POSITIONS.REAR.LEFT.x,
        WHEEL_POSITIONS.REAR.LEFT.z,
        1,
        settings.rearWheelWidth,
        settings.rearWheelDiameter,
        WheelPosition.REAR_LEFT,
        settings,
      ),
      makeWheels(
        THREE,
        WHEEL_POSITIONS.REAR.RIGHT.x,
        WHEEL_POSITIONS.REAR.RIGHT.z,
        1,
        settings.rearWheelWidth,
        settings.rearWheelDiameter,
        WheelPosition.REAR_RIGHT,
        settings,
      ),
      makeWheels(
        THREE,
        WHEEL_POSITIONS.FRONT.RIGHT.x,
        WHEEL_POSITIONS.FRONT.RIGHT.z,
        1,
        settings.frontWheelWidth,
        settings.frontWheelDiameter,
        WheelPosition.FRONT_RIGHT,
        settings,
      ),
    ];
    wheelRefs.current = wheels;
    wheels.forEach((wheel) => sceneRef.current?.add(wheel));

    const tires = [
      makeTires(
        THREE,
        WHEEL_POSITIONS.FRONT.LEFT.x,
        WHEEL_POSITIONS.FRONT.LEFT.z,
        1,
        settings.frontWheelDiameter,
        settings.frontWheelWidth,
        settings.frontTireWidth,
        settings.frontTireSidewall,
        WheelPosition.FRONT_LEFT,
        settings,
      ),
      makeTires(
        THREE,
        WHEEL_POSITIONS.REAR.LEFT.x,
        WHEEL_POSITIONS.REAR.LEFT.z,
        1,
        settings.rearWheelDiameter,
        settings.rearWheelWidth,
        settings.rearTireWidth,
        settings.rearTireSidewall,
        WheelPosition.REAR_LEFT,
        settings,
      ),
      makeTires(
        THREE,
        WHEEL_POSITIONS.REAR.RIGHT.x,
        WHEEL_POSITIONS.REAR.RIGHT.z,
        1,
        settings.rearWheelDiameter,
        settings.rearWheelWidth,
        settings.rearTireWidth,
        settings.rearTireSidewall,
        WheelPosition.REAR_RIGHT,
        settings,
      ),
      makeTires(
        THREE,
        WHEEL_POSITIONS.FRONT.RIGHT.x,
        WHEEL_POSITIONS.FRONT.RIGHT.z,
        1,
        settings.frontWheelDiameter,
        settings.frontWheelWidth,
        settings.frontTireWidth,
        settings.frontTireSidewall,
        WheelPosition.FRONT_RIGHT,
        settings,
      ),
    ];
    tireRefs.current = tires;
    tires.forEach((tire) => sceneRef.current?.add(tire));
  }, [settings]);

  // Bounce trigger
  const bounceRequested = useUIStore((s) => s.bounceRequested);

  useEffect(() => {
    if (bounceRequested) {
      bounceStateRef.current = {
        displacement: INITIAL_DISPLACEMENT,
        velocity: 0,
      };
      prevTimeRef.current = performance.now() / 1000;
      useUIStore.getState().clearBounceRequest();
    }
  }, [bounceRequested]);

  // initial scene setup
  useEffect(() => {
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const renderer = render();
    rendererRef.current = renderer;
    renderer.setClearColor("#d3d3d3", 1);

    const { camera, controls } = makeCamera(renderer, 25);
    cameraRef.current = camera;
    controlsRef.current = controls;

    setUpLighting(scene);
    createAndAddCar();
    createAndAddTires();

    const animateLoop = () => {
      requestAnimationFrame(animateLoop);
      controlsRef.current?.update?.();

      // Bounce simulation step
      if (bounceStateRef.current) {
        const now = performance.now() / 1000;
        const dt = now - prevTimeRef.current;
        prevTimeRef.current = now;

        const curSettings = useFitmentStore.getState().settings;
        bounceStateRef.current = stepBounce(bounceStateRef.current, dt, {
          springRateLbIn: curSettings.springRateLbIn,
        });
        const disp = bounceStateRef.current.displacement;

        // Move car body (inches → feet, negative because body drops)
        if (carRefs.current[0]) {
          carRefs.current[0].position.y = -(disp / 12);
        }

        // Update each wheel/tire with dynamic camber
        const positions = ["FL", "BL", "BR", "FR"];
        for (let i = 0; i < positions.length; i++) {
          const wheel = wheelRefs.current[i];
          const tire = tireRefs.current[i];
          if (!wheel || !tire) continue;

          const isRear = positions[i].startsWith("B");
          const rideHeight = isRear
            ? curSettings.rideHeightRear
            : curSettings.rideHeightFront;
          // 1) hub-to-fender at rest and now
          const hRest = hubToFenderAtRest(rideHeight, isRear);
          const hNow = hRest - disp;

          // 2) geometry camber at rest and now
          const camberGeomRest = isRear
            ? rearCamberFromHubToFender(hRest)
            : frontCamberFromHubToFender(hRest);

          const camberGeomNow = isRear
            ? rearCamberFromHubToFender(hNow)
            : frontCamberFromHubToFender(hNow);

          // 3) ONLY apply the change due to bounce
          const deltaCamber = camberGeomNow - camberGeomRest;

          // 4) add on top of the user's camber setting
          // TODO: replace these field names with yours:
          const baseCamber = isRear
            ? curSettings.rearCamber
            : curSettings.frontCamber;

          const camberDeg = baseCamber + deltaCamber;
          const camberRad = (camberDeg * Math.PI) / 180;

          const toe = isRear ? curSettings.rearToe : curSettings.frontToe;
          const toeRadiusComp =
            (rollingDiameter(
              isRear
                ? curSettings.rearWheelDiameter
                : curSettings.frontWheelDiameter,
              isRear ? curSettings.rearTireWidth : curSettings.frontTireWidth,
              isRear
                ? curSettings.rearTireSidewall
                : curSettings.frontTireSidewall,
            ) *
              Math.sin(positions[i].includes("L") ? toe : -toe)) /
            12;

          const isLeft = positions[i].includes("L");
          const rotX = isLeft
            ? Math.PI / 2 + camberRad
            : Math.PI / 2 - camberRad;
          wheel.rotation.x = rotX;
          wheel.rotation.z = toeRadiusComp;
          tire.rotation.x = rotX;
          tire.rotation.z = toeRadiusComp;
        }

        // Check if settled
        if (isBounceSettled(bounceStateRef.current)) {
          bounceStateRef.current = null;
          // Restore car body position
          if (carRefs.current[0]) {
            carRefs.current[0].position.y = 0;
          }
          // Re-apply user settings using calculateWheelPosition (matches makeWheels)
          const s = useFitmentStore.getState().settings;
          const posKeys: Array<"FL" | "BL" | "BR" | "FR"> = [
            "FL",
            "BL",
            "BR",
            "FR",
          ];
          for (let j = 0; j < posKeys.length; j++) {
            const w = wheelRefs.current[j];
            const t = tireRefs.current[j];
            if (!w || !t) continue;
            const wd = calculateWheelPosition(posKeys[j], s);
            w.rotation.set(wd.rotation.x, 0, wd.rotation.z);
            w.position.set(wd.position.x, wd.position.y, wd.position.z);
            t.rotation.set(wd.rotation.x, 0, wd.rotation.z);
            t.position.set(wd.position.x, wd.position.y, wd.position.z);
          }
        }
      }

      renderer.render(scene, camera);
    };
    animateLoop();

    const container = document.getElementById("three-container");
    if (container) container.appendChild(renderer.domElement);

    return () => {
      container?.removeChild(renderer.domElement);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // update wheels/tires whenever settings change
  useEffect(() => {
    if (!sceneRef.current || wheelRefs.current.length === 0) return;

    updateWheelPosition(
      wheelRefs.current[0],
      tireRefs.current[0],
      "FL",
      settings,
    );
    updateWheelPosition(
      wheelRefs.current[1],
      tireRefs.current[1],
      "BL",
      settings,
    );
    updateWheelPosition(
      wheelRefs.current[2],
      tireRefs.current[2],
      "BR",
      settings,
    );
    updateWheelPosition(
      wheelRefs.current[3],
      tireRefs.current[3],
      "FR",
      settings,
    );

    updateWheelAndTireSizes(settings);
  }, [settings, updateWheelPosition, updateWheelAndTireSizes]);

  return { sceneRef };
};
