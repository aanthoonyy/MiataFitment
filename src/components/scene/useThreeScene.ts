import * as THREE from "three";
import { useRef, useEffect, useCallback } from "react";
import { makeCamera } from "../../assets/cameraMaker";
import { makeCar } from "../../assets/carMaker";
import rollingDiameter from "../../assets/common/rollingDiameter";
import { setUpLighting } from "../../assets/lighting";
import { makeTires } from "../../assets/tire";
import { makeWheels } from "../../assets/wheels";
import { WheelPosition, WHEEL_POSITIONS } from "../../constants/wheelPositions";
import { Settings } from "../../types/settings";
import { mmToFeet } from "../../utils/unitConversions";
import { render } from "../../assets/renderer";

const useThreeScene = (settings: Settings, currentModel: string) => {
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const carRefs = useRef<THREE.Object3D[]>([]);
  const wheelRefs = useRef<THREE.Object3D[]>([]);
  const tireRefs = useRef<THREE.Object3D[]>([]);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    if (sceneRef.current) {
      createAndAddCar();
    }
  }, [currentModel]);

  const updateWheelPosition = useCallback(
    (
      wheel: THREE.Object3D,
      tire: THREE.Object3D,
      position: string,
      settings: Settings
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
          offset = -mmToFeet(settings.frontWheelOffset); // Convert mm to feet
          spacer = mmToFeet(settings.frontWheelSpacer); // Convert mm to feet
          toe = settings.frontToe;
          baseX =
            WHEEL_POSITIONS.FRONT.LEFT.x +
            settings.frontCaster / WHEEL_POSITIONS.FRONT.LEFT.casterOffset;
          baseZ = WHEEL_POSITIONS.FRONT.LEFT.z;
          rideY = settings.rideHeightFront;
          break;

        case WheelPosition.FRONT_RIGHT:
          camberDeg = settings.frontCamber;
          offset = mmToFeet(settings.frontWheelOffset); // Convert mm to feet
          spacer = -mmToFeet(settings.frontWheelSpacer); // Convert mm to feet
          toe = -settings.frontToe;
          baseX =
            WHEEL_POSITIONS.FRONT.RIGHT.x +
            settings.frontCaster / WHEEL_POSITIONS.FRONT.RIGHT.casterOffset;
          baseZ = WHEEL_POSITIONS.FRONT.RIGHT.z;
          rideY = settings.rideHeightFront;
          break;

        case WheelPosition.REAR_LEFT:
          camberDeg = settings.rearCamber;
          offset = -mmToFeet(settings.rearWheelOffset); // Convert mm to feet
          spacer = mmToFeet(settings.rearWheelSpacer); // Convert mm to feet
          toe = settings.rearToe;
          baseX = WHEEL_POSITIONS.REAR.LEFT.x;
          baseZ = WHEEL_POSITIONS.REAR.LEFT.z;
          rideY = settings.rideHeightRear;
          break;

        case WheelPosition.REAR_RIGHT:
          camberDeg = settings.rearCamber;
          offset = mmToFeet(settings.rearWheelOffset); // Convert mm to feet
          spacer = -mmToFeet(settings.rearWheelSpacer); // Convert mm to feet
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
            : settings.rearTireSidewall
        ) *
          Math.sin(toe)) /
        12;

      // apply to both wheel and tire **the same** Z‐offset
      const zPos = baseZ + offset + spacer;

      // rotation X is camber, rotation Z is toe slip
      const rotX = Math.PI / 2 + camberRad;
      const rotZ = toeRadiusComp;

      wheel.rotation.set(rotX, 0, rotZ);
      wheel.position.set(baseX, rideY, zPos);

      tire.rotation.set(rotX, 0, rotZ);
      tire.position.set(baseX, rideY, zPos);
    },
    []
  );

  const updateWheelAndTireSizes = useCallback((settings: Settings) => {
    if (sceneRef.current && wheelRefs.current.length > 0) {
      // Remove old wheels and tires
      wheelRefs.current.forEach((wheel) => sceneRef.current?.remove(wheel));
      tireRefs.current.forEach((tire) => sceneRef.current?.remove(tire));

      // Create and add new wheels with updated dimensions
      const wheels = [
        makeWheels(
          THREE,
          WHEEL_POSITIONS.FRONT.LEFT.x,
          WHEEL_POSITIONS.FRONT.LEFT.z,
          1,
          settings.frontWheelWidth,
          settings.frontWheelDiameter,
          WheelPosition.FRONT_LEFT,
          settings
        ),
        makeWheels(
          THREE,
          WHEEL_POSITIONS.REAR.LEFT.x,
          WHEEL_POSITIONS.REAR.LEFT.z,
          1,
          settings.rearWheelWidth,
          settings.rearWheelDiameter,
          WheelPosition.REAR_LEFT,
          settings
        ),
        makeWheels(
          THREE,
          WHEEL_POSITIONS.REAR.RIGHT.x,
          WHEEL_POSITIONS.REAR.RIGHT.z,
          1,
          settings.rearWheelWidth,
          settings.rearWheelDiameter,
          WheelPosition.REAR_RIGHT,
          settings
        ),
        makeWheels(
          THREE,
          WHEEL_POSITIONS.FRONT.RIGHT.x,
          WHEEL_POSITIONS.FRONT.RIGHT.z,
          1,
          settings.frontWheelWidth,
          settings.frontWheelDiameter,
          WheelPosition.FRONT_RIGHT,
          settings
        ),
      ];
      wheelRefs.current = wheels;
      wheels.forEach((wheel) => sceneRef.current?.add(wheel));

      // Create and add new tires with updated dimensions
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
          settings
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
          settings
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
          settings
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
          settings
        ),
      ];
      tireRefs.current = tires;
      tires.forEach((tire) => sceneRef.current?.add(tire));
    }
  }, []);

  const createAndAddCar = useCallback(async () => {
    if (sceneRef.current) {

      carRefs.current.forEach((car) => sceneRef.current?.remove(car));
      carRefs.current = [];

      const car = await makeCar(THREE, -1.4, currentModel);
      carRefs.current.push(car);
      sceneRef.current.add(car);
    }
  }, [currentModel]);

  const createAndAddTires = useCallback(() => {
    if (sceneRef.current) {

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
          settings
        ),
        makeWheels(
          THREE,
          WHEEL_POSITIONS.REAR.LEFT.x,
          WHEEL_POSITIONS.REAR.LEFT.z,
          1,
          settings.rearWheelWidth,
          settings.rearWheelDiameter,
          WheelPosition.REAR_LEFT,
          settings
        ),
        makeWheels(
          THREE,
          WHEEL_POSITIONS.REAR.RIGHT.x,
          WHEEL_POSITIONS.REAR.RIGHT.z,
          1,
          settings.rearWheelWidth,
          settings.rearWheelDiameter,
          WheelPosition.REAR_RIGHT,
          settings
        ),
        makeWheels(
          THREE,
          WHEEL_POSITIONS.FRONT.RIGHT.x,
          WHEEL_POSITIONS.FRONT.RIGHT.z,
          1,
          settings.frontWheelWidth,
          settings.frontWheelDiameter,
          WheelPosition.FRONT_RIGHT,
          settings
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
          settings
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
          settings
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
          settings
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
          settings
        ),
      ];
      tireRefs.current = tires;
      tires.forEach((tire) => sceneRef.current?.add(tire));
    }
  }, [settings]);

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
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      renderer.render(scene, camera);
    };
    animateLoop();

    const container = document.getElementById("three-container");
    if (container) {
      container.appendChild(renderer.domElement);
    }

    return () => {
      if (rendererRef.current?.domElement?.parentElement) {
        rendererRef.current.domElement.parentElement.removeChild(
          rendererRef.current.domElement
        );
      }
    };
  }, []);

  useEffect(() => {
    if (sceneRef.current && wheelRefs.current.length > 0) {
      updateWheelPosition(
        wheelRefs.current[0],
        tireRefs.current[0],
        "FL",
        settings
      );
      updateWheelPosition(
        wheelRefs.current[1],
        tireRefs.current[1],
        "BL",
        settings
      );
      updateWheelPosition(
        wheelRefs.current[2],
        tireRefs.current[2],
        "BR",
        settings
      );
      updateWheelPosition(
        wheelRefs.current[3],
        tireRefs.current[3],
        "FR",
        settings
      );
      updateWheelAndTireSizes(settings);
    }
  }, [settings, updateWheelPosition, updateWheelAndTireSizes]);

  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (rendererRef.current && containerRef.current) {
      containerRef.current.appendChild(rendererRef.current.domElement);
    }
  }, []);

  return { sceneRef, containerRef };
};

export default useThreeScene;
