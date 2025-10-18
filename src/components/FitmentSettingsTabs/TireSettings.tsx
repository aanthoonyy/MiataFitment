import React from "react";
import { Box, FormControlLabel, Checkbox, Typography } from "@mui/material";
import { StyledDiv, StyledInput, StyledLabel } from "./FitmentSettingsStyles";

export interface TireSettingsProps {
  matchTires: boolean;
  setMatchTires: (value: boolean) => void;

  frontTireWidth: number;
  setFrontTireWidth: (value: number) => void;
  frontTireSidewall: number;
  setFrontTireSidewall: (value: number) => void;

  rearTireWidth: number;
  setRearTireWidth: (value: number) => void;
  rearTireSidewall: number;
  setRearTireSidewall: (value: number) => void;
}

const TireSettings: React.FC<TireSettingsProps> = ({
  matchTires,
  setMatchTires,
  frontTireWidth,
  setFrontTireWidth,
  frontTireSidewall,
  setFrontTireSidewall,
  rearTireWidth,
  setRearTireWidth,
  rearTireSidewall,
  setRearTireSidewall,
}) => {
  return (
    <>
      <Box sx={{ mb: 2 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={matchTires}
              onChange={(e) => setMatchTires(e.target.checked)}
            />
          }
          label="Match Front and Rear Tires"
        />
      </Box>

      <StyledDiv>
        <Typography variant="subtitle1" gutterBottom>
          Front Tires
        </Typography>
        <StyledLabel>Width (mm)</StyledLabel>
        <StyledInput
          type="number"
          value={frontTireWidth}
          onChange={(e) => setFrontTireWidth(parseFloat(e.target.value))}
        />

        <StyledLabel>Sidewall (%)</StyledLabel>
        <StyledInput
          type="number"
          value={frontTireSidewall}
          onChange={(e) => setFrontTireSidewall(parseFloat(e.target.value))}
        />
      </StyledDiv>

      <StyledDiv sx={{ opacity: matchTires ? 0.5 : 1 }}>
        <Typography variant="subtitle1" gutterBottom>
          Rear Tires {matchTires && "(Matching Front)"}
        </Typography>
        <StyledLabel>Width (mm)</StyledLabel>
        <StyledInput
          type="number"
          value={rearTireWidth}
          onChange={(e) => setRearTireWidth(parseFloat(e.target.value))}
          disabled={matchTires}
        />

        <StyledLabel>Sidewall (%)</StyledLabel>
        <StyledInput
          type="number"
          value={rearTireSidewall}
          onChange={(e) => setRearTireSidewall(parseFloat(e.target.value))}
          disabled={matchTires}
        />
      </StyledDiv>
    </>
  );
};

export default TireSettings;
