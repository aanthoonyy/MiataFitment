import React from "react";
import { Link as RouterLink } from "react-router-dom";

import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CarModel } from "@/stores";

interface CarSelectionSettingsProps {
  model: "na" | "nb" | "nc" | "nd" | string;
  setModel: (value: CarModel) => void;
  springRateLbIn: number;
  setSpringRateLbIn: (value: number) => void;
  user: unknown | null;
  loading: boolean;
}

const SPRING_PRESETS = [
  { label: "Floaty", value: 100 },
  { label: "Stock-ish", value: 2500 },
  { label: "Coilover", value: 7000 },
  { label: "Stancy", value: 20000 },
] as const;

function closestPresetIndex(v: number) {
  let bestIdx = 0;
  let bestDist = Infinity;
  for (let i = 0; i < SPRING_PRESETS.length; i++) {
    const d = Math.abs(v - SPRING_PRESETS[i].value);
    if (d < bestDist) {
      bestDist = d;
      bestIdx = i;
    }
  }
  return bestIdx;
}

const CarSelectionSettings: React.FC<CarSelectionSettingsProps> = ({
  model,
  setModel,
  springRateLbIn,
  setSpringRateLbIn,
  user,
  loading,
}) => {
  const sectionTitle = "text-sm font-medium";
  const sectionCard = "rounded-xl bg-zinc-50 p-4 shadow-sm shadow-black/10";

  const disabled = loading;

  const safeSpringRateLbIn = Number.isFinite(springRateLbIn)
    ? springRateLbIn
    : 2500;

  const presetIndex = closestPresetIndex(safeSpringRateLbIn);
  const preset = SPRING_PRESETS[presetIndex];
  const suspensionLabel = disabled ? "Locked" : preset.label;

  // Disable customization dropdowns for now (regardless of auth/loading)
  const customizationDisabled = true;

  return (
    <div className="space-y-4">
      {/* ---------------- Car Selection Card ---------------- */}
      <div className={sectionCard}>
        <div className="flex items-center justify-between">
          <div className={sectionTitle}>Car Selection</div>
        </div>

        <Separator className="my-3" />

        <div className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-baseline justify-between gap-2">
              <Label className="text-xs text-muted-foreground">
                Miata Generation
              </Label>
              <span className="text-[11px] text-muted-foreground">
                {disabled ? "Locked" : "Editable"}
              </span>
            </div>

            <Select
              value={model}
              onValueChange={(v) => setModel(v as CarModel)}
              disabled={disabled}
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Select a generation" />
              </SelectTrigger>

              <SelectContent className="bg-white text-black border shadow-md">
                <SelectItem value="na">NA Miata (1989–1997)</SelectItem>
                <SelectItem value="nb">NB Miata (1998–2005)</SelectItem>
                <SelectItem value="nc" disabled>
                  NC Miata (2006–2015)
                </SelectItem>
                <SelectItem value="nd">
                  ND Miata (2016–Present) (IN TEST)
                </SelectItem>
              </SelectContent>
            </Select>

            {!user && !loading && (
              <p className="text-xs text-muted-foreground">
                Please{" "}
                <RouterLink
                  to="/login"
                  className="underline underline-offset-4 hover:text-foreground"
                >
                  log in
                </RouterLink>{" "}
                to change car selection.
              </p>
            )}
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">
            Select your Miata generation to view and customize its fitment
            settings. Each generation has unique wheel wells and suspension
            geometry.
          </p>
        </div>
      </div>

      {/* ---------------- Spring Rate Card ---------------- */}
      <div className={sectionCard}>
        <div className="flex items-center justify-between">
          <div className={sectionTitle}>Suspension</div>
        </div>

        <Separator className="my-3" />

        <div className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-baseline justify-between gap-2">
              <Label className="text-xs text-muted-foreground">
                Spring Rate
              </Label>

              <span className="text-[11px] text-muted-foreground">
                {suspensionLabel}
              </span>
            </div>

            {/* Discrete 4-step slider: value is 0..3 */}
            <Slider
              value={[presetIndex]}
              min={0}
              max={SPRING_PRESETS.length - 1}
              step={1}
              onValueChange={([i]) =>
                setSpringRateLbIn(SPRING_PRESETS[i].value)
              }
              disabled={disabled}
            />

            {/* Optional: show the 4 labels under the slider */}
            <div className="grid grid-cols-4 text-[10px] text-muted-foreground mt-2">
              {SPRING_PRESETS.map((p, i) => (
                <div
                  key={p.label}
                  className={[
                    "text-center",
                    i === presetIndex ? "text-foreground font-medium" : "",
                  ].join(" ")}
                >
                  {p.label}
                </div>
              ))}
            </div>

            {!user && !loading && (
              <p className="text-xs text-muted-foreground">
                Please{" "}
                <RouterLink
                  to="/login"
                  className="underline underline-offset-4 hover:text-foreground"
                >
                  log in
                </RouterLink>{" "}
                to change suspension settings.
              </p>
            )}

            <p className="text-xs text-muted-foreground">
              Higher rates feel stiffer and settle faster; lower rates bounce
              more.
              <br />
              <strong>NOTE</strong> this is very WIP and very simplified
            </p>
          </div>
        </div>
      </div>

      {/* ---------------- Car Customization Card ---------------- */}
      <div className={sectionCard}>
        <div className="flex items-center justify-between">
          <div className={sectionTitle}>Car Customization</div>
        </div>

        <Separator className="my-3" />

        <div className="space-y-4">
          {/* Color */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Color</Label>
            <Select disabled={customizationDisabled} value="">
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Coming soon" />
              </SelectTrigger>
              <SelectContent className="bg-white text-black border shadow-md">
                <SelectItem value="red">Classic Red</SelectItem>
                <SelectItem value="white">White</SelectItem>
                <SelectItem value="black">Black</SelectItem>
                <SelectItem value="silver">Silver</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Kits */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Kits</Label>
            <Select disabled={customizationDisabled} value="">
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Coming soon" />
              </SelectTrigger>
              <SelectContent className="bg-white text-black border shadow-md">
                <SelectItem value="stock">Stock</SelectItem>
                <SelectItem value="lip">Front Lip</SelectItem>
                <SelectItem value="aero">Aero Kit</SelectItem>
                <SelectItem value="widebody">Widebody</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Wheel Design */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">
              Wheel Design
            </Label>
            <Select disabled={customizationDisabled} value="">
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Coming soon" />
              </SelectTrigger>
              <SelectContent className="bg-white text-black border shadow-md">
                <SelectItem value="te37">TE37 Style</SelectItem>
                <SelectItem value="mesh">Mesh</SelectItem>
                <SelectItem value="5spoke">5-Spoke</SelectItem>
                <SelectItem value="turbofan">Turbofan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <p className="text-xs text-muted-foreground">
            Customization options are coming soon (color, kits, wheel styling).
          </p>
        </div>
      </div>
    </div>
  );
};

export default CarSelectionSettings;
