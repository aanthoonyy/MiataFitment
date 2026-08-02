import { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { Footer } from "@/components/Footer";

type MsgType = "success" | "error";

function isRecoveryUrl(): boolean {
  const url = new URL(window.location.href);

  // Newer PKCE flow: /reset-password?code=...
  const hasCode = !!url.searchParams.get("code");

  // Some setups include type=recovery
  const hasRecoveryType = url.searchParams.get("type") === "recovery";

  // Older/hash flow: #access_token=...&type=recovery
  const hash = window.location.hash ?? "";
  const hasHashAccessToken = hash.includes("access_token=");
  const hashHasRecoveryType = hash.includes("type=recovery");

  return (
    hasCode || hasRecoveryType || hasHashAccessToken || hashHasRecoveryType
  );
}

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<MsgType>("success");

  const [loading, setLoading] = useState(false);

  const [checkingSession, setCheckingSession] = useState(true);
  const [isValidSession, setIsValidSession] = useState(false);

  const navigate = useNavigate();
  const { session: authSession, loading: authLoading } = useAuth();

  const cameFromRecovery = useMemo(() => {
    // Compute once on mount
    return isRecoveryUrl();
  }, []);

  // 1) If we have a ?code=... link, exchange it for a session
  useEffect(() => {
    const exchangeIfNeeded = async () => {
      try {
        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");
        if (!code) return;

        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          setMessageType("error");
          setMessage(
            "Invalid or expired reset link. Please request a new one.",
          );
          return;
        }

        // Remove code from the URL so refreshes don't re-exchange
        url.searchParams.delete("code");
        window.history.replaceState({}, "", url.toString());
      } catch {
        setMessageType("error");
        setMessage("Invalid or expired reset link. Please request a new one.");
      }
    };

    exchangeIfNeeded();
  }, []);

  // 2) Validate session AFTER auth has initialized (and after exchange)
  useEffect(() => {
    if (authLoading) return;

    const validate = async () => {
      // If user didn't come from a recovery URL, don't allow reset
      if (!cameFromRecovery) {
        setIsValidSession(false);
        setMessageType("error");
        setMessage("This reset link is invalid. Please request a new one.");
        setCheckingSession(false);
        return;
      }

      // Prefer provider session, but also double-check directly
      const session =
        authSession ?? (await supabase.auth.getSession()).data.session;

      if (session) {
        setIsValidSession(true);
      } else {
        setIsValidSession(false);
        setMessageType("error");
        setMessage("Invalid or expired reset link. Please request a new one.");
      }

      setCheckingSession(false);
    };

    validate();
  }, [authLoading, authSession, cameFromRecovery]);

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
      return;
    }

    setMessageType("success");
    setMessage("Password updated successfully! Redirecting to login...");

    // For safety, sign out the recovery session and return to login
    setTimeout(async () => {
      await supabase.auth.signOut();
      navigate("/login");
    }, 1200);
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
                  {message ||
                    "This password reset link is invalid or has expired."}
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
                <Alert
                  variant={messageType === "error" ? "destructive" : "default"}
                >
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
