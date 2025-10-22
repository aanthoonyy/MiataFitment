import React, {useEffect, useState} from "react";
import { StyledDiv, StyledInput, StyledLabel } from "./FitmentSettingsStyles";
import { Box, FormControlLabel, Checkbox, Typography } from "@mui/material";

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

    const [frontOffsetInput, setFrontOffsetInput] = useState(frontWheelOffset.toString());
    const [rearOffsetInput, setRearOffsetInput] = useState(rearWheelOffset.toString());

    useEffect(() => setFrontOffsetInput(frontWheelOffset.toString()), [frontWheelOffset]);
    useEffect(() => setRearOffsetInput(rearWheelOffset.toString()), [rearWheelOffset]);

    const handleOffsetChange = (
        value: string,
        setInput: React.Dispatch<React.SetStateAction<string>>,
        setNumber: (v: number) => void
    ) => {
        if (/^-?\d*\.?\d*$/.test(value)) {
            setInput(value);
            const num = parseFloat(value);
            if (!isNaN(num)) setNumber(num);
        }
    };

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
          type="text"
          value={frontOffsetInput}
          onChange={(e) =>
              handleOffsetChange(e.target.value, setFrontOffsetInput, setFrontWheelOffset)
          }
          onBlur={() => {
              const parsed = parseFloat(frontOffsetInput);
              if (isNaN(parsed)) {
                  setFrontOffsetInput("0");
                  setFrontWheelOffset(0);
              } else {
                  setFrontOffsetInput(parsed.toString());
                  setFrontWheelOffset(parsed);
              }
          }}
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
          type="text"
          value={rearOffsetInput}
          onChange={(e) =>
              handleOffsetChange(e.target.value, setRearOffsetInput, setRearWheelOffset)
          }
          onBlur={() => {
              const parsed = parseFloat(rearOffsetInput);
              if (isNaN(parsed)) {
                  setRearOffsetInput("0");
                  setRearWheelOffset(0);
              } else {
                  setRearOffsetInput(parsed.toString());
                  setRearWheelOffset(parsed);
              }
          }}
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
