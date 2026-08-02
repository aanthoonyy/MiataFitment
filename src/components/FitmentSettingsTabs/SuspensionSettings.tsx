import React from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { inchesToMM } from "@/services/inchesToCM";
import { useUserSettingsStore } from "@/stores/userSettingsStore";
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
  title: string;

  rideHeight: number;
  setRideHeight: (value: number) => void;

  camber: number;
  setCamber: (value: number) => void;

  caster?: number; // Optional for rear settings
  setCaster?: (value: number) => void; // Optional for rear settings

  toe?: number;
  setToe?: (value: number) => void;
}

const clampToStep = (value: number, step: number) =>
  Math.round(value / step) * step;

const Field = ({
  id,
  label,
  unit,
  valueText,
  children,
}: {
  id: string;
  label: string;
  unit?: string;
  valueText?: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-2">
    <div className="flex items-baseline justify-between gap-2">
      <Label htmlFor={id} className="text-xs text-muted-foreground">
        {label}
      </Label>

      <div className="flex items-baseline gap-2">
        {unit ? (
          <span className="text-[11px] text-muted-foreground">{unit}</span>
        ) : null}
        {valueText ? (
          <span className="text-xs text-foreground tabular-nums">
            {valueText}
          </span>
        ) : null}
      </div>
    </div>

    {children}
  </div>
);

const SuspensionSettings: React.FC<SuspensionSettingsProps> = ({
  title,
  rideHeight,
  setRideHeight,
  camber,
  setCamber,
  caster,
  setCaster,
  toe,
  setToe,
}) => {
  const sectionTitle = "text-sm font-medium";
  const sectionCard =
    "rounded-xl bg-zinc-50 p-4 shadow-sm shadow-black/10";

  // Single source of truth — kept in sync with the Account tab's toggle.
  const isMetric = useUserSettingsStore((s) => s.metric);

  const isRear = title.toLowerCase().includes("rear");

  const stockHubFenderIn = stockHubToFender(isRear);
  const hubFenderIn = hubToFenderAtRest(rideHeight, isRear);

  const formatValue = (inches: number) =>
    isMetric ? `${inchesToMM(inches)} mm` : `${inches.toFixed(2)}\u2033`;

  const rideHeightText =
    rideHeight === STOCK_RIDE_HEIGHT
      ? `Stock (${formatValue(stockHubFenderIn)})`
      : formatValue(hubFenderIn);

  return (
    <div className={sectionCard}>
      <div className="flex items-center justify-between">
        <div className={sectionTitle}>{title}</div>
      </div>

      <Separator className="my-3" />

      <div className="space-y-4">
        <Field
          id={`${title}-rideHeight`}
          label="Ride Height"
          valueText={rideHeightText}
        >
          <Slider
            id={`${title}-rideHeight`}
            value={[rideHeight]}
            min={RIDE_HEIGHT_RANGE.min}
            max={RIDE_HEIGHT_RANGE.max}
            step={RIDE_HEIGHT_RANGE.step}
            onValueChange={([v]) => setRideHeight(v)}
          />
        </Field>

        {/* Camber */}
        <Field
          id={`${title}-camber`}
          label="Camber"
          valueText={`${camber.toFixed(1)}°`}
        >
          <Slider
            id={`${title}-camber`}
            value={[camber]}
            min={CAMBER_RANGE.min}
            max={CAMBER_RANGE.max}
            step={CAMBER_RANGE.step}
            onValueChange={([v]) => setCamber(clampToStep(v, CAMBER_RANGE.step))}
          />
        </Field>

        {/* Caster (optional) */}
        {caster !== undefined && setCaster ? (
          <Field
            id={`${title}-caster`}
            label="Caster"
            valueText={`${caster.toFixed(1)}°`}
          >
            <Slider
              id={`${title}-caster`}
              value={[caster]}
              min={CASTER_RANGE.min}
              max={CASTER_RANGE.max}
              step={CASTER_RANGE.step}
              onValueChange={([v]) => setCaster(clampToStep(v, CASTER_RANGE.step))}
            />
          </Field>
        ) : null}

        {/* Toe (optional) */}
        {toe !== undefined && setToe ? (
          <Field
            id={`${title}-toe`}
            label="Toe"
            valueText={`${toe.toFixed(2)}°`}
          >
            <Slider
              id={`${title}-toe`}
              value={[toe]}
              min={TOE_RANGE.min}
              max={TOE_RANGE.max}
              step={TOE_RANGE.step}
              onValueChange={([v]) => setToe(clampToStep(v, TOE_RANGE.step))}
            />
          </Field>
        ) : null}
      </div>
    </div>
  );
};

export default SuspensionSettings;
