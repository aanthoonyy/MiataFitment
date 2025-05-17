import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const FitmentSimulator: React.FC = () => {
  const navigate = useNavigate();

  const handleEnterSimulator = () => {
    navigate("/visualizer-na");
  };

  return (
    <Box>
      <Typography variant="h3" gutterBottom>
        Fitment Simulator
      </Typography>
      <Typography variant="h6" gutterBottom>
        Dial in your Miata's fitment with our simulator. Select your Miata's
        generation from the header and start customizing wheels, suspension, and
        more.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={handleEnterSimulator}
        sx={{
          width: "200px",
          height: "56px",
          mt: 2,
        }}
      >
        Enter Simulator
      </Button>
    </Box>
  );
};

export default FitmentSimulator;
