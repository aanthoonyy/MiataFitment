import * as THREE from "three";
import FitmentSettings from "./fitmentSettings";
import { makeCar } from "./assets/carMaker";
import { makeCamera } from "./assets/cameraMaker";
import { render } from "./assets/renderer";
import { setUpLighting } from "./assets/lighting";
import { makeWheels } from "./assets/wheels";
import { makeTires } from "./assets/tire";
import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { Box, IconButton, useTheme } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import CloseIcon from "@mui/icons-material/Close";
import rollingDiameter from "./assets/common/rollingDiameter";
import Header, { CarModelContext, useCarModel } from "./components/Header";
import { Settings, DEFAULT_SETTINGS } from "./types/settings";
import { WheelPosition, WHEEL_POSITIONS } from "./constants/wheelPositions";
import { mmToFeet } from "./utils/unitConversions";

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

  // Function to create and add car
  const createAndAddCar = useCallback(async () => {
    if (sceneRef.current) {
      // Remove old car if it exists
      carRefs.current.forEach((car) => sceneRef.current?.remove(car));
      carRefs.current = [];

      // Create and add new car
      const car = await makeCar(THREE, -1.4, currentModel);
      carRefs.current.push(car);
      sceneRef.current.add(car);
    }
  }, [currentModel]);

  // Function to create and add tires
  const createAndAddTires = useCallback(() => {
    if (sceneRef.current) {
      // Remove old tires if they exist
      tireRefs.current.forEach((tire) => sceneRef.current?.remove(tire));
      wheelRefs.current.forEach((wheel) => sceneRef.current?.remove(wheel));

      // Create and add new wheels
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

      // Create and add new tires
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

  // Effect for initial scene setup
  useEffect(() => {
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const renderer = render();
    rendererRef.current = renderer;
    renderer.setClearColor("#d3d3d3", 1);

    const { camera, controls } = makeCamera(renderer, 100);
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
      container?.removeChild(renderer.domElement);
    };
  }, []);

  // Effect to update wheels and tires when settings change
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

  return { sceneRef };
};

const MainComponent = () => {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [currentModel, setCurrentModel] = useState("na");
  const { sceneRef } = useThreeScene(settings, currentModel);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const theme = useTheme();

  const updateModel = useCallback((newSettings: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  // Create a memoized context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      model: currentModel,
      setModel: (newModel: string) => {
        setCurrentModel(newModel);
      },
    }),
    [currentModel]
  );

  return (
    <CarModelContext.Provider value={contextValue}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          width: "100vw",
          position: "fixed",
          top: 0,
          left: 0,
        }}
      >
        <Header />
        <Box
          sx={{
            flex: 1,
            position: "relative",
            height: "calc(100% - 64px)",
            width: "100%",
            mt: "64px",
          }}
        >
          <div
            id="three-container"
            style={{
              width: "100%",
              height: "100%",
              overflow: "hidden",
              position: "absolute",
              top: 0,
              left: 0,
            }}
          />
          <IconButton
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            sx={{
              position: "absolute",
              right: "20px",
              top: "20px",
              zIndex: 2,
              bgcolor: "background.paper",
              boxShadow: 1,
              opacity: isSettingsOpen ? 0 : 1,
              visibility: isSettingsOpen ? "hidden" : "visible",
              transition: theme.transitions.create(["opacity", "visibility"], {
                duration: theme.transitions.duration.standard,
                easing: theme.transitions.easing.easeInOut,
              }),
              "&:hover": {
                bgcolor: "background.paper",
              },
            }}
          >
            <SettingsIcon />
          </IconButton>
        </Box>
        <Box
          sx={{
            position: "absolute",
            right: 0,
            top: 0,
            height: "100%",
            width: "350px",
            bgcolor: "background.paper",
            borderLeft: "1px solid",
            borderColor: "divider",
            zIndex: 1,
            transform: isSettingsOpen ? "translateX(0)" : "translateX(100%)",
            transition: theme.transitions.create(["transform"], {
              duration: theme.transitions.duration.standard,
              easing: theme.transitions.easing.easeInOut,
            }),
            boxShadow: "-2px 0 8px rgba(0,0,0,0.1)",
          }}
        >
          <Box sx={{ position: "relative" }}>
            <IconButton
              onClick={() => setIsSettingsOpen(false)}
              sx={{
                position: "absolute",
                right: "8px",
                top: "8px",
                zIndex: 2,
                "&:hover": {
                  bgcolor: "action.hover",
                },
              }}
            >
              <CloseIcon />
            </IconButton>
            <FitmentSettings updateModel={updateModel} />
          </Box>
        </Box>
      </Box>
    </CarModelContext.Provider>
  );
};

export default MainComponent;
