import React from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Button,
  SelectChangeEvent,
} from "@mui/material";

interface FitmentSimulatorProps {
  isMobile: boolean;
  generation: string;
  handleGenerationChange: (event: SelectChangeEvent) => void;
  handleGo: () => void;
}

const FitmentSimulator: React.FC<FitmentSimulatorProps> = ({
  isMobile,
  generation,
  handleGenerationChange,
  handleGo,
}) => (
  <Box>
    <Typography variant="h3" gutterBottom>
      Fitment Simulator
    </Typography>
    <Typography variant="h6" gutterBottom>
      Dial in your Miata's fitment with our simulator. Select your Miata's
      generation and start customizing wheels, suspension, and more.
    </Typography>
    {isMobile && (
      <Typography variant="h6" gutterBottom sx={{ color: "red", mt: 2 }}>
        Mobile use is not recommended at the moment. Use a desktop or laptop.
      </Typography>
    )}
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        gap: 2,
        alignItems: "center",
        mt: 2,
      }}
    >
      <Select
        value={generation}
        onChange={handleGenerationChange}
        variant="outlined"
        sx={{
          width: "150px",
          height: "56px",
        }}
      >
        <MenuItem value="na">NA</MenuItem>
        <MenuItem value="nb" disabled>
          NB
        </MenuItem>
        <MenuItem value="nc" disabled>
          NC
        </MenuItem>
        <MenuItem value="nd" disabled>
          ND
        </MenuItem>
      </Select>
      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={handleGo}
        sx={{
          width: "150px",
          height: "56px",
        }}
      >
        Go
      </Button>
    </Box>
  </Box>
);

export default FitmentSimulator;
