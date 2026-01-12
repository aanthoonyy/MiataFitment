import * as THREE from "three";
import FitmentSettings from "./fitmentSettings";
import { makeCar } from "./assets/carMaker";
import { makeCamera } from "./assets/cameraMaker";
import { render } from "./assets/renderer";
import { setUpLighting } from "./assets/lighting";
import { makeWheels } from "./assets/wheels";
import { makeTires } from "./assets/tire";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import rollingDiameter from "./assets/common/rollingDiameter";
import Header, { CarModelContext, SettingsContext } from "./components/Header";
import { Settings, DEFAULT_SETTINGS } from "./types/settings";
import { WheelPosition, WHEEL_POSITIONS } from "./constants/wheelPositions";
import { mmToFeet } from "./utils/unitConversions";
import { FitmentConfigProvider } from "./contexts/FitmentSettingsContext";

const useThreeScene = (settings: Settings, currentModel: string) => {
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const carRefs = useRef<THREE.Object3D[]>([]);
  const wheelRefs = useRef<THREE.Object3D[]>([]);
  const tireRefs = useRef<THREE.Object3D[]>([]);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    if (sceneRef.current) createAndAddCar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            : settings.rearTireSidewall
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
    []
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
  }, []);

  const createAndAddCar = useCallback(async () => {
    if (!sceneRef.current) return;

    carRefs.current.forEach((car) => sceneRef.current?.remove(car));
    carRefs.current = [];

    const car = await makeCar(THREE, -1.4, currentModel);
    carRefs.current.push(car);
    sceneRef.current.add(car);
  }, [currentModel]);

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
  }, [settings]);

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
  }, [settings, updateWheelPosition, updateWheelAndTireSizes]);

  return { sceneRef };
};

const MainComponent = () => {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [currentModel, setCurrentModel] = useState("na");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useThreeScene(settings, currentModel);

  const carContextValue = useMemo(
    () => ({
      model: currentModel,
      setModel: (newModel: string) => setCurrentModel(newModel),
    }),
    [currentModel]
  );

  const settingsContextValue = useMemo(
    () => ({ isSettingsOpen, setIsSettingsOpen }),
    [isSettingsOpen]
  );

  const setConfig = useCallback(
    (next: { model: string; settings: Settings }) => {
      setCurrentModel(next.model);
      setSettings(next.settings);
    },
    []
  );

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  }, []);

  const fitmentValue = useMemo(
    () => ({
      config: { model: currentModel, settings },
      setConfig,
      updateSettings,
    }),
    [currentModel, settings, setConfig, updateSettings]
  );

  return (
    <FitmentConfigProvider value={fitmentValue}>
      <CarModelContext.Provider value={carContextValue}>
        <SettingsContext.Provider value={settingsContextValue}>
          <div className="fixed inset-0 h-screen w-screen overflow-hidden bg-background">
            <div className="fixed inset-x-0 top-0 z-50">
              <Header />
            </div>

            <div className="absolute inset-0">
              <div className="relative h-full w-full">
                <div
                  id="three-container"
                  className="absolute inset-0 z-0 overflow-hidden"
                />
              </div>
            </div>
            <aside
              className={[
                "fixed right-0 top-0 z-[60] h-full w-[350px]",
                "bg-zinc-100 dark:bg-zinc-900",
                "shadow-[-8px_0_24px_-8px_rgba(0,0,0,0.15)]",
                "transform transition-transform duration-300 ease-in-out",
                isSettingsOpen ? "translate-x-0" : "translate-x-full",
              ].join(" ")}
            >
              <div className="relative h-full">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSettingsOpen(false)}
                  className="absolute right-2 top-2 z-1000"
                  aria-label="Close settings"
                >
                  <X className="h-4 w-4" />
                </Button>

                <div className="h-full overflow-auto">
                  <FitmentSettings />
                </div>
              </div>
            </aside>
          </div>
        </SettingsContext.Provider>
      </CarModelContext.Provider>
    </FitmentConfigProvider>
  );
};

export default MainComponent;
