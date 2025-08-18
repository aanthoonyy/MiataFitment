import React from "react";
import { Box } from "@mui/material";
import { Footer } from "../common/footer";
import { Header } from "../common/header";
import MainImageAndSimulator from "./MainImageAndSimulator";

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
