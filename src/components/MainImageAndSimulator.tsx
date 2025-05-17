import React from "react";
import { Container, Grid, SelectChangeEvent } from "@mui/material";
import MainImage from "./MainImage";
import FitmentSimulator from "./FitmentSimulator";

interface MainImageAndSimulatorProps {
  isMobile: boolean;
  generation: string;
  handleGenerationChange: (event: SelectChangeEvent) => void;
  handleGo: () => void;
}

const MainImageAndSimulator: React.FC<MainImageAndSimulatorProps> = ({
  isMobile,
  generation,
  handleGenerationChange,
  handleGo,
}) => (
  <Container maxWidth="lg" sx={{ mt: 4 }}>
    <Grid container spacing={4} alignItems="center">
      <Grid item xs={12} md={6}>
        <FitmentSimulator
          isMobile={isMobile}
          generation={generation}
          handleGenerationChange={handleGenerationChange}
          handleGo={handleGo}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <MainImage />
      </Grid>
    </Grid>
  </Container>
);

export default MainImageAndSimulator;
