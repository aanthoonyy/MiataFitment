import * as React from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "@/provider/AuthProvider";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Loader2 } from "lucide-react";

export const LandingHeader: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const goLogin = () => navigate("/login");

  const displayName =
    (user?.user_metadata as any)?.displayName ||
    user?.email?.split("@")[0] ||
    "Account";

  const avatarLetter = displayName?.[0]?.toUpperCase() || "?";

  return (
    <header className="w-full border-b border-[#0b94d1] bg-[#0DA5E8] text-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
        <Link to="/" className="inline-flex items-center gap-2">
          <img
            src="/faviconNoBG.png"
            alt="Miata Fitment Logo"
            className="h-10 w-auto"
          />
        </Link>

        <div className="flex items-center gap-2">
          {loading ? (
            <div className="flex items-center gap-2 text-white/90">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Loading</span>
            </div>
          ) : user ? (
            <div className="flex items-center gap-2">
              <span className="hidden text-sm text-white/90 sm:block">
                {displayName}
              </span>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="rounded-full outline-none transition focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0DA5E8]"
                    aria-label="Account"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-white font-semibold text-[#0b94d1]">
                        {avatarLetter}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-40 bg-white text-black dark:bg-zinc-900 dark:text-zinc-50 !border-0 ring-0 outline-none"
                >
                  <DropdownMenuItem onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={goLogin}
              className="border-white/80 bg-transparent text-white hover:border-white hover:bg-white/15"
            >
              Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
