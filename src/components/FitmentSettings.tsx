import { useEffect, useCallback } from "react";
import type { Settings } from "@/types/settings";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/provider/AuthProvider";
import { useFitmentStore, useUIStore, type SettingsTab } from "@/stores";
import { useUserSettingsStore } from "@/stores/userSettingsStore";

import SuspensionSettings from "@/components/FitmentSettingsTabs/SuspensionSettings";
import WheelSettings from "@/components/FitmentSettingsTabs/WheelSettings";
import TireSettings from "@/components/FitmentSettingsTabs/TireSettings";
import CarSelectionSettings from "@/components/FitmentSettingsTabs/CarSelectionSettings";
import AccountSettings from "@/components/FitmentSettingsTabs/AccountSettings";
import { BuyPartsButton } from "./BuyWheelButton";

const STOCK_RIDE_HEIGHT = -2.65;
const MM_TO_INCHES = 25.4;

const FitmentSettings = () => {
  const activeTab = useUIStore((s) => s.activeTab);
  const setActiveTab = useUIStore((s) => s.setActiveTab);
  const matchWheels = useUIStore((s) => s.matchWheels);
  const setMatchWheels = useUIStore((s) => s.setMatchWheels);
  const matchTires = useUIStore((s) => s.matchTires);
  const setMatchTires = useUIStore((s) => s.setMatchTires);
  const bounceRequested = useUIStore((s) => s.bounceRequested);
  const requestBounce = useUIStore((s) => s.requestBounce);

  const model = useFitmentStore((s) => s.model);
  const setModel = useFitmentStore((s) => s.setModel);
  const settings = useFitmentStore((s) => s.settings);
  const updateSettings = useFitmentStore((s) => s.updateSettings);

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

  useEffect(() => {
    if (!matchWheels) return;
    updateSettings({
      rearWheelWidth: settings.frontWheelWidth,
      rearWheelDiameter: settings.frontWheelDiameter,
      rearWheelOffset: settings.frontWheelOffset,
      rearWheelSpacer: settings.frontWheelSpacer,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    matchWheels,
    settings.frontWheelWidth,
    settings.frontWheelDiameter,
    settings.frontWheelOffset,
    settings.frontWheelSpacer,
    updateSettings,
  ]);

  useEffect(() => {
    if (!matchTires) return;
    updateSettings({
      rearTireWidth: settings.frontTireWidth,
      rearTireSidewall: settings.frontTireSidewall,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    matchTires,
    settings.frontTireWidth,
    settings.frontTireSidewall,
    updateSettings,
  ]);

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
                rideHeight={settings.rideHeightFront}
                setRideHeight={set("rideHeightFront")}
                camber={settings.frontCamber}
                setCamber={set("frontCamber")}
                caster={settings.frontCaster}
                setCaster={set("frontCaster")}
                toe={settings.frontToe}
                setToe={set("frontToe")}
                stockRideHeight={STOCK_RIDE_HEIGHT}
                mmToInches={MM_TO_INCHES}
              />

              <SuspensionSettings
                title="Rear Suspension"
                rideHeight={settings.rideHeightRear}
                setRideHeight={set("rideHeightRear")}
                camber={settings.rearCamber}
                setCamber={set("rearCamber")}
                toe={settings.rearToe}
                setToe={set("rearToe")}
                stockRideHeight={STOCK_RIDE_HEIGHT}
                mmToInches={MM_TO_INCHES}
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
                Additional suspension settings under 'car' tab.
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
