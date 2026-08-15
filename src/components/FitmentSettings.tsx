import { useEffect, useCallback } from "react";
import type { Settings } from "@/types/settings";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useFitmentStore, useUIStore } from "@/stores";
import type { SettingsTab } from "@/types/stores";
import { useUserSettingsStore } from "@/stores/userSettingsStore";

import SuspensionSettings from "@/components/FitmentSettingsTabs/SuspensionSettings";
import WheelSettings from "@/components/FitmentSettingsTabs/WheelSettings";
import TireSettings from "@/components/FitmentSettingsTabs/TireSettings";
import CarSelectionSettings from "@/components/FitmentSettingsTabs/CarSelectionSettings";
import AccountSettings from "@/components/FitmentSettingsTabs/AccountSettings";
import { BuyPartsButton } from "./BuyWheelButton";

const FitmentSettings = () => {
  const activeTab = useUIStore((s) => s.activeTab);
  const setActiveTab = useUIStore((s) => s.setActiveTab);
  const bounceRequested = useUIStore((s) => s.bounceRequested);
  const requestBounce = useUIStore((s) => s.requestBounce);

  const model = useFitmentStore((s) => s.model);
  const setModel = useFitmentStore((s) => s.setModel);
  const wheelDesign = useFitmentStore((s) => s.wheelDesign);
  const setWheelDesign = useFitmentStore((s) => s.setWheelDesign);
  const settings = useFitmentStore((s) => s.settings);
  const updateSettings = useFitmentStore((s) => s.updateSettings);
  const matchWheels = useFitmentStore((s) => s.matchWheels);
  const setMatchWheels = useFitmentStore((s) => s.setMatchWheels);
  const matchTires = useFitmentStore((s) => s.matchTires);
  const setMatchTires = useFitmentStore((s) => s.setMatchTires);

  const { user, loading } = useAuth();

  // Hydrate unit preferences once the user is known, so the Alignment tab
  // renders the right units without needing a visit to the Account tab.
  const fetchUserSettings = useUserSettingsStore((s) => s.fetchSettings);
  useEffect(() => {
    if (user?.id) fetchUserSettings(user.id);
  }, [user?.id, fetchUserSettings]);

  const set = useCallback(
    <K extends keyof Settings>(key: K) =>
      (value: Settings[K]) =>
        updateSettings({ [key]: value } as Pick<Settings, K>),
    [updateSettings],
  );

  return (
    <div className="flex h-full flex-col bg-muted/30">
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as SettingsTab)}
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
              <TabsTrigger value="alignment" className="shrink-0">
                Alignment
              </TabsTrigger>
              <TabsTrigger value="wheels" className="shrink-0">
                Wheels
              </TabsTrigger>
              <TabsTrigger value="tires" className="shrink-0">
                Tires
              </TabsTrigger>
              <TabsTrigger value="car" className="shrink-0">
                Car
              </TabsTrigger>
              <TabsTrigger value="account" className="shrink-0">
                Account
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="bg-zinc-100 p-4">
            <TabsContent value="alignment" className="mt-0 space-y-4">
              <SuspensionSettings
                title="Front Suspension"
                axle="front"
                rideHeight={settings.rideHeightFront}
                setRideHeight={set("rideHeightFront")}
                camber={settings.frontCamber}
                setCamber={set("frontCamber")}
                caster={settings.frontCaster}
                setCaster={set("frontCaster")}
                toe={settings.frontToe}
                setToe={set("frontToe")}
              />

              <SuspensionSettings
                title="Rear Suspension"
                axle="rear"
                rideHeight={settings.rideHeightRear}
                setRideHeight={set("rideHeightRear")}
                camber={settings.rearCamber}
                setCamber={set("rearCamber")}
                toe={settings.rearToe}
                setToe={set("rearToe")}
              />
              <Button
                className="w-full"
                variant="outline"
                onClick={() => requestBounce()}
                disabled={bounceRequested || model == "nd"}
              >
                Simulate Bounce
              </Button>
              <p className="-mt-3 text-xs text-muted-foreground text-left">
                Additional suspension settings under the &ldquo;Car&rdquo; tab.
              </p>
              <BuyPartsButton type="suspension" />
            </TabsContent>

            <TabsContent value="wheels" className="mt-0 space-y-4">
              <WheelSettings
                matchWheels={matchWheels}
                setMatchWheels={setMatchWheels}
                frontWheelWidth={settings.frontWheelWidth}
                setFrontWheelWidth={set("frontWheelWidth")}
                frontWheelDiameter={settings.frontWheelDiameter}
                setFrontWheelDiameter={set("frontWheelDiameter")}
                frontWheelOffset={settings.frontWheelOffset}
                setFrontWheelOffset={set("frontWheelOffset")}
                frontWheelSpacer={settings.frontWheelSpacer}
                setFrontWheelSpacer={set("frontWheelSpacer")}
                rearWheelWidth={settings.rearWheelWidth}
                setRearWheelWidth={set("rearWheelWidth")}
                rearWheelDiameter={settings.rearWheelDiameter}
                setRearWheelDiameter={set("rearWheelDiameter")}
                rearWheelOffset={settings.rearWheelOffset}
                setRearWheelOffset={set("rearWheelOffset")}
                rearWheelSpacer={settings.rearWheelSpacer}
                setRearWheelSpacer={set("rearWheelSpacer")}
              />
              <BuyPartsButton
                type="wheel"
                wheel={{
                  width: settings.frontWheelWidth,
                  offset: settings.frontWheelOffset,
                  diameter: settings.frontWheelDiameter,
                }}
              />
            </TabsContent>

            <TabsContent value="tires" className="mt-0 space-y-4">
              <TireSettings
                matchTires={matchTires}
                setMatchTires={setMatchTires}
                frontTireWidth={settings.frontTireWidth}
                setFrontTireWidth={set("frontTireWidth")}
                frontTireSidewall={settings.frontTireSidewall}
                setFrontTireSidewall={set("frontTireSidewall")}
                rearTireWidth={settings.rearTireWidth}
                setRearTireWidth={set("rearTireWidth")}
                rearTireSidewall={settings.rearTireSidewall}
                setRearTireSidewall={set("rearTireSidewall")}
              />
              <BuyPartsButton
                type="tire"
                tire={{
                  frontWidth: settings.frontTireWidth,
                  frontRatio: settings.frontTireSidewall,
                  frontDiameter: settings.frontWheelDiameter,
                  rearWidth: settings.rearTireWidth,
                  rearRatio: settings.rearTireSidewall,
                  rearDiameter: settings.rearWheelDiameter,
                }}
              />
            </TabsContent>

            <TabsContent value="car" className="mt-0">
              <CarSelectionSettings
                model={model}
                setModel={setModel}
                springRateLbIn={settings.springRateLbIn}
                setSpringRateLbIn={set("springRateLbIn")}
                wheelDesign={wheelDesign}
                setWheelDesign={setWheelDesign}
                user={user}
                loading={loading}
              />
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
