import { SettingsCard } from "@/components/ui/settings-card";
import { useFitmentStore } from "@/stores";
import { BuyPartsButton } from "@/components/BuyWheelButton";
import AxleNumberFields, { type AxleFieldSpec } from "./AxleNumberFields";
import MatchFrontToggle from "./MatchFrontToggle";

const TIRE_FIELDS: readonly AxleFieldSpec[] = [
  {
    id: "tire-width",
    label: "Width",
    unit: "mm",
    keys: { front: "frontTireWidth", rear: "rearTireWidth" },
  },
  {
    id: "tire-sidewall",
    label: "Sidewall",
    unit: "%",
    keys: { front: "frontTireSidewall", rear: "rearTireSidewall" },
  },
];

const TireSettings = () => {
  const matchTires = useFitmentStore((state) => state.matchTires);
  const setMatchTires = useFitmentStore((state) => state.setMatchTires);

  // The shop link quotes both axles, so it needs the wheel diameters too.
  const frontWidth = useFitmentStore((state) => state.settings.frontTireWidth);
  const frontRatio = useFitmentStore(
    (state) => state.settings.frontTireSidewall,
  );
  const frontDiameter = useFitmentStore(
    (state) => state.settings.frontWheelDiameter,
  );
  const rearWidth = useFitmentStore((state) => state.settings.rearTireWidth);
  const rearRatio = useFitmentStore((state) => state.settings.rearTireSidewall);
  const rearDiameter = useFitmentStore(
    (state) => state.settings.rearWheelDiameter,
  );

  return (
    <>
      <div className="space-y-5">
        <SettingsCard title="Front Tires">
          <AxleNumberFields axle="front" fields={TIRE_FIELDS} />
        </SettingsCard>

        <SettingsCard
          title="Rear Tires"
          dimmed={matchTires}
          action={
            <MatchFrontToggle
              id="match-tires"
              checked={matchTires}
              onChange={setMatchTires}
            />
          }
        >
          <AxleNumberFields
            axle="rear"
            fields={TIRE_FIELDS}
            disabled={matchTires}
          />
        </SettingsCard>
      </div>

      <BuyPartsButton
        type="tire"
        tire={{
          frontWidth,
          frontRatio,
          frontDiameter,
          rearWidth,
          rearRatio,
          rearDiameter,
        }}
      />
    </>
  );
};

export default TireSettings;
