import React from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { User } from "@supabase/supabase-js";
import { isMetricUser } from "@/services/userSettingsAPI";
import { inchesToMM } from "@/services/inchesToCM";

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

  stockRideHeight: number;
  mmToInches: number;

  user?: User | null;
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
  stockRideHeight,
  mmToInches,
  user,
}) => {
  const sectionTitle = "text-sm font-medium";
  const sectionCard =
    "rounded-xl bg-zinc-50 p-4 shadow-sm shadow-black/10 dark:bg-zinc-900 dark:shadow-black/40";

  const [isMetric, setIsMetric] = React.useState(false);

  React.useEffect(() => {
    const userId = user?.id;
    if (!userId) {
      // optional: choose your logged-out default behavior
      setIsMetric(false);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const value = await isMetricUser(userId);
        if (!cancelled) setIsMetric(value ?? false);
      } catch {
        if (!cancelled) setIsMetric(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const isRear = title.toLowerCase().includes("rear");

  const dropIn = (rideHeight - stockRideHeight) * mmToInches;

  const stockHubFenderIn = isRear ? 13.0 : 13.5;
  const ratio = isRear ? 1.5 / 5.0 : 2.5 / 4.0;

  const hubFenderIn = stockHubFenderIn - dropIn * ratio;

  const formatValue = (inches: number) =>
    isMetric ? `${inchesToMM(inches)} mm` : `${inches.toFixed(2)}\u2033`;

  const rideHeightText =
    rideHeight === stockRideHeight
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
            min={-3}
            max={-2}
            step={0.01}
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
            min={-20}
            max={1}
            step={0.1}
            onValueChange={([v]) => setCamber(clampToStep(v, 0.1))}
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
              min={5}
              max={8}
              step={0.1}
              onValueChange={([v]) => setCaster(clampToStep(v, 0.1))}
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
              min={-0.05}
              max={0.05}
              step={0.01}
              onValueChange={([v]) => setToe(clampToStep(v, 0.01))}
            />
          </Field>
        ) : null}
      </div>
    </div>
  );
};

export default SuspensionSettings;
