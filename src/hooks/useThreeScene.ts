import * as THREE from "three";
import type { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { useCallback, useEffect, useRef } from "react";

import { makeCar } from "@/assets/carMaker";
import { makeCamera } from "@/assets/cameraMaker";
import { render } from "@/assets/renderer";
import { setUpLighting } from "@/assets/lighting";
import {
  addCorners,
  buildCorners,
  noCorners,
  placeCorners,
  removeCorners,
  type Corners,
} from "@/assets/corners";
import { CORNERS } from "@/constants/wheelPositions";
import { useFitmentStore, useUIStore } from "@/stores";
import type { BounceState } from "@/types/bounce";
import {
  createBounceState,
  isBounceSettled,
  stepBounce,
} from "@/utils/bounceSimulation";
import { bounceCornerRotation } from "@/utils/bounceFrame";
import { inchesToFeet } from "@/utils/unitConversions";

const SCENE_BACKGROUND_COLOR = "#d3d3d3";
const CAMERA_DISTANCE_FT = 25;
const CAR_BODY_Y_FT = -1.4;
const SCENE_CONTAINER_ID = "three-container";

export const useThreeScene = () => {
  const sceneRef = useRef<THREE.Scene | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const carRef = useRef<THREE.Object3D | null>(null);
  const carLoadIdRef = useRef(0);
  const cornersRef = useRef<Corners>(noCorners());
  const bounceStateRef = useRef<BounceState | null>(null);
  const bounceClockRef = useRef(0);

  const model = useFitmentStore((s) => s.model);
  const settings = useFitmentStore((s) => s.settings);
  const wheelDesign = useFitmentStore((s) => s.wheelDesign);
  const bounceRequested = useUIStore((s) => s.bounceRequested);

  // Every callback below reads what it needs off the store rather than closing
  // over it, so all of them keep a stable identity and no effect has to silence
  // the exhaustive-deps rule to avoid being rebuilt each render.

  const loadCar = useCallback(async () => {
    if (!sceneRef.current) return;

    const { model: currentModel } = useFitmentStore.getState();
    const loadId = ++carLoadIdRef.current;

    if (carRef.current) {
      sceneRef.current.remove(carRef.current);
      carRef.current = null;
    }

    let car: THREE.Object3D;
    try {
      car = await makeCar(CAR_BODY_Y_FT, currentModel);
    } catch (error) {
      console.error("Failed to load car model", { model: currentModel }, error);
      return;
    }

    // A newer request started while this one was in flight, so its car is the
    // one that belongs on screen.
    if (loadId !== carLoadIdRef.current || !sceneRef.current) return;

    carRef.current = car;
    sceneRef.current.add(car);
  }, []);

  const rebuildCorners = useCallback(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const { settings: current, model: currentModel, wheelDesign: design } =
      useFitmentStore.getState();

    removeCorners(scene, cornersRef.current);
    cornersRef.current = buildCorners(current, currentModel, design);
    addCorners(scene, cornersRef.current);
  }, []);

  const applyBounceFrame = useCallback((bodyDropIn: number) => {
    const { settings: current } = useFitmentStore.getState();

    if (carRef.current) {
      carRef.current.position.y = -inchesToFeet(bodyDropIn);
    }

    CORNERS.forEach((corner, index) => {
      const { xRad, zRad } = bounceCornerRotation(corner, current, bodyDropIn);
      const { wheels, tires } = cornersRef.current;
      for (const object of [wheels[index], tires[index]]) {
        if (!object) continue;
        object.rotation.x = xRad;
        object.rotation.z = zRad;
      }
    });
  }, []);

  const settleBounce = useCallback(() => {
    bounceStateRef.current = null;
    if (carRef.current) carRef.current.position.y = 0;

    const { settings: current, model: currentModel } =
      useFitmentStore.getState();
    placeCorners(cornersRef.current, current, currentModel);
  }, []);

  const stepBounceFrame = useCallback(() => {
    const state = bounceStateRef.current;
    if (!state) return;

    const now = performance.now() / 1000;
    const elapsedSeconds = now - bounceClockRef.current;
    bounceClockRef.current = now;

    const { springRateLbIn } = useFitmentStore.getState().settings;
    const stepped = stepBounce(state, elapsedSeconds, { springRateLbIn });
    bounceStateRef.current = stepped;

    applyBounceFrame(stepped.displacement);
    if (isBounceSettled(stepped)) settleBounce();
  }, [applyBounceFrame, settleBounce]);

  // These three run before the scene exists on the first render and bail out on
  // the null ref, which is why they are declared above the setup effect: React
  // runs effects in order, so setup does the first build itself rather than
  // having these repeat it.

  useEffect(() => {
    if (!bounceRequested) return;
    bounceStateRef.current = createBounceState(bounceStateRef.current);
    bounceClockRef.current = performance.now() / 1000;
    useUIStore.getState().clearBounceRequest();
  }, [bounceRequested]);

  useEffect(() => {
    loadCar();
  }, [model, loadCar]);

  useEffect(() => {
    rebuildCorners();
  }, [model, wheelDesign, settings, rebuildCorners]);

  useEffect(() => {
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const renderer = render();
    renderer.setClearColor(SCENE_BACKGROUND_COLOR, 1);

    const { camera, controls } = makeCamera(renderer, CAMERA_DISTANCE_FT);
    controlsRef.current = controls;

    const disposeLighting = setUpLighting(scene, renderer);
    loadCar();
    rebuildCorners();

    let frameId = 0;
    const renderFrame = () => {
      frameId = requestAnimationFrame(renderFrame);
      controlsRef.current?.update?.();
      stepBounceFrame();
      renderer.render(scene, camera);
    };
    renderFrame();

    document
      .getElementById(SCENE_CONTAINER_ID)
      ?.appendChild(renderer.domElement);

    return () => {
      // Without all of these the scene leaks a live render loop and a WebGL
      // context on every unmount — including StrictMode's dev-only double
      // mount, which would otherwise run two loops at once.
      cancelAnimationFrame(frameId);
      controlsRef.current?.dispose?.();
      disposeLighting();
      removeCorners(scene, cornersRef.current);
      cornersRef.current = noCorners();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [loadCar, rebuildCorners, stepBounceFrame]);
};
