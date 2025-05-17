import {
  AppBar,
  IconButton,
  Box,
  useTheme,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { SelectChangeEvent } from "@mui/material/Select";
import { useState, createContext, useContext } from "react";

export const CarModelContext = createContext<{
  model: string;
  setModel: (model: string) => void;
}>({
  model: "na",
  setModel: () => {},
});

export const useCarModel = () => useContext(CarModelContext);

const Header = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [generation, setGeneration] = useState<string>("na");
  const { setModel } = useCarModel();

  const handleGenerationChange = (event: SelectChangeEvent) => {
    const newGeneration = event.target.value as string;
    setGeneration(newGeneration);
    setModel(newGeneration);
  };

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

      <FormControl
        sx={{
          position: "absolute",
          right: 16,
          minWidth: 120,
          backgroundColor: theme.palette.background.paper,
          borderRadius: 1,
        }}
      >
        <Select
          value={generation}
          onChange={handleGenerationChange}
          size="small"
          sx={{
            height: "36px",
            "& .MuiSelect-select": {
              py: 1,
            },
          }}
        >
          <MenuItem value="na">NA Miata</MenuItem>
          <MenuItem value="nb">NB Miata</MenuItem>
          <MenuItem value="nc" disabled>
            NC Miata (Coming Soon)
          </MenuItem>
          <MenuItem value="nd" disabled>
            ND Miata (Coming Soon)
          </MenuItem>
        </Select>
      </FormControl>
    </AppBar>
  );
};

export default Header;
