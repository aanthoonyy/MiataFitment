import { useEffect, useState, useCallback } from "react";
import type { Settings } from "@/types/settings";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useCarModel } from "./components/Header";
import { useAuth } from "./provider/AuthProvider";
import { useFitmentConfig } from "@/contexts/FitmentSettingsContext";

import SuspensionSettings from "./components/FitmentSettingsTabs/SuspensionSettings";
import WheelSettings from "./components/FitmentSettingsTabs/WheelSettings";
import TireSettings from "./components/FitmentSettingsTabs/TireSettings";
import CarSelectionSettings from "./components/FitmentSettingsTabs/CarSelectionSettings";
import AccountSettings from "./components/FitmentSettingsTabs/AccountSettings";

type SettingsTab = "alignment" | "wheels" | "tires" | "car" | "account";

const STOCK_RIDE_HEIGHT = -2.65;
const MM_TO_INCHES = 25.4;

const CombinedSettings = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>("alignment");

  const { model, setModel } = useCarModel();
  const { user, loading } = useAuth();

  const {
    config,
    updateSettings,
  } = useFitmentConfig();

  const settings = config.settings;

  const [matchWheels, setMatchWheels] = useState(false);
  const [matchTires, setMatchTires] = useState(false);

  const set = useCallback(
    <K extends keyof Settings>(key: K) =>
      (value: Settings[K]) =>
        updateSettings({ [key]: value } as Pick<Settings, K>),
    [updateSettings]
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
    <div className="h-full overflow-auto bg-muted/30">
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as SettingsTab)}>
        <div className="sticky top-0 z-10 bg-zinc-200 shadow-sm">
          <div className="p-4 pb-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Settings</h2>
            </div>
          </div>

          <div className="px-4 pb-3">
            <TabsList className="w-full justify-start overflow-x-auto">
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
          </TabsContent>

          <TabsContent value="wheels" className="mt-0">
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
          </TabsContent>

          <TabsContent value="tires" className="mt-0">
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
          </TabsContent>

          <TabsContent value="car" className="mt-0">
            <CarSelectionSettings
              model={model}
              setModel={setModel}
              user={user}
              loading={loading}
            />
          </TabsContent>

          <TabsContent value="account" className="mt-0">
            <AccountSettings user={user} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default CombinedSettings;
