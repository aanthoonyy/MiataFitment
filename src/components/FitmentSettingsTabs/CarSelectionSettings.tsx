import { Link as RouterLink } from "react-router-dom";

import { Label } from "@/components/ui/label";
import { SettingsCard } from "@/components/ui/settings-card";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { useSetting } from "@/hooks/useSetting";
import { useFitmentStore, type CarModel } from "@/stores";
import { WHEEL_DESIGNS, type WheelDesign } from "@/constants/wheelDesigns";

const SPRING_PRESETS = [
  { label: "Floaty", value: 100 },
  { label: "Stock-ish", value: 2500 },
  { label: "Coilover", value: 7000 },
  { label: "Stancy", value: 20000 },
] as const;

// Shown when a persisted rate is missing or corrupt, so the slider still has a
// preset to sit on.
const FALLBACK_SPRING_RATE_LB_IN = 2500;

// Colour and kit pickers are built but have nothing behind them yet.
const CUSTOMISATION_DISABLED = true;

function closestPresetIndex(springRateLbIn: number) {
  let bestIndex = 0;
  let bestDistance = Infinity;
  for (let index = 0; index < SPRING_PRESETS.length; index++) {
    const distance = Math.abs(springRateLbIn - SPRING_PRESETS[index].value);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestIndex = index;
    }
  }
  return bestIndex;
}

const LoginPrompt = ({ action }: { action: string }) => (
  <p className="text-xs text-muted-foreground">
    Please{" "}
    <RouterLink
      to="/login"
      className="underline underline-offset-4 hover:text-foreground"
    >
      log in
    </RouterLink>{" "}
    to {action}.
  </p>
);

const CarSelectionSettings = () => {
  const model = useFitmentStore((state) => state.model);
  const setModel = useFitmentStore((state) => state.setModel);
  const wheelDesign = useFitmentStore((state) => state.wheelDesign);
  const setWheelDesign = useFitmentStore((state) => state.setWheelDesign);
  const [springRateLbIn, setSpringRateLbIn] = useSetting("springRateLbIn");

  const { user, loading } = useAuth();

  const safeSpringRateLbIn = Number.isFinite(springRateLbIn)
    ? springRateLbIn
    : FALLBACK_SPRING_RATE_LB_IN;
  const presetIndex = closestPresetIndex(safeSpringRateLbIn);
  const showLoginPrompt = !user && !loading;

  return (
    <div className="space-y-4">
      <SettingsCard title="Car Selection">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-baseline justify-between gap-2">
              <Label className="text-xs text-muted-foreground">
                Miata Generation
              </Label>
              <span className="text-[11px] text-muted-foreground">
                {loading ? "Locked" : "Editable"}
              </span>
            </div>

            <Select
              value={model}
              onValueChange={(value) => setModel(value as CarModel)}
              disabled={loading}
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

            {showLoginPrompt ? (
              <LoginPrompt action="change car selection" />
            ) : null}
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">
            Select your Miata generation to view and customize its fitment
            settings. Each generation has unique wheel wells and suspension
            geometry.
          </p>
        </div>
      </SettingsCard>

      <SettingsCard title="Suspension">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-baseline justify-between gap-2">
              <Label className="text-xs text-muted-foreground">
                Spring Rate
              </Label>

              <span className="text-[11px] text-muted-foreground">
                {loading ? "Locked" : SPRING_PRESETS[presetIndex].label}
              </span>
            </div>

            {/* Discrete 4-step slider: value is 0..3 */}
            <Slider
              value={[presetIndex]}
              min={0}
              max={SPRING_PRESETS.length - 1}
              step={1}
              onValueChange={([index]) =>
                setSpringRateLbIn(SPRING_PRESETS[index].value)
              }
              disabled={loading}
            />

            <div className="grid grid-cols-4 text-[10px] text-muted-foreground mt-2">
              {SPRING_PRESETS.map((preset, index) => (
                <div
                  key={preset.label}
                  className={[
                    "text-center",
                    index === presetIndex ? "text-foreground font-medium" : "",
                  ].join(" ")}
                >
                  {preset.label}
                </div>
              ))}
            </div>

            {showLoginPrompt ? (
              <LoginPrompt action="change suspension settings" />
            ) : null}

            <p className="text-xs text-muted-foreground">
              Higher rates feel stiffer and settle faster; lower rates bounce
              more.
              <br />
              <strong>NOTE</strong> this is very WIP and very simplified
            </p>
          </div>
        </div>
      </SettingsCard>

      <SettingsCard title="Car Customization">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Color</Label>
            <Select disabled={CUSTOMISATION_DISABLED} value="">
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

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Kits</Label>
            <Select disabled={CUSTOMISATION_DISABLED} value="">
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

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">
              Wheel Design
            </Label>
            <Select
              value={wheelDesign}
              onValueChange={(value) => setWheelDesign(value as WheelDesign)}
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Select a wheel design" />
              </SelectTrigger>
              {/* Far more designs than fit on screen, so cap the list and let
                  it scroll rather than running the full window height. */}
              <SelectContent className="max-h-72 bg-white text-black border shadow-md">
                {WHEEL_DESIGNS.map((design) => (
                  <SelectItem key={design.value} value={design.value}>
                    {design.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <p className="text-xs text-muted-foreground">
            Wheel design only changes how the wheel is drawn — sizing and
            fitment are unaffected. Color and kits are coming soon.
          </p>
        </div>
      </SettingsCard>
    </div>
  );
};

export default CarSelectionSettings;
