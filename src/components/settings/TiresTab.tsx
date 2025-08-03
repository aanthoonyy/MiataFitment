import { Box, Checkbox, FormControlLabel, Typography } from "@mui/material";
import { StyledDiv, StyledLabel, StyledInput } from "./StyledComponents";

type TireTabProps = {
  tires: {
    matchTires: boolean;
    setMatchTires: (v: boolean) => void;
    frontTireWidth: number;
    setFrontTireWidth: (v: number) => void;
    frontTireSidewall: number;
    setFrontTireSidewall: (v: number) => void;
    rearTireWidth: number;
    setRearTireWidth: (v: number) => void;
    rearTireSidewall: number;
    setRearTireSidewall: (v: number) => void;
  };
};

export const TiresTab = ({ tires }: TireTabProps) => {
  const {
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
  } = tires;

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
