import React from "react";
import { Container, Grid } from "@mui/material";
import MainImage from "./MainImage";
import FitmentSimulator from "./FitmentSimulator";

const MainImageAndSimulator: React.FC = () => (
  <Container maxWidth="lg" sx={{ mt: { xs: 2, md: 4 } }}>
    <Grid container spacing={4} alignItems="center">
      <Grid item xs={12} md={6} order={{ xs: 2, md: 1 }}>
        <FitmentSimulator />
      </Grid>
      <Grid item xs={12} md={6} order={{ xs: 1, md: 2 }}>
        <MainImage />
      </Grid>
    </Grid>
  </Container>
);

export default MainImageAndSimulator;
