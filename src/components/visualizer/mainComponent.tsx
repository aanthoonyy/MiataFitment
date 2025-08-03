import FitmentSettings from "./fitmentSettings";
import { useCallback, useState, useMemo } from "react";
import { Box, IconButton, useTheme } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Header, {
  CarModelContext,
  SettingsContext,
} from "../FitmentSimulatorHeader";
import { Settings, DEFAULT_SETTINGS } from "../../types/settings";
import ThreeScene from "../scene/ThreeScene";
import useThreeScene from "../scene/useThreeScene";


const MainComponent = () => {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [currentModel, setCurrentModel] = useState("na");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { containerRef } = useThreeScene(settings, currentModel);
  const theme = useTheme();

  const updateModel = useCallback((newSettings: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  // Create memoized context values to prevent unnecessary re-renders
  const carContextValue = useMemo(
    () => ({
      model: currentModel,
      setModel: (newModel: string) => {
        setCurrentModel(newModel);
      },
    }),
    [currentModel]
  );

  const settingsContextValue = useMemo(
    () => ({
      isSettingsOpen,
      setIsSettingsOpen,
    }),
    [isSettingsOpen]
  );

  return (
    <CarModelContext.Provider value={carContextValue}>
      <SettingsContext.Provider value={settingsContextValue}>
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
           <ThreeScene containerRef={containerRef} />

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
      </SettingsContext.Provider>
    </CarModelContext.Provider>
  );
};

export default MainComponent;
