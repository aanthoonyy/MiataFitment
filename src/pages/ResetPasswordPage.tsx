import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { supabase } from "@/provider/AuthProvider";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { Footer } from "@/components/Footer";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");
  const [loading, setLoading] = useState(false);
  const [isValidSession, setIsValidSession] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  const navigate = useNavigate();

  // Check if user arrived via password reset link
  useEffect(() => {
    const checkSession = async () => {
      // Supabase automatically exchanges the token from the URL
      // and creates a session. We need to check if we have a valid session
      // that came from a PASSWORD_RECOVERY event.
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        setIsValidSession(true);
      } else {
        setMessage("Invalid or expired reset link. Please request a new one.");
        setMessageType("error");
      }
      setCheckingSession(false);
    };

    // Listen for the PASSWORD_RECOVERY event
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsValidSession(true);
        setCheckingSession(false);
      }
    });

    checkSession();

    return () => subscription.unsubscribe();
  }, []);

  const canSubmit = password.length >= 6 && password === confirmPassword;

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessageType("error");
      setMessage("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setMessageType("error");
      setMessage("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.updateUser({ password });

    setLoading(false);

    if (error) {
      setMessageType("error");
      setMessage(`Error: ${error.message}`);
    } else {
      setMessageType("success");
      setMessage("Password updated successfully! Redirecting to login...");

      // Sign out and redirect to login after a brief delay
      setTimeout(async () => {
        await supabase.auth.signOut();
        navigate("/login");
      }, 2000);
    }
  };

  const panel = "rounded-xl bg-zinc-50 p-6 shadow-sm shadow-black/10";
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
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-xl font-semibold tracking-tight">
                Set New Password
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter your new password below.
              </p>
            </div>

            <img
              src="/faviconNoBG.png"
              alt="Miata Fitment"
              className="h-8 w-auto opacity-95"
            />
          </div>

          <Separator className="my-4" />

          {checkingSession ? (
            <div className="text-center py-8 text-muted-foreground">
              Verifying reset link...
            </div>
          ) : !isValidSession ? (
            <div className="space-y-4">
              <Alert variant="destructive">
                <AlertTitle>Invalid Link</AlertTitle>
                <AlertDescription>
                  This password reset link is invalid or has expired.
                </AlertDescription>
              </Alert>

              <Button
                className={`w-full ${primaryBtn}`}
                onClick={() => navigate("/login")}
              >
                Back to Login
              </Button>
            </div>
          ) : (
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="password" className={label}>
                  New Password
                </Label>
                <Input
                  id="password"
                  className={input}
                  type="password"
                  autoComplete="new-password"
                  autoFocus
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  placeholder="At least 6 characters"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword" className={label}>
                  Confirm New Password
                </Label>
                <Input
                  id="confirmPassword"
                  className={input}
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  placeholder="Re-enter your password"
                />
                {confirmPassword.length > 0 && password !== confirmPassword && (
                  <p className="text-xs text-red-500">Passwords do not match</p>
                )}
              </div>

              <Button
                type="submit"
                className={`w-full ${primaryBtn}`}
                disabled={loading || !canSubmit}
              >
                {loading ? "Updating..." : "Update Password"}
              </Button>

              {message && (
                <Alert variant={messageType === "error" ? "destructive" : "default"}>
                  <AlertTitle>
                    {messageType === "error" ? "Error" : "Success"}
                  </AlertTitle>
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              )}
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
