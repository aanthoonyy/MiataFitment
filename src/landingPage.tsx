import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, SelectChangeEvent } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Footer } from "./assets/footer";
import { Header } from "./header";
import BuyMeACoffee from "./assets/buymecoffee";
import MainImageAndSimulator from "./components/MainImageAndSimulator";
import GallerySection from "./components/GallerySection";
import Marketplace from "./components/Marketplace";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [generation, setGeneration] = useState<string>("na");

  const handleGenerationChange = (event: SelectChangeEvent) => {
    setGeneration(event.target.value as string);
  };

  const handleGo = () => {
    if (generation === "na") {
      navigate("/visualizer-na");
    }
  };

  const handleSeeMoreGallery = () => {
    navigate("/gallery");
  };

  const handleGoMarketplace = () => {
    navigate("/marketplace");
  };

  const isMobile = useMediaQuery("(max-width:600px)");
  const galleryItems = isMobile ? [1] : [1, 2, 3, 4, 5, 6];

  return (
    <Box
      sx={{
        textAlign: "center",
        backgroundColor: "#FFFFFF",
        minHeight: "100vh",
      }}
    >
      <Header />

      <MainImageAndSimulator
        isMobile={isMobile}
        generation={generation}
        handleGenerationChange={handleGenerationChange}
        handleGo={handleGo}
      />

      <GallerySection
        galleryItems={galleryItems}
        handleSeeMoreGallery={handleSeeMoreGallery}
      />

      <Marketplace handleGoMarketplace={handleGoMarketplace} />
      <BuyMeACoffee link="https://www.buymeacoffee.com/miatafitment" />
      <Footer />
    </Box>
  );
};

export default LandingPage;
