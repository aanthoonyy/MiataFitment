import React from "react";
import { Box, Typography, Container, Grid, Button } from "@mui/material";

interface GallerySectionProps {
  galleryItems: number[];
  handleSeeMoreGallery: () => void;
}

const GallerySection: React.FC<GallerySectionProps> = ({
  galleryItems,
  handleSeeMoreGallery,
}) => (
  <Box sx={{ py: 5, backgroundColor: "#FFFFFF", mt: 4 }}>
    <Typography variant="h3" gutterBottom>
      Gallery
    </Typography>
    <Typography variant="h6" gutterBottom>
      Gather inspiration from our curated gallery of Miata builds. From track
      monsters to show cars, we've got it all.
    </Typography>
    <Container maxWidth="lg" sx={{ mt: 2, mb: 2 }}>
      <Grid container spacing={3}>
        {galleryItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item}>
            <img
              src={`/landingpagegallery/miata${item}.png`}
              style={{
                width: "100%",
                height: "auto",
                borderRadius: "8px",
              }}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
    <Typography variant="h6" gutterBottom sx={{ color: "black", mt: 2 }}>
      See more cars in our gallery!
    </Typography>
    <Button
      variant="contained"
      color="primary"
      size="large"
      onClick={handleSeeMoreGallery}
      sx={{
        width: "150px",
        height: "56px",
      }}
    >
      Gallery
    </Button>
  </Box>
);

export default GallerySection;
