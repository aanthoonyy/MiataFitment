import React from "react";
import { Typography } from "@mui/material";
import { StyledDiv } from "./FitmentSettingsStyles";

const AccountSettings: React.FC = () => {
  return (
    <StyledDiv>
      <Typography variant="subtitle1" gutterBottom>
        Account Settings
      </Typography>
      <Typography variant="body2" sx={{ color: "text.secondary" }}>
        Account settings and preferences will be implemented in a future update.
      </Typography>
    </StyledDiv>
  );
};

export default AccountSettings;
