import { SettingsCard } from "@/components/ui/settings-card";
import { useFitmentStore } from "@/stores";
import { BuyPartsButton } from "@/components/BuyWheelButton";
import AxleNumberFields, { type AxleFieldSpec } from "./AxleNumberFields";
import MatchFrontToggle from "./MatchFrontToggle";
import { STRINGS } from "@/i18n/strings";

const WHEEL_FIELDS: readonly AxleFieldSpec[] = [
  {
    id: "width",
    label: STRINGS.wheels.width,
    unit: STRINGS.units.inches,
    keys: { front: "frontWheelWidthIn", rear: "rearWheelWidthIn" },
  },
  {
    id: "diameter",
    label: STRINGS.wheels.diameter,
    unit: STRINGS.units.inches,
    keys: { front: "frontWheelDiameterIn", rear: "rearWheelDiameterIn" },
  },
  {
    id: "offset",
    label: STRINGS.wheels.offset,
    unit: STRINGS.units.millimetres,
    keys: { front: "frontWheelOffsetMm", rear: "rearWheelOffsetMm" },
  },
  {
    id: "spacer",
    label: STRINGS.wheels.spacer,
    unit: STRINGS.units.millimetres,
    keys: { front: "frontWheelSpacerMm", rear: "rearWheelSpacerMm" },
  },
];

const WheelSettings = () => {
  const matchWheels = useFitmentStore((state) => state.matchWheels);
  const setMatchWheels = useFitmentStore((state) => state.setMatchWheels);

  // The shop link quotes the front wheel, so only those three are read here.
  const width = useFitmentStore((state) => state.settings.frontWheelWidthIn);
  const offset = useFitmentStore((state) => state.settings.frontWheelOffsetMm);
  const diameter = useFitmentStore(
    (state) => state.settings.frontWheelDiameterIn,
  );

  return (
    <>
      <div className="space-y-5">
        <SettingsCard title={STRINGS.wheels.frontTitle}>
          <AxleNumberFields axle="front" fields={WHEEL_FIELDS} />
        </SettingsCard>

        <SettingsCard
          title={STRINGS.wheels.rearTitle}
          dimmed={matchWheels}
          action={
            <MatchFrontToggle
              id="match-wheels"
              checked={matchWheels}
              onChange={setMatchWheels}
            />
          }
        >
          <AxleNumberFields
            axle="rear"
            fields={WHEEL_FIELDS}
            disabled={matchWheels}
          />
        </SettingsCard>
      </div>

      <BuyPartsButton type="wheel" wheel={{ width, offset, diameter }} />
    </>
  );
};

export default WheelSettings;
