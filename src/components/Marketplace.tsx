import React from "react";
import { Container, Grid, Box, Typography, Button } from "@mui/material";

interface MarketplaceProps {
  handleGoMarketplace: () => void;
}

const Marketplace: React.FC<MarketplaceProps> = ({ handleGoMarketplace }) => (
  <Container maxWidth="lg" sx={{ mt: 8 }}>
    <Grid container spacing={4} alignItems="center">
      <Grid item xs={12} md={6}>
        <Box sx={{ textAlign: "center" }}>
          <img
            src="/Wheels.png"
            alt="Marketplace"
            style={{
              maxWidth: "100%",
              height: "auto",
              borderRadius: "8px",
            }}
          />
        </Box>
      </Grid>

      <Grid item xs={12} md={6}>
        <Box>
          <Typography variant="h3" gutterBottom>
            Marketplace
          </Typography>
          <Typography variant="h6" gutterBottom>
            Discover the best deals on Miata parts and accessories. Browse
            through a variety of wheels, suspension components, and more to
            perfect your build. Coming soon!
          </Typography>

          <Box sx={{ mt: 4 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              disabled
              onClick={handleGoMarketplace}
              sx={{
                width: "200px",
                height: "56px",
              }}
            >
              Marketplace
            </Button>
          </Box>
        </Box>
      </Grid>
    </Grid>
  </Container>
);

export default Marketplace;
