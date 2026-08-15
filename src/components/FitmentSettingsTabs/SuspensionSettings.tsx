import { Field } from "@/components/ui/field";
import { SettingsCard } from "@/components/ui/settings-card";
import { Slider } from "@/components/ui/slider";
import { useSetting } from "@/hooks/useSetting";
import { inchesToMM } from "@/services/inchesToCM";
import { useUserSettingsStore } from "@/stores/userSettingsStore";
import type { Axle } from "@/constants/wheelPositions";
import type { Settings } from "@/types/settings";
import {
  CAMBER_RANGE,
  CASTER_RANGE,
  RIDE_HEIGHT_RANGE,
  STOCK_RIDE_HEIGHT,
  TOE_RANGE,
  hubToFenderAtRest,
  stockHubToFender,
} from "@/utils/suspensionGeometry";

interface SuspensionSettingsProps {
  /** Display only — never read to decide behaviour. That is `axle`'s job. */
  title: string;
  axle: Axle;
}

type Range = { min: number; max: number; step: number };

// Which setting holds each alignment value for a given axle. Caster is absent
// because it is a front-only adjustment with no rear twin.
const ALIGNMENT_KEYS: Record<
  Axle,
  { rideHeightFt: keyof Settings; camberDeg: keyof Settings; toeRad: keyof Settings }
> = {
  front: {
    rideHeightFt: "rideHeightFrontFt",
    camberDeg: "frontCamberDeg",
    toeRad: "frontToeRad",
  },
  rear: {
    rideHeightFt: "rideHeightRearFt",
    camberDeg: "rearCamberDeg",
    toeRad: "rearToeRad",
  },
};

const snapToStep = (value: number, step: number) =>
  Math.round(value / step) * step;

const AlignmentSlider = ({
  id,
  label,
  valueText,
  value,
  range,
  onChange,
}: {
  id: string;
  label: string;
  valueText: string;
  value: number;
  range: Range;
  onChange: (value: number) => void;
}) => (
  <Field id={id} label={label} valueText={valueText} className="space-y-2">
    <Slider
      id={id}
      value={[value]}
      min={range.min}
      max={range.max}
      step={range.step}
      onValueChange={([next]) => onChange(next)}
    />
  </Field>
);

const SuspensionSettings = ({ title, axle }: SuspensionSettingsProps) => {
  const keys = ALIGNMENT_KEYS[axle];
  const [rideHeightFt, setRideHeight] = useSetting(keys.rideHeightFt);
  const [camberDeg, setCamber] = useSetting(keys.camberDeg);
  const [toeRad, setToe] = useSetting(keys.toeRad);
  const [casterDeg, setCaster] = useSetting("frontCasterDeg");

  // Single source of truth — kept in sync with the Account tab's toggle.
  const isMetric = useUserSettingsStore((state) => state.metric);

  const formatLength = (inches: number) =>
    isMetric ? `${inchesToMM(inches)} mm` : `${inches.toFixed(2)}″`;

  const rideHeightText =
    rideHeightFt === STOCK_RIDE_HEIGHT
      ? `Stock (${formatLength(stockHubToFender(axle))})`
      : formatLength(hubToFenderAtRest(rideHeightFt, axle));

  return (
    <SettingsCard title={title}>
      <div className="space-y-4">
        <AlignmentSlider
          id={`${axle}-rideHeightFt`}
          label="Ride Height"
          valueText={rideHeightText}
          value={rideHeightFt}
          range={RIDE_HEIGHT_RANGE}
          onChange={setRideHeight}
        />

        <AlignmentSlider
          id={`${axle}-camberDeg`}
          label="Camber"
          valueText={`${camberDeg.toFixed(1)}°`}
          value={camberDeg}
          range={CAMBER_RANGE}
          onChange={(next) => setCamber(snapToStep(next, CAMBER_RANGE.step))}
        />

        {axle === "front" ? (
          <AlignmentSlider
            id={`${axle}-casterDeg`}
            label="Caster"
            valueText={`${casterDeg.toFixed(1)}°`}
            value={casterDeg}
            range={CASTER_RANGE}
            onChange={(next) => setCaster(snapToStep(next, CASTER_RANGE.step))}
          />
        ) : null}

        <AlignmentSlider
          id={`${axle}-toeRad`}
          label="Toe"
          valueText={`${toeRad.toFixed(2)}°`}
          value={toeRad}
          range={TOE_RANGE}
          onChange={(next) => setToe(snapToStep(next, TOE_RANGE.step))}
        />
      </div>
    </SettingsCard>
  );
};

export default SuspensionSettings;
