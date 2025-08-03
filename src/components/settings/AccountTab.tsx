import {
  Typography,
} from "@mui/material";
import { StyledDiv } from "./StyledComponents";

export const AccountTab = () => {

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
