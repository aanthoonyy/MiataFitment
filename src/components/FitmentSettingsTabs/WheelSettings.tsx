import { SettingsCard } from "@/components/ui/settings-card";
import { useFitmentStore } from "@/stores";
import { BuyPartsButton } from "@/components/BuyWheelButton";
import AxleNumberFields, { type AxleFieldSpec } from "./AxleNumberFields";
import MatchFrontToggle from "./MatchFrontToggle";

const WHEEL_FIELDS: readonly AxleFieldSpec[] = [
  {
    id: "width",
    label: "Width",
    unit: "in",
    keys: { front: "frontWheelWidthIn", rear: "rearWheelWidthIn" },
  },
  {
    id: "diameter",
    label: "Diameter",
    unit: "in",
    keys: { front: "frontWheelDiameterIn", rear: "rearWheelDiameterIn" },
  },
  {
    id: "offset",
    label: "Offset",
    unit: "mm",
    keys: { front: "frontWheelOffsetMm", rear: "rearWheelOffsetMm" },
  },
  {
    id: "spacer",
    label: "Spacer",
    unit: "mm",
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
        <SettingsCard title="Front">
          <AxleNumberFields axle="front" fields={WHEEL_FIELDS} />
        </SettingsCard>

        <SettingsCard
          title="Rear"
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
