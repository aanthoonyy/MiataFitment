import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { supabase, useAuth } from "../provider/AuthProvider";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "signup" | "reset">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const heading =
    mode === "login"
      ? "Welcome back"
      : mode === "signup"
      ? "Create your account"
      : "Reset password";

  const canSubmit = useMemo(() => {
    if (mode === "login") return email.length > 0 && password.length > 0;
    if (mode === "signup")
      return email.length > 0 && password.length > 0 && displayName.length > 0;
    return email.length > 0;
  }, [mode, email, password, displayName]);

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
      options: { data: { displayName } },
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
      const meta = (data.user?.user_metadata ?? {}) as { displayName?: string };
      const name = meta.displayName || data.user?.email || "User";
      setMessageType("success");
      setMessage(`Logged in as: ${name}`);
    }
  };

  const handleResetPassword = async () => {
    setLoading(true);
    setMessage("");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);

    if (error) {
      setMessageType("error");
      setMessage(`Error: ${error.message}`);
    } else {
      setMessageType("success");
      setMessage("Password reset email sent! Check your inbox.");
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "login") void handleSignIn();
    else if (mode === "signup") void handleSignUp();
    else void handleResetPassword();
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-md items-center justify-center p-4">
      <Card className="w-full">
        <CardHeader className="space-y-1">
          <CardTitle className="text-center text-2xl">{heading}</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                autoFocus
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            {mode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="displayName">Display name</Label>
                <Input
                  id="displayName"
                  autoComplete="name"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  disabled={loading}
                />
              </div>
            )}

            {(mode === "login" || mode === "signup") && (
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading || !canSubmit}>
              {mode === "login"
                ? "Sign In"
                : mode === "signup"
                ? "Create Account"
                : "Send Reset Email"}
            </Button>

            {mode === "login" && (
              <Button
                type="button"
                variant="link"
                className="w-full px-0"
                disabled={loading}
                onClick={() => {
                  setMode("reset");
                  setMessage("");
                }}
              >
                Forgot password?
              </Button>
            )}

            <Button
              type="button"
              variant="link"
              className="w-full px-0"
              disabled={loading}
              onClick={toggleMode}
            >
              {mode === "login" ? "Need an account? Sign up" : "Have an account? Sign in"}
            </Button>

            {message && (
              <Alert variant={messageType === "error" ? "destructive" : "default"}>
                <AlertTitle>{messageType === "error" ? "Error" : "Success"}</AlertTitle>
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
