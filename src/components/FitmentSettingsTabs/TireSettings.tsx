import React from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export interface TireSettingsProps {
  matchTires: boolean;
  setMatchTires: (value: boolean) => void;

  frontTireWidth: number;
  setFrontTireWidth: (value: number) => void;
  frontTireSidewall: number;
  setFrontTireSidewall: (value: number) => void;

  rearTireWidth: number;
  setRearTireWidth: (value: number) => void;
  rearTireSidewall: number;
  setRearTireSidewall: (value: number) => void;
}

const Field = ({
  id,
  label,
  unit,
  children,
}: {
  id: string;
  label: string;
  unit?: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-1.5">
    <div className="flex items-baseline justify-between gap-2">
      <Label htmlFor={id} className="text-xs text-muted-foreground">
        {label}
      </Label>
      {unit ? (
        <span className="text-[11px] text-muted-foreground">{unit}</span>
      ) : null}
    </div>
    {children}
  </div>
);

const TireSettings: React.FC<TireSettingsProps> = ({
  matchTires,
  setMatchTires,
  frontTireWidth,
  setFrontTireWidth,
  frontTireSidewall,
  setFrontTireSidewall,
  rearTireWidth,
  setRearTireWidth,
  rearTireSidewall,
  setRearTireSidewall,
}) => {
  const sectionTitle = "text-sm font-medium";
  const grid = "grid grid-cols-1 gap-3 sm:grid-cols-2";
  const input = "h-9";

  const sectionCard =
    "rounded-xl bg-zinc-50 p-4 shadow-sm shadow-black/10";

  return (
    <div className="space-y-5">
      {/* Front */}
      <div className={sectionCard}>
        <div className="flex items-center justify-between">
          <div className={sectionTitle}>Front Tires</div>
        </div>

        <Separator className="my-3" />

        <div className={grid}>
          <Field id="front-tire-width" label="Width" unit="mm">
            <Input
              id="front-tire-width"
              className={input}
              type="number"
              inputMode="decimal"
              value={frontTireWidth}
              onChange={(e) => setFrontTireWidth(parseFloat(e.target.value))}
            />
          </Field>

          <Field id="front-tire-sidewall" label="Sidewall" unit="%">
            <Input
              id="front-tire-sidewall"
              className={input}
              type="number"
              inputMode="decimal"
              value={frontTireSidewall}
              onChange={(e) => setFrontTireSidewall(parseFloat(e.target.value))}
            />
          </Field>
        </div>
      </div>

      {/* Rear */}
      <div className={`${sectionCard} ${matchTires ? "opacity-60" : ""}`}>
        <div className="flex items-center justify-between">
          <div className={sectionTitle}>Rear Tires</div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="match-tires"
              checked={matchTires}
              onCheckedChange={(v) => setMatchTires(v === true)}
            />
            <Label htmlFor="match-tires" className="text-xs text-muted-foreground">
              Match front
            </Label>
          </div>
        </div>

        <Separator className="my-3" />

        <div className={grid}>
          <Field id="rear-tire-width" label="Width" unit="mm">
            <Input
              id="rear-tire-width"
              className={input}
              type="number"
              inputMode="decimal"
              value={rearTireWidth}
              onChange={(e) => setRearTireWidth(parseFloat(e.target.value))}
              disabled={matchTires}
            />
          </Field>

          <Field id="rear-tire-sidewall" label="Sidewall" unit="%">
            <Input
              id="rear-tire-sidewall"
              className={input}
              type="number"
              inputMode="decimal"
              value={rearTireSidewall}
              onChange={(e) => setRearTireSidewall(parseFloat(e.target.value))}
              disabled={matchTires}
            />
          </Field>
        </div>
      </div>
    </div>
  );
};

export default TireSettings;
