// ...existing code...
import React from "react";
import { StyledDiv, StyledInput, StyledLabel } from "./FitmentSettingsStyles";
import { Box, FormControlLabel, Checkbox, Typography } from "@mui/material";
// ...existing code...

export interface WheelSettingsProps {
  matchWheels: boolean;
  setMatchWheels: (value: boolean) => void;

  frontWheelWidth: number;
  setFrontWheelWidth: (value: number) => void;
  frontWheelDiameter: number;
  setFrontWheelDiameter: (value: number) => void;
  frontWheelOffset: number;
  setFrontWheelOffset: (value: number) => void;
  frontWheelSpacer: number;
  setFrontWheelSpacer: (value: number) => void;

  rearWheelWidth: number;
  setRearWheelWidth: (value: number) => void;
  rearWheelDiameter: number;
  setRearWheelDiameter: (value: number) => void;
  rearWheelOffset: number;
  setRearWheelOffset: (value: number) => void;
  rearWheelSpacer: number;
  setRearWheelSpacer: (value: number) => void;
}

const WheelSettings: React.FC<WheelSettingsProps> = ({
  matchWheels,
  setMatchWheels,
  frontWheelWidth,
  setFrontWheelWidth,
  frontWheelDiameter,
  setFrontWheelDiameter,
  frontWheelOffset,
  setFrontWheelOffset,
  frontWheelSpacer,
  setFrontWheelSpacer,
  rearWheelWidth,
  setRearWheelWidth,
  rearWheelDiameter,
  setRearWheelDiameter,
  rearWheelOffset,
  setRearWheelOffset,
  rearWheelSpacer,
  setRearWheelSpacer,
}) => {
  return (
    <>
      <Box sx={{ mb: 2 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={matchWheels}
              onChange={(e) => setMatchWheels(e.target.checked)}
            />
          }
          label="Match Front and Rear Wheels"
        />
      </Box>

      <StyledDiv>
        <Typography variant="subtitle1" gutterBottom>
          Front Wheels
        </Typography>
        <StyledLabel>Width (in)</StyledLabel>
        <StyledInput
          type="number"
          value={frontWheelWidth}
          onChange={(e) => setFrontWheelWidth(parseFloat(e.target.value))}
        />

        <StyledLabel>Diameter (in)</StyledLabel>
        <StyledInput
          type="number"
          value={frontWheelDiameter}
          onChange={(e) => setFrontWheelDiameter(parseFloat(e.target.value))}
        />

        <StyledLabel>Offset (mm)</StyledLabel>
        <StyledInput
          type="number"
          value={frontWheelOffset}
          onChange={(e) => setFrontWheelOffset(parseFloat(e.target.value))}
        />

        <StyledLabel>Spacer (mm)</StyledLabel>
        <StyledInput
          type="number"
          value={frontWheelSpacer}
          onChange={(e) => setFrontWheelSpacer(parseFloat(e.target.value))}
        />
      </StyledDiv>

      <StyledDiv sx={{ opacity: matchWheels ? 0.5 : 1 }}>
        <Typography variant="subtitle1" gutterBottom>
          Rear Wheels {matchWheels && "(Matching Front)"}
        </Typography>
        <StyledLabel>Width (in)</StyledLabel>
        <StyledInput
          type="number"
          value={rearWheelWidth}
          onChange={(e) => setRearWheelWidth(parseFloat(e.target.value))}
          disabled={matchWheels}
        />

        <StyledLabel>Diameter (in)</StyledLabel>
        <StyledInput
          type="number"
          value={rearWheelDiameter}
          onChange={(e) => setRearWheelDiameter(parseFloat(e.target.value))}
          disabled={matchWheels}
        />

        <StyledLabel>Offset (mm)</StyledLabel>
        <StyledInput
          type="number"
          value={rearWheelOffset}
          onChange={(e) => setRearWheelOffset(parseFloat(e.target.value))}
          disabled={matchWheels}
        />

        <StyledLabel>Spacer (mm)</StyledLabel>
        <StyledInput
          type="number"
          value={rearWheelSpacer}
          onChange={(e) => setRearWheelSpacer(parseFloat(e.target.value))}
          disabled={matchWheels}
        />
      </StyledDiv>
    </>
  );
};

export default WheelSettings;
// ...existing code...
