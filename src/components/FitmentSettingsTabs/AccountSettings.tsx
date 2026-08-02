import React, { useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import type { User } from "@supabase/supabase-js";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Garage } from "./AccountSettingsSubTabs/Garage";
import UserSettings from "./AccountSettingsSubTabs/UserSettings";

interface AccountSettingsProps {
  user: User | null;
}

const AccountSettings: React.FC<AccountSettingsProps> = ({ user }) => {
  const [innerTab, setInnerTab] = useState<"garage" | "account">("garage");

  const sectionCard =
    "rounded-xl bg-zinc-50 p-4 shadow-sm shadow-black/10";
  const sectionTitle = "text-sm font-medium";

  // Must stay above the early return below — hooks cannot be called
  // conditionally, or the hook order changes on sign-in/sign-out.
  const displayName = useMemo(() => {
    if (!user) return "User";
    const meta = user.user_metadata as Record<string, unknown> | undefined;
    return (meta?.displayName as string) || user.email || "User";
  }, [user]);

  if (!user) {
    return (
      <div className="space-y-4">
        <div className={sectionCard}>
          <div className={sectionTitle}>Account</div>
          <Separator className="my-3" />

          <div className="space-y-2">
            <p className="text-sm">You’re not signed in.</p>
            <p className="text-sm text-muted-foreground">
              Sign in to access your garage and account settings.
            </p>

            <div className="pt-2">
              <Button asChild>
                <RouterLink to="/login">Sign in</RouterLink>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className={sectionCard}>
        <div className="flex items-center justify-between">
          <div className={sectionTitle}>Welcome, {displayName}</div>
        </div>

        <Separator className="my-3" />

        <Tabs value={innerTab} onValueChange={(v) => setInnerTab(v as any)}>
          <TabsList className="w-full justify-start">
            <TabsTrigger value="garage">Garage</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>

          <TabsContent value="garage" className="mt-4">
            <Garage userId={user.id} />
          </TabsContent>

          <TabsContent value="account" className="mt-4">
            <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
              <UserSettings />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AccountSettings;
