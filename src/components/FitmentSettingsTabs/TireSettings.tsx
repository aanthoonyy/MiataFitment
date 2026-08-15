import { SettingsCard } from "@/components/ui/settings-card";
import { useFitmentStore } from "@/stores";
import { BuyPartsButton } from "@/components/BuyWheelButton";
import AxleNumberFields, { type AxleFieldSpec } from "./AxleNumberFields";
import MatchFrontToggle from "./MatchFrontToggle";
import { STRINGS } from "@/i18n/strings";

const TIRE_FIELDS: readonly AxleFieldSpec[] = [
  {
    id: "tire-width",
    label: STRINGS.tires.width,
    unit: STRINGS.units.millimetres,
    keys: { front: "frontTireWidthMm", rear: "rearTireWidthMm" },
  },
  {
    id: "tire-sidewall",
    label: STRINGS.tires.sidewall,
    unit: STRINGS.units.percent,
    keys: { front: "frontTireAspectRatio", rear: "rearTireAspectRatio" },
  },
];

const TireSettings = () => {
  const matchTires = useFitmentStore((state) => state.matchTires);
  const setMatchTires = useFitmentStore((state) => state.setMatchTires);

  // The shop link quotes both axles, so it needs the wheel diameters too.
  const frontWidth = useFitmentStore((state) => state.settings.frontTireWidthMm);
  const frontRatio = useFitmentStore(
    (state) => state.settings.frontTireAspectRatio,
  );
  const frontDiameter = useFitmentStore(
    (state) => state.settings.frontWheelDiameterIn,
  );
  const rearWidth = useFitmentStore((state) => state.settings.rearTireWidthMm);
  const rearRatio = useFitmentStore((state) => state.settings.rearTireAspectRatio);
  const rearDiameter = useFitmentStore(
    (state) => state.settings.rearWheelDiameterIn,
  );

  return (
    <>
      <div className="space-y-5">
        <SettingsCard title={STRINGS.tires.frontTitle}>
          <AxleNumberFields axle="front" fields={TIRE_FIELDS} />
        </SettingsCard>

        <SettingsCard
          title={STRINGS.tires.rearTitle}
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
