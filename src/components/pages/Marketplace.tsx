import React from "react";
import {
  Container,
  Grid,
  Box,
  Typography,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";

interface MarketplaceProps {
  handleGoMarketplace: () => void;
}

const Marketplace: React.FC<MarketplaceProps> = ({ handleGoMarketplace }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Container maxWidth="lg" sx={{ mt: 8 }}>
      {isMobile ? (
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h3" gutterBottom>
                Marketplace
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
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
          <Grid item xs={12}>
            <Box
              sx={{
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
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
      ) : (
        <Grid container spacing={4}>
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
            <Box
              sx={{
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
              }}
            >
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
      )}
    </Container>
  );
};

export default Marketplace;
