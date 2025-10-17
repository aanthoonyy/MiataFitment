import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  Container,
} from "@mui/material";
import {
  Login as LoginIcon,
  PersonAdd as PersonAddIcon,
} from "@mui/icons-material";
import { supabase, useAuth } from "../provider/AuthProvider";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success"
  );
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/"); // or wherever you want to redirect
    }
  }, [user, navigate]);

  const handleSignUp = async () => {
    setLoading(true);
    setMessage("");
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username,
        },
      },
    });
    setLoading(false);
    if (error) {
      setMessageType("error");
      setMessage(`Error: ${error.message}`);
    } else {
      setMessageType("success");
      setMessage(`Success! Account created. You can now sign in.`);
      // Clear form
      setEmail("");
      setPassword("");
      setUsername("");
    }
  };

  const handleSignIn = async () => {
    setLoading(true);
    setMessage("");
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) {
      setMessageType("error");
      setMessage(`Error: ${error.message}`);
    } else {
      setMessageType("success");
      setMessage(`Logged in as: ${data.user?.email}`);
      // AuthContext will update and useEffect will redirect
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: "100%" }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            Supabase Login Test
          </Typography>

          <Box component="form" sx={{ mt: 3 }} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              data-testid="email-input"
            />
            <TextField
              margin="normal"
              fullWidth
              id="username"
              label="Username (for sign up)"
              name="username"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              data-testid="username-input"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              data-testid="password-input"
            />

            <Box sx={{ display: "flex", gap: 2, mt: 3, mb: 2 }}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleSignIn}
                disabled={loading}
                startIcon={
                  loading ? <CircularProgress size={20} /> : <LoginIcon />
                }
                data-testid="signin-button"
              >
                Sign In
              </Button>
              <Button
                fullWidth
                variant="outlined"
                color="secondary"
                onClick={handleSignUp}
                disabled={loading}
                startIcon={
                  loading ? <CircularProgress size={20} /> : <PersonAddIcon />
                }
                data-testid="signup-button"
              >
                Sign Up
              </Button>
            </Box>

            {message && (
              <Alert
                severity={messageType}
                sx={{ mt: 2 }}
                data-testid="message"
              >
                {message}
              </Alert>
            )}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
