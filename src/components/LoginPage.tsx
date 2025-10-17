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
  const [mode, setMode] = useState<"login" | "signup">("login");
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
    if (user) navigate("/");
  }, [user, navigate]);

  const toggleMode = () => {
    setMode((m) => (m === "login" ? "signup" : "login"));
    setMessage("");
  };

  const handleSignUp = async () => {
    setLoading(true);
    setMessage("");
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username } },
    });
    setLoading(false);
    if (error) {
      setMessageType("error");
      setMessage(`Error: ${error.message}`);
    } else {
      setMessageType("success");
      setMessage("Success! Account created. You can now sign in.");
      setMode("login");
      setPassword("");
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
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "login") handleSignIn();
    else handleSignUp();
  };

  const canSubmit =
    mode === "login"
      ? email.length > 0 && password.length > 0
      : email.length > 0 && password.length > 0 && username.length > 0;

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: "100%" }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            {mode === "login" ? "Welcome back" : "Create your account"}
          </Typography>

          <Box component="form" sx={{ mt: 3 }} noValidate onSubmit={onSubmit}>
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
            />

            {mode === "signup" && (
              <TextField
                margin="normal"
                fullWidth
                required
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            )}

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete={
                mode === "login" ? "current-password" : "new-password"
              }
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Box sx={{ display: "flex", gap: 2, mt: 3, mb: 1 }}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={loading || !canSubmit}
                startIcon={
                  loading ? (
                    <CircularProgress size={20} />
                  ) : mode === "login" ? (
                    <LoginIcon />
                  ) : (
                    <PersonAddIcon />
                  )
                }
              >
                {mode === "login" ? "Sign In" : "Create Account"}
              </Button>
            </Box>

            <Button
              onClick={toggleMode}
              fullWidth
              color="secondary"
              variant="text"
              disabled={loading}
              sx={{ textTransform: "none" }}
            >
              {mode === "login"
                ? "Need an account? Sign up"
                : "Have an account? Sign in"}
            </Button>

            {message && (
              <Alert severity={messageType} sx={{ mt: 2 }}>
                {message}
              </Alert>
            )}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
