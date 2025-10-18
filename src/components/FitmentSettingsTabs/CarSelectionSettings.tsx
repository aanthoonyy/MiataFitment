import React from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Link,
  SelectChangeEvent,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { StyledDiv, StyledLabel } from "./FitmentSettingsStyles";

export interface CarSelectionSettingsProps {
  model: "na" | "nb" | "nc" | "nd" | string;
  setModel: (value: string) => void;
  user: unknown | null;
  loading: boolean;
}

const CarSelectionSettings: React.FC<CarSelectionSettingsProps> = ({
  model,
  setModel,
  user,
  loading,
}) => {
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
          disabled={!user || loading}
        >
          <MenuItem value="na">NA Miata (1989-1997)</MenuItem>
          <MenuItem value="nb" disabled>
            NB Miata (1998-2005)
          </MenuItem>
          <MenuItem value="nc" disabled>
            NC Miata (2006-2015)
          </MenuItem>
          <MenuItem value="nd" disabled>
            ND Miata (2016-Present)
          </MenuItem>
        </Select>
        {!user && !loading && (
          <Typography variant="caption" color="text.secondary">
            Please{" "}
            <Link component={RouterLink} to="/login" underline="hover">
              log in
            </Link>{" "}
            to change car selection.
          </Typography>
        )}
      </Box>
      <Typography variant="body2" sx={{ color: "text.secondary" }}>
        Select your Miata generation to view and customize its fitment settings.
        Each generation has unique wheel wells and suspension geometry.
      </Typography>
    </StyledDiv>
  );
};

export default CarSelectionSettings;
