import * as THREE from "three";
import type { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { useCallback, useEffect, useRef } from "react";

import { makeCar } from "@/assets/carMaker";
import { makeCamera } from "@/assets/cameraMaker";
import { render } from "@/assets/renderer";
import { setUpLighting } from "@/assets/lighting";
import { makeWheels } from "@/assets/wheels";
import { makeTires } from "@/assets/tire";
import rollingDiameter from "@/assets/common/rollingDiameter";
import type { Settings } from "@/types/settings";
import { WheelPosition } from "@/constants/wheelPositions";
import { useFitmentStore, useUIStore } from "@/stores";
import type { BounceState } from "@/types/bounce";
import {
  INITIAL_DISPLACEMENT,
  stepBounce,
  isBounceSettled,
} from "@/utils/bounceSimulation";
import {
  frontCamberFromHubToFender,
  rearCamberFromHubToFender,
  hubToFenderAtRest,
} from "@/utils/suspensionGeometry";
import { calculateWheelPosition } from "@/assets/common/wheelPositionCalculator";
import { disposeObject } from "@/assets/common/disposeObject";

export const useThreeScene = () => {
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const carRefs = useRef<THREE.Object3D[]>([]);
  const wheelRefs = useRef<THREE.Object3D[]>([]);
  const tireRefs = useRef<THREE.Object3D[]>([]);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const bounceStateRef = useRef<BounceState | null>(null);
  const prevTimeRef = useRef<number>(0);

  // Subscribe to store values
  const model = useFitmentStore((s) => s.model);
  const settings = useFitmentStore((s) => s.settings);
  const wheelDesign = useFitmentStore((s) => s.wheelDesign);

  useEffect(() => {
    if (sceneRef.current) {
      createAndAddCar();
      createAndAddTires();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model]);

  // Swapping wheel design only needs the wheels rebuilt, not the car reloaded.
  useEffect(() => {
    if (sceneRef.current) createAndAddTires();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wheelDesign]);

  const applyWheelPosition = useCallback(
    (
      wheel: THREE.Object3D,
      tire: THREE.Object3D,
      position: WheelPosition,
      settings: Settings,
    ) => {
      const curModel = useFitmentStore.getState().model;
      const wd = calculateWheelPosition(position, settings, curModel);
      wheel.rotation.set(wd.rotation.x, 0, wd.rotation.z);
      wheel.position.set(wd.position.x, wd.position.y, wd.position.z);
      tire.rotation.set(wd.rotation.x, 0, wd.rotation.z);
      tire.position.set(wd.position.x, wd.position.y, wd.position.z);
    },
    [],
  );

  const updateWheelAndTireSizes = useCallback((settings: Settings) => {
    if (!sceneRef.current || wheelRefs.current.length === 0) return;

    const curModel = useFitmentStore.getState().model;
    const curDesign = useFitmentStore.getState().wheelDesign;

    wheelRefs.current.forEach((wheel) => {
      sceneRef.current?.remove(wheel);
      disposeObject(wheel);
    });
    tireRefs.current.forEach((tire) => {
      sceneRef.current?.remove(tire);
      disposeObject(tire);
    });

    const wheels = [
      makeWheels(
        settings.frontWheelWidth,
        settings.frontWheelDiameter,
        WheelPosition.FRONT_LEFT,
        settings,
        curModel,
        curDesign,
      ),
      makeWheels(
        settings.rearWheelWidth,
        settings.rearWheelDiameter,
        WheelPosition.REAR_LEFT,
        settings,
        curModel,
        curDesign,
      ),
      makeWheels(
        settings.rearWheelWidth,
        settings.rearWheelDiameter,
        WheelPosition.REAR_RIGHT,
        settings,
        curModel,
        curDesign,
      ),
      makeWheels(
        settings.frontWheelWidth,
        settings.frontWheelDiameter,
        WheelPosition.FRONT_RIGHT,
        settings,
        curModel,
        curDesign,
      ),
    ];
    wheelRefs.current = wheels;
    wheels.forEach((wheel) => sceneRef.current?.add(wheel));

    const tires = [
      makeTires(WheelPosition.FRONT_LEFT, settings, curModel),
      makeTires(WheelPosition.REAR_LEFT, settings, curModel),
      makeTires(WheelPosition.REAR_RIGHT, settings, curModel),
      makeTires(WheelPosition.FRONT_RIGHT, settings, curModel),
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

  let car: THREE.Object3D;
  try {
    car = await makeCar(-1.4, model);
  } catch (e) {
    console.error("Failed to load car model", { model }, e);
    return;
  }

  // if a newer request happened while we were loading, ignore this result
  if (loadId !== carLoadIdRef.current || !sceneRef.current) return;

  carRefs.current = [car];
  sceneRef.current.add(car);
}, [model]);


  const createAndAddTires = useCallback(() => {
    if (!sceneRef.current) return;

    const curModel = useFitmentStore.getState().model;
    const curDesign = useFitmentStore.getState().wheelDesign;

    tireRefs.current.forEach((tire) => {
      sceneRef.current?.remove(tire);
      disposeObject(tire);
    });
    wheelRefs.current.forEach((wheel) => {
      sceneRef.current?.remove(wheel);
      disposeObject(wheel);
    });

    const wheels = [
      makeWheels(
        settings.frontWheelWidth,
        settings.frontWheelDiameter,
        WheelPosition.FRONT_LEFT,
        settings,
        curModel,
        curDesign,
      ),
      makeWheels(
        settings.rearWheelWidth,
        settings.rearWheelDiameter,
        WheelPosition.REAR_LEFT,
        settings,
        curModel,
        curDesign,
      ),
      makeWheels(
        settings.rearWheelWidth,
        settings.rearWheelDiameter,
        WheelPosition.REAR_RIGHT,
        settings,
        curModel,
        curDesign,
      ),
      makeWheels(
        settings.frontWheelWidth,
        settings.frontWheelDiameter,
        WheelPosition.FRONT_RIGHT,
        settings,
        curModel,
        curDesign,
      ),
    ];
    wheelRefs.current = wheels;
    wheels.forEach((wheel) => sceneRef.current?.add(wheel));

    const tires = [
      makeTires(WheelPosition.FRONT_LEFT, settings, curModel),
      makeTires(WheelPosition.REAR_LEFT, settings, curModel),
      makeTires(WheelPosition.REAR_RIGHT, settings, curModel),
      makeTires(WheelPosition.FRONT_RIGHT, settings, curModel),
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

    const disposeLighting = setUpLighting(scene, renderer);
    createAndAddCar();
    createAndAddTires();

    let frameId = 0;
    const animateLoop = () => {
      frameId = requestAnimationFrame(animateLoop);
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
        const positions: WheelPosition[] = ["FL", "BL", "BR", "FR"];
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
          const m = useFitmentStore.getState().model;
          const posKeys: WheelPosition[] = [
            "FL",
            "BL",
            "BR",
            "FR",
          ];
          for (let j = 0; j < posKeys.length; j++) {
            const w = wheelRefs.current[j];
            const t = tireRefs.current[j];
            if (!w || !t) continue;
            const wd = calculateWheelPosition(posKeys[j], s, m);
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
      // Without all three of these the scene leaks a live render loop and a
      // WebGL context on every unmount — including StrictMode's dev-only
      // double-mount, which would otherwise run two loops at once.
      cancelAnimationFrame(frameId);
      controlsRef.current?.dispose?.();
      disposeLighting();
      renderer.dispose();
      renderer.domElement.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // update wheels/tires whenever settings change
  useEffect(() => {
    if (!sceneRef.current || wheelRefs.current.length === 0) return;

    applyWheelPosition(
      wheelRefs.current[0],
      tireRefs.current[0],
      "FL",
      settings,
    );
    applyWheelPosition(
      wheelRefs.current[1],
      tireRefs.current[1],
      "BL",
      settings,
    );
    applyWheelPosition(
      wheelRefs.current[2],
      tireRefs.current[2],
      "BR",
      settings,
    );
    applyWheelPosition(
      wheelRefs.current[3],
      tireRefs.current[3],
      "FR",
      settings,
    );

    updateWheelAndTireSizes(settings);
  }, [settings, applyWheelPosition, updateWheelAndTireSizes]);

  return { sceneRef };
};
