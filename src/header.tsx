import React from "react";
import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Tooltip,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./provider/AuthProvider";

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = async () => {
    await signOut();
    handleMenuClose();
    navigate("/");
  };

  const goLogin = () => navigate("/login");

  const displayName =
    (user?.user_metadata as any)?.displayName ||
    user?.email?.split("@")[0] ||
    "Account";

  const avatarLetter = displayName?.[0]?.toUpperCase() || "?";

  return (
    <Box
      sx={{
        py: 0,
        backgroundColor: "#1976D2",
        color: "#FFFFFF",
      }}
    >
      <Box
        sx={{
          maxWidth: 1200,
          mx: "auto",
          px: 2,
          height: 72,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Link
          to="/"
          style={{
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
          }}
        >
          <img
            src="/faviconNoBG.png"
            alt="Miata Fitment Logo"
            style={{ height: 56, width: "auto", cursor: "pointer" }}
          />
        </Link>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          {loading ? (
            <CircularProgress size={22} sx={{ color: "#fff" }} />
          ) : user ? (
            <>
              <Typography
                variant="body2"
                sx={{ color: "#fff", display: { xs: "none", sm: "block" } }}
              >
                {displayName}
              </Typography>
              <Tooltip title="Account">
                <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: "#fff",
                      color: "#1976D2",
                      fontWeight: 600,
                    }}
                  >
                    {avatarLetter}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={anchorEl}
                open={menuOpen}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    navigate("/account");
                  }}
                >
                  Account
                </MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              onClick={goLogin}
              variant="outlined"
              size="small"
              sx={{
                color: "#fff",
                borderColor: "#fff",
                ":hover": {
                  borderColor: "#fff",
                  backgroundColor: "rgba(255,255,255,0.1)",
                },
              }}
            >
              Login
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};
