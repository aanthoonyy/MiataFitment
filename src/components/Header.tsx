import { AppBar, IconButton, Box, useTheme } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SettingsIcon from "@mui/icons-material/Settings";
import { useNavigate } from "react-router-dom";
import { useState, createContext, useContext } from "react";

export const CarModelContext = createContext<{
  model: string;
  setModel: (model: string) => void;
}>({
  model: "na",
  setModel: () => {},
});

export const SettingsContext = createContext<{
  isSettingsOpen: boolean;
  setIsSettingsOpen: (isOpen: boolean) => void;
}>({
  isSettingsOpen: false,
  setIsSettingsOpen: () => {},
});

export const useCarModel = () => useContext(CarModelContext);
export const useSettings = () => useContext(SettingsContext);

const Header = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { isSettingsOpen, setIsSettingsOpen } = useSettings();

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: theme.palette.grey[200],
        boxShadow: 1,
        height: "64px",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        px: 2,
        zIndex: 0,
      }}
    >
      <IconButton
        onClick={() => navigate("/")}
        sx={{
          position: "absolute",
          left: 16,
          color: theme.palette.text.primary,
        }}
      >
        <ArrowBackIcon />
      </IconButton>

      <Box
        component="img"
        src="public/faviconNoBG.png"
        alt="MiataFitment Logo"
        sx={{
          height: "48px",
          margin: "0 auto",
        }}
      />

      <IconButton
        onClick={() => setIsSettingsOpen(!isSettingsOpen)}
        sx={{
          position: "absolute",
          right: 16,
          color: theme.palette.text.primary,
          bgcolor: "background.paper",
          boxShadow: 1,
          "&:hover": {
            bgcolor: "background.paper",
          },
        }}
      >
        <SettingsIcon />
      </IconButton>
    </AppBar>
  );
};

export default Header;
