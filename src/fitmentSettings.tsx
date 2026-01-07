import { useEffect, useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

import { useCarModel } from "./components/Header";
import { useAuth } from "./provider/AuthProvider";

import SuspensionSettings from "./components/FitmentSettingsTabs/SuspensionSettings";
import WheelSettings from "./components/FitmentSettingsTabs/WheelSettings";
import TireSettings from "./components/FitmentSettingsTabs/TireSettings";
import CarSelectionSettings from "./components/FitmentSettingsTabs/CarSelectionSettings";
import AccountSettings from "./components/FitmentSettingsTabs/AccountSettings";

type SettingsProps = {
  updateModel: (model: any) => void;
};

type SettingsTab = "alignment" | "wheels" | "tires" | "car" | "account";

const CombinedSettings = ({ updateModel }: SettingsProps) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>("alignment");
  const { model, setModel } = useCarModel();
  const { user, loading } = useAuth();

  const [matchWheels, setMatchWheels] = useState(false);
  const [matchTires, setMatchTires] = useState(false);

  const [frontCamber, setFrontCamber] = useState(-0.5);
  const [rearCamber, setRearCamber] = useState(-0.5);
  const [frontCaster, setFrontCaster] = useState(5);
  const [frontToe, setFrontToe] = useState(0);
  const [rearToe, setRearToe] = useState(0);
  const [rideHeightFront, setRideHeightFront] = useState(-2.65);
  const [rideHeightRear, setRideHeightRear] = useState(-2.65);

  const STOCK_RIDE_HEIGHT = -2.65;
  const MM_TO_INCHES = 25.4;

  const [frontTireWidth, setFrontTireWidth] = useState(185);
  const [frontTireSidewall, setFrontTireSidewall] = useState(60);
  const [frontWheelWidth, setFrontWheelWidth] = useState(6);
  const [frontWheelDiameter, setFrontWheelDiameter] = useState(14);
  const [frontWheelOffset, setFrontWheelOffset] = useState(45);
  const [frontWheelSpacer, setFrontWheelSpacer] = useState(0);

  const [rearTireWidth, setRearTireWidth] = useState(185);
  const [rearTireSidewall, setRearTireSidewall] = useState(60);
  const [rearWheelWidth, setRearWheelWidth] = useState(6);
  const [rearWheelDiameter, setRearWheelDiameter] = useState(14);
  const [rearWheelOffset, setRearWheelOffset] = useState(45);
  const [rearWheelSpacer, setRearWheelSpacer] = useState(0);

  useEffect(() => {
    updateModel({
      frontCamber,
      rearCamber,
      frontCaster,
      frontToe,
      rearToe,
      rideHeightFront,
      rideHeightRear,
      frontTireWidth,
      frontTireSidewall,
      frontWheelWidth,
      frontWheelDiameter,
      frontWheelOffset,
      frontWheelSpacer,
      rearTireWidth,
      rearTireSidewall,
      rearWheelWidth,
      rearWheelDiameter,
      rearWheelOffset,
      rearWheelSpacer,
    });
  }, [
    frontCamber,
    rearCamber,
    frontCaster,
    frontToe,
    rearToe,
    rideHeightFront,
    rideHeightRear,
    frontTireWidth,
    frontTireSidewall,
    frontWheelWidth,
    frontWheelDiameter,
    frontWheelOffset,
    frontWheelSpacer,
    rearTireWidth,
    rearTireSidewall,
    rearWheelWidth,
    rearWheelDiameter,
    rearWheelOffset,
    rearWheelSpacer,
    updateModel,
  ]);

  useEffect(() => {
    if (matchWheels) {
      setRearWheelWidth(frontWheelWidth);
      setRearWheelDiameter(frontWheelDiameter);
      setRearWheelOffset(frontWheelOffset);
      setRearWheelSpacer(frontWheelSpacer);
    }
  }, [
    matchWheels,
    frontWheelWidth,
    frontWheelDiameter,
    frontWheelOffset,
    frontWheelSpacer,
  ]);

  useEffect(() => {
    if (matchTires) {
      setRearTireWidth(frontTireWidth);
      setRearTireSidewall(frontTireSidewall);
    }
  }, [matchTires, frontTireWidth, frontTireSidewall]);

  return (
    <div className="h-full overflow-auto bg-muted/30">
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as SettingsTab)}
      >
        {/* Sticky top toolbar */}
        <div
          className="
    sticky top-0 z-10
    bg-zinc-200
    shadow-sm
  "
        >
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

        {/* Content padding */}
        <div className="bg-zinc-100 p-4">
          {/* Alignment */}
          <TabsContent value="alignment" className="mt-0 space-y-4">
            <SuspensionSettings
              title="Front Suspension"
              rideHeight={rideHeightFront}
              setRideHeight={setRideHeightFront}
              camber={frontCamber}
              setCamber={setFrontCamber}
              caster={frontCaster}
              setCaster={setFrontCaster}
              toe={frontToe}
              setToe={setFrontToe}
              stockRideHeight={STOCK_RIDE_HEIGHT}
              mmToInches={MM_TO_INCHES}
            />
            <SuspensionSettings
              title="Rear Suspension"
              rideHeight={rideHeightRear}
              setRideHeight={setRideHeightRear}
              camber={rearCamber}
              setCamber={setRearCamber}
              stockRideHeight={STOCK_RIDE_HEIGHT}
              mmToInches={MM_TO_INCHES}
            />
          </TabsContent>

          {/* Wheels */}
          <TabsContent value="wheels" className="mt-0">
            <WheelSettings
              matchWheels={matchWheels}
              setMatchWheels={setMatchWheels}
              frontWheelWidth={frontWheelWidth}
              setFrontWheelWidth={setFrontWheelWidth}
              frontWheelDiameter={frontWheelDiameter}
              setFrontWheelDiameter={setFrontWheelDiameter}
              frontWheelOffset={frontWheelOffset}
              setFrontWheelOffset={setFrontWheelOffset}
              frontWheelSpacer={frontWheelSpacer}
              setFrontWheelSpacer={setFrontWheelSpacer}
              rearWheelWidth={rearWheelWidth}
              setRearWheelWidth={setRearWheelWidth}
              rearWheelDiameter={rearWheelDiameter}
              setRearWheelDiameter={setRearWheelDiameter}
              rearWheelOffset={rearWheelOffset}
              setRearWheelOffset={setRearWheelOffset}
              rearWheelSpacer={rearWheelSpacer}
              setRearWheelSpacer={setRearWheelSpacer}
            />
          </TabsContent>

          {/* Tires */}
          <TabsContent value="tires" className="mt-0">
            <TireSettings
              matchTires={matchTires}
              setMatchTires={setMatchTires}
              frontTireWidth={frontTireWidth}
              setFrontTireWidth={setFrontTireWidth}
              frontTireSidewall={frontTireSidewall}
              setFrontTireSidewall={setFrontTireSidewall}
              rearTireWidth={rearTireWidth}
              setRearTireWidth={setRearTireWidth}
              rearTireSidewall={rearTireSidewall}
              setRearTireSidewall={setRearTireSidewall}
            />
          </TabsContent>

          {/* Car */}
          <TabsContent value="car" className="mt-0">
            <CarSelectionSettings
              model={model}
              setModel={setModel}
              user={user}
              loading={loading}
            />
          </TabsContent>

          {/* Account */}
          <TabsContent value="account" className="mt-0">
            <AccountSettings user={user} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default CombinedSettings;
