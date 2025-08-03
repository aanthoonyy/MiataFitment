import React from "react";
import { Container, Grid } from "@mui/material";
import MainImage from "./MainImage";
import FitmentSimulator from "./FitmentSimulator";

const MainImageAndSimulator: React.FC = () => (
  <Container maxWidth="lg" sx={{ mt: 4 }}>
    <Grid container spacing={4} alignItems="center">
      <Grid item xs={12} md={6}>
        <FitmentSimulator />
      </Grid>
      <Grid item xs={12} md={6}>
        <MainImage />
      </Grid>
    </Grid>
  </Container>
);

export default MainImageAndSimulator;
