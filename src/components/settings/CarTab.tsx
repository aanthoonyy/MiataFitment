import { Box, MenuItem, Select, SelectChangeEvent, Typography } from "@mui/material";
import { StyledDiv, StyledLabel } from "./StyledComponents";

type CarTabProps = {
  cars: {
    model: string;
    setModel: (v: string) => void;
  };
};

export const CarTab = ({ cars }: CarTabProps) => {
  const {
    model,
    setModel,
  } = cars;

  return (
    <StyledDiv>
      <Typography variant="subtitle1" gutterBottom>
        Car Selection
      </Typography>
      <Box sx={{ mb: 2 }}>
        <StyledLabel>Miata Generation</StyledLabel>
        <Select
          value={model}
          onChange={(event: SelectChangeEvent) => {
            setModel(event.target.value);
          }}
          fullWidth
          sx={{ mt: 0.5 }}
        >
          <MenuItem value="na">NA Miata (1989-1997)</MenuItem>
          <MenuItem value="nb">NB Miata (1998-2005)</MenuItem>
          <MenuItem value="nc" disabled>
            NC Miata (2006-2015) - Coming Soon
          </MenuItem>
          <MenuItem value="nd" disabled>
            ND Miata (2016-Present) - Coming Soon
          </MenuItem>
        </Select>
      </Box>
      <Typography variant="body2" sx={{ color: "text.secondary" }}>
        Select your Miata generation to view and customize its fitment settings.
        Each generation has unique wheel wells and suspension geometry.
      </Typography>
    </StyledDiv>
  );
};
