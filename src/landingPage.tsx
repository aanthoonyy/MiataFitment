import React from "react";
import { Box } from "@mui/material";
import { Footer } from "./assets/footer";
import MainImageAndSimulator from "./components/MainImageAndSimulator";
import { Header } from "./header";

const LandingPage: React.FC = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        width: "100vw",
        overflowX: "hidden",
        boxSizing: "border-box",
        m: 0,
        p: 0,
        bgcolor: "#fff",
      }}
    >
      <Header />

      <Box component="main" sx={{ flex: 1 }}>
        <MainImageAndSimulator />
      </Box>

      <Footer />
    </Box>
  );
};

export default LandingPage;
