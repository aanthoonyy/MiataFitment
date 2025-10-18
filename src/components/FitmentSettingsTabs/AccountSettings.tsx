import React, { useState } from "react";
import {
  Typography,
  Box,
  Tabs,
  Tab,
  Paper,
  Divider,
  Button,
} from "@mui/material";
import { StyledDiv } from "./FitmentSettingsStyles";
import { User } from "@supabase/supabase-js";
import { Link as RouterLink } from "react-router-dom";

export interface AccountSettingsProps {
  user: User | null;
}

const AccountSettings: React.FC<AccountSettingsProps> = ({ user }) => {
  const [innerTab, setInnerTab] = useState(0);

  if (!user) {
    return (
      <StyledDiv>
        <Typography variant="h6" gutterBottom>
          Account
        </Typography>
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Typography variant="body1" gutterBottom>
            You’re not signed in.
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
            Sign in to access your garage and account settings.
          </Typography>
          <Button variant="contained" component={RouterLink} to="/login">
            Sign in
          </Button>
        </Paper>
      </StyledDiv>
    );
  }

  const displayName =
    (user.user_metadata as any)?.displayName || user.email || "User";

  return (
    <StyledDiv>
      <Typography variant="h6" gutterBottom>
        Welcome, {displayName}
      </Typography>

      <Box sx={{ mt: 1 }}>
        <Tabs
          value={innerTab}
          onChange={(_, v) => setInnerTab(v)}
          variant="scrollable"
          allowScrollButtonsMobile
        >
          <Tab label="Garage" />
          <Tab label="Account" />
        </Tabs>
      </Box>

      {innerTab === 0 && (
        <Box sx={{ mt: 2 }}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Garage
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Saved cars will be available here soon.
            </Typography>
          </Paper>

          <Divider sx={{ my: 2 }} />
        </Box>
      )}

      {innerTab === 1 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Account preferences will be added later.
          </Typography>
        </Box>
      )}
    </StyledDiv>
  );
};

export default AccountSettings;
