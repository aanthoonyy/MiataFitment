import React, { useEffect, useState } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export interface WheelSettingsProps {
  matchWheels: boolean;
  setMatchWheels: (value: boolean) => void;

  frontWheelWidth: number;
  setFrontWheelWidth: (value: number) => void;
  frontWheelDiameter: number;
  setFrontWheelDiameter: (value: number) => void;
  frontWheelOffset: number;
  setFrontWheelOffset: (value: number) => void;
  frontWheelSpacer: number;
  setFrontWheelSpacer: (value: number) => void;

  rearWheelWidth: number;
  setRearWheelWidth: (value: number) => void;
  rearWheelDiameter: number;
  setRearWheelDiameter: (value: number) => void;
  rearWheelOffset: number;
  setRearWheelOffset: (value: number) => void;
  rearWheelSpacer: number;
  setRearWheelSpacer: (value: number) => void;
}

const isNumericLike = (value: string) => /^-?\d*\.?\d*$/.test(value);

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

const WheelSettings: React.FC<WheelSettingsProps> = ({
  matchWheels,
  setMatchWheels,

  frontWheelWidth,
  setFrontWheelWidth,
  frontWheelDiameter,
  setFrontWheelDiameter,
  frontWheelOffset,
  setFrontWheelOffset,
  frontWheelSpacer,
  setFrontWheelSpacer,

  rearWheelWidth,
  setRearWheelWidth,
  rearWheelDiameter,
  setRearWheelDiameter,
  rearWheelOffset,
  setRearWheelOffset,
  rearWheelSpacer,
  setRearWheelSpacer,
}) => {
  
  const [frontOffsetInput, setFrontOffsetInput] = useState(
    frontWheelOffset.toString()
  );
  const [rearOffsetInput, setRearOffsetInput] = useState(
    rearWheelOffset.toString()
  );

  const handleOffsetChange = (
    value: string,
    setInput: React.Dispatch<React.SetStateAction<string>>,
    setNumber: (v: number) => void
  ) => {
    if (!isNumericLike(value)) return;
    setInput(value);
    const num = parseFloat(value);
    if (!Number.isNaN(num)) setNumber(num);
  };

  const sectionTitle = "text-sm font-medium";
  const grid = "grid grid-cols-1 gap-3 sm:grid-cols-2";
  const input = "h-9";

  const sectionCard =
    "rounded-xl bg-zinc-50 p-4 shadow-sm shadow-black/10 dark:bg-zinc-900 dark:shadow-black/40";

  return (
    <div className="space-y-5">
      {/* Front section */}
      <div className={sectionCard}>
        <div className="flex items-center justify-between">
          <div className={sectionTitle}>Front</div>
        </div>

        <Separator className="my-3" />

        <div className={grid}>
          <Field id="front-width" label="Width" unit="in">
            <Input
              id="front-width"
              className={input}
              type="number"
              inputMode="decimal"
              value={frontWheelWidth}
              onChange={(e) => setFrontWheelWidth(parseFloat(e.target.value))}
            />
          </Field>

          <Field id="front-diameter" label="Diameter" unit="in">
            <Input
              id="front-diameter"
              className={input}
              type="number"
              inputMode="decimal"
              value={frontWheelDiameter}
              onChange={(e) =>
                setFrontWheelDiameter(parseFloat(e.target.value))
              }
            />
          </Field>

          <Field id="front-offset" label="Offset" unit="mm">
            <Input
              id="front-offset"
              className={input}
              type="number"
              inputMode="decimal"
              value={frontOffsetInput}
              onChange={(e) =>
                handleOffsetChange(
                  e.target.value,
                  setFrontOffsetInput,
                  setFrontWheelOffset
                )
              }
            />
          </Field>

          <Field id="front-spacer" label="Spacer" unit="mm">
            <Input
              id="front-spacer"
              className={input}
              type="number"
              inputMode="decimal"
              value={frontWheelSpacer}
              onChange={(e) => setFrontWheelSpacer(parseFloat(e.target.value))}
            />
          </Field>
        </div>
      </div>

      {/* Rear section */}
      <div className={`${sectionCard} ${matchWheels ? "opacity-60" : ""}`}>
        <div className="flex items-center justify-between">
          <div className={sectionTitle}>Rear</div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="match-wheels"
              checked={matchWheels}
              onCheckedChange={(v) => setMatchWheels(v === true)}
            />
            <Label
              htmlFor="match-wheels"
              className="text-xs text-muted-foreground"
            >
              Match front
            </Label>
          </div>
        </div>

        <Separator className="my-3" />

        <div className={grid}>
          <Field id="rear-width" label="Width" unit="in">
            <Input
              id="rear-width"
              className={input}
              type="number"
              inputMode="decimal"
              value={rearWheelWidth}
              onChange={(e) => setRearWheelWidth(parseFloat(e.target.value))}
              disabled={matchWheels}
            />
          </Field>

          <Field id="rear-diameter" label="Diameter" unit="in">
            <Input
              id="rear-diameter"
              className={input}
              type="number"
              inputMode="decimal"
              value={rearWheelDiameter}
              onChange={(e) => setRearWheelDiameter(parseFloat(e.target.value))}
              disabled={matchWheels}
            />
          </Field>

          <Field id="rear-offset" label="Offset" unit="mm">
            <Input
              id="rear-offset"
              className={input}
              type="number"
              inputMode="decimal"
              value={rearOffsetInput}
              onChange={(e) =>
                handleOffsetChange(
                  e.target.value,
                  setRearOffsetInput,
                  setRearWheelOffset
                )
              }
              disabled={matchWheels}
            />
          </Field>

          <Field id="rear-spacer" label="Spacer" unit="mm">
            <Input
              id="rear-spacer"
              className={input}
              type="number"
              inputMode="decimal"
              value={rearWheelSpacer}
              onChange={(e) => setRearWheelSpacer(parseFloat(e.target.value))}
              disabled={matchWheels}
            />
          </Field>
        </div>
      </div>
    </div>
  );
};

export default WheelSettings;
