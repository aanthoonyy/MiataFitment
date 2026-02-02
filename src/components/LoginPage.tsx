import { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { supabase, useAuth } from "../provider/AuthProvider";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { Footer } from "@/components/Footer";

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

  const subheading =
    mode === "login"
      ? "Sign in to access your saved setups and the visualizer."
      : mode === "signup"
      ? "Create an account to save wheel/tire setups and come back anytime."
      : "We’ll send you a reset link to get back in.";

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

  // styling cues from your other panels
  const panel =
    "rounded-xl bg-zinc-50 p-6 shadow-sm shadow-black/10";
  const label = "text-xs text-muted-foreground";
  const input = "h-9";
  const primaryBtn =
    "bg-[#0DA5E8] text-white hover:bg-[#0b94d1] active:bg-[#0a84bd] transition-colors";

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="w-full border-b border-[#0b94d1] bg-[#0DA5E8] text-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link to="/" className="inline-flex items-center gap-2">
            <img
              src="/faviconNoBG.png"
              alt="Miata Fitment Logo"
              className="h-10 w-auto"
            />
          </Link>
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-md px-4 pt-16 md:pt-24">
        <div className={panel}>
          {/* Card header row */}
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-xl font-semibold tracking-tight">{heading}</h1>
              <p className="text-sm text-muted-foreground">{subheading}</p>
            </div>

            {/* Brand icon only */}
            <img
              src="/faviconNoBG.png"
              alt="Miata Fitment"
              className="h-8 w-auto opacity-95"
            />
          </div>

          <Separator className="my-4" />

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className={label}>
                Email Address
              </Label>
              <Input
                id="email"
                className={input}
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
              <div className="space-y-1.5">
                <Label htmlFor="displayName" className={label}>
                  Display name
                </Label>
                <Input
                  id="displayName"
                  className={input}
                  autoComplete="name"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  disabled={loading}
                />
              </div>
            )}

            {(mode === "login" || mode === "signup") && (
              <div className="space-y-1.5">
                <Label htmlFor="password" className={label}>
                  Password
                </Label>
                <Input
                  id="password"
                  className={input}
                  type="password"
                  autoComplete={
                    mode === "login" ? "current-password" : "new-password"
                  }
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
            )}

            <Button
              type="submit"
              className={`w-full ${primaryBtn}`}
              disabled={loading || !canSubmit}
            >
              {mode === "login"
                ? "Sign In"
                : mode === "signup"
                ? "Create Account"
                : "Send Reset Email"}
            </Button>

            <div className="space-y-1">
              {mode === "login" && (
                <Button
                  type="button"
                  variant="link"
                  className="h-auto w-full justify-start px-0 text-sm text-muted-foreground"
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
                className="h-auto w-full justify-start px-0 text-sm text-muted-foreground"
                disabled={loading}
                onClick={toggleMode}
              >
                {mode === "login"
                  ? "Need an account? Sign up"
                  : "Have an account? Sign in"}
              </Button>

              {mode === "reset" && (
                <Button
                  type="button"
                  variant="link"
                  className="h-auto w-full justify-start px-0 text-sm text-muted-foreground"
                  disabled={loading}
                  onClick={() => {
                    setMode("login");
                    setMessage("");
                  }}
                >
                  Back to sign in
                </Button>
              )}
            </div>

            {message && (
              <Alert variant={messageType === "error" ? "destructive" : "default"}>
                <AlertTitle>
                  {messageType === "error" ? "Error" : "Success"}
                </AlertTitle>
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}
          </form>
        </div>
      </main>

      {/* Sticky footer (pushed down by flex-1 main) */}
      <Footer />
    </div>
  );
}
