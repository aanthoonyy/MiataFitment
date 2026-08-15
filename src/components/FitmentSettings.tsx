import { useEffect } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useUIStore } from "@/stores";
import type { SettingsTab } from "@/types/stores";
import { useUserSettingsStore } from "@/stores/userSettingsStore";

import AlignmentSettings from "@/components/FitmentSettingsTabs/AlignmentSettings";
import WheelSettings from "@/components/FitmentSettingsTabs/WheelSettings";
import TireSettings from "@/components/FitmentSettingsTabs/TireSettings";
import CarSelectionSettings from "@/components/FitmentSettingsTabs/CarSelectionSettings";
import AccountSettings from "@/components/FitmentSettingsTabs/AccountSettings";

const TABS: readonly { value: SettingsTab; label: string }[] = [
  { value: "alignment", label: "Alignment" },
  { value: "wheels", label: "Wheels" },
  { value: "tires", label: "Tires" },
  { value: "car", label: "Car" },
  { value: "account", label: "Account" },
];

const FitmentSettings = () => {
  const activeTab = useUIStore((state) => state.activeTab);
  const setActiveTab = useUIStore((state) => state.setActiveTab);

  const { user } = useAuth();

  // Hydrate unit preferences once the user is known, so the Alignment tab
  // renders the right units without needing a visit to the Account tab.
  const fetchUserSettings = useUserSettingsStore((state) => state.fetchSettings);
  useEffect(() => {
    if (user?.id) fetchUserSettings(user.id);
  }, [user?.id, fetchUserSettings]);

  return (
    <div className="flex h-full flex-col bg-muted/30">
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as SettingsTab)}
        className="flex flex-1 flex-col overflow-hidden"
      >
        <div className="shrink-0 bg-zinc-200 shadow-sm">
          <div className="p-4 pb-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Settings</h2>
            </div>
          </div>

          <div className="px-4 pb-3">
            <TabsList className="tabs-scroll w-full justify-start overflow-x-auto">
              {TABS.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="shrink-0"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="bg-zinc-100 p-4">
            <TabsContent value="alignment" className="mt-0 space-y-4">
              <AlignmentSettings />
            </TabsContent>

            <TabsContent value="wheels" className="mt-0 space-y-4">
              <WheelSettings />
            </TabsContent>

            <TabsContent value="tires" className="mt-0 space-y-4">
              <TireSettings />
            </TabsContent>

            <TabsContent value="car" className="mt-0">
              <CarSelectionSettings />
            </TabsContent>

            <TabsContent value="account" className="mt-0">
              <AccountSettings user={user} />
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default FitmentSettings;
