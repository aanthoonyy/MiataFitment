import React, { useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import type { User } from "@supabase/supabase-js";

import { Button } from "@/components/ui/button";
import { SettingsCard } from "@/components/ui/settings-card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { STRINGS, t } from "@/i18n/strings";
import { Garage } from "./AccountSettingsSubTabs/Garage";
import UserSettings from "./AccountSettingsSubTabs/UserSettings";

interface AccountSettingsProps {
  user: User | null;
}

type InnerTab = "garage" | "account";

const AccountSettings: React.FC<AccountSettingsProps> = ({ user }) => {
  const [innerTab, setInnerTab] = useState<InnerTab>("garage");

  // Must stay above the early return below — hooks cannot be called
  // conditionally, or the hook order changes on sign-in/sign-out.
  const displayName = useMemo(() => {
    if (!user) return STRINGS.account.fallbackName;
    const metadataName = user.user_metadata?.displayName;
    return (
      (typeof metadataName === "string" ? metadataName : undefined) ||
      user.email ||
      STRINGS.account.fallbackName
    );
  }, [user]);

  if (!user) {
    return (
      <div className="space-y-4">
        <SettingsCard title={STRINGS.account.title}>
          <div className="space-y-2">
            <p className="text-sm">{STRINGS.account.notSignedIn}</p>
            <p className="text-sm text-muted-foreground">
              {STRINGS.account.signInBlurb}
            </p>

            <div className="pt-2">
              <Button asChild>
                <RouterLink to="/login">{STRINGS.account.signIn}</RouterLink>
              </Button>
            </div>
          </div>
        </SettingsCard>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <SettingsCard title={t(STRINGS.account.welcome, { name: displayName })}>
        <Tabs
          value={innerTab}
          onValueChange={(value) => setInnerTab(value as InnerTab)}
        >
          <TabsList className="w-full justify-start">
            <TabsTrigger value="garage">
              {STRINGS.account.tabs.garage}
            </TabsTrigger>
            <TabsTrigger value="account">
              {STRINGS.account.tabs.account}
            </TabsTrigger>
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
      </SettingsCard>
    </div>
  );
};

export default AccountSettings;
