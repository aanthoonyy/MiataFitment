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
import { STRINGS } from "@/i18n/strings";

const SPRING_PRESETS = [
  { label: STRINGS.car.springPresets.floaty, value: 100 },
  { label: STRINGS.car.springPresets.stockish, value: 2500 },
  { label: STRINGS.car.springPresets.coilover, value: 7000 },
  { label: STRINGS.car.springPresets.stancy, value: 20000 },
] as const;

// Which generations can be picked, and which are modelled well enough to offer.
const GENERATIONS: readonly { value: CarModel; selectable: boolean }[] = [
  { value: "na", selectable: true },
  { value: "nb", selectable: true },
  { value: "nc", selectable: false },
  { value: "nd", selectable: true },
];

const CAR_COLORS = [
  { value: "red", label: STRINGS.car.colors.red },
  { value: "white", label: STRINGS.car.colors.white },
  { value: "black", label: STRINGS.car.colors.black },
  { value: "silver", label: STRINGS.car.colors.silver },
] as const;

const CAR_KITS = [
  { value: "stock", label: STRINGS.car.kitOptions.stock },
  { value: "lip", label: STRINGS.car.kitOptions.lip },
  { value: "aero", label: STRINGS.car.kitOptions.aero },
  { value: "widebody", label: STRINGS.car.kitOptions.widebody },
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
    {STRINGS.car.loginPrompt.split("{link}")[0]}
    <RouterLink
      to="/login"
      className="underline underline-offset-4 hover:text-foreground"
    >
      {STRINGS.car.loginPromptLink}
    </RouterLink>
    {STRINGS.car.loginPrompt.split("{link}")[1].replace("{action}", action)}
  </p>
);

// A picker with nothing wired up behind it yet, kept so the layout is real.
const ComingSoonSelect = ({
  label,
  options,
}: {
  label: string;
  options: readonly { value: string; label: string }[];
}) => (
  <div className="space-y-1.5">
    <Label className="text-xs text-muted-foreground">{label}</Label>
    <Select disabled={CUSTOMISATION_DISABLED} value="">
      <SelectTrigger className="h-9">
        <SelectValue placeholder={STRINGS.car.comingSoon} />
      </SelectTrigger>
      <SelectContent className="bg-white text-black border shadow-md">
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
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
      <SettingsCard title={STRINGS.car.selectionTitle}>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-baseline justify-between gap-2">
              <Label className="text-xs text-muted-foreground">
                {STRINGS.car.generation}
              </Label>
              <span className="text-[11px] text-muted-foreground">
                {loading ? STRINGS.car.locked : STRINGS.car.editable}
              </span>
            </div>

            <Select
              value={model}
              onValueChange={(value) => setModel(value as CarModel)}
              disabled={loading}
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder={STRINGS.car.generationPlaceholder} />
              </SelectTrigger>

              <SelectContent className="bg-white text-black border shadow-md">
                {GENERATIONS.map((generation) => (
                  <SelectItem
                    key={generation.value}
                    value={generation.value}
                    disabled={!generation.selectable}
                  >
                    {STRINGS.car.generations[generation.value]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {showLoginPrompt ? (
              <LoginPrompt action={STRINGS.car.loginToChangeSelection} />
            ) : null}
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">
            {STRINGS.car.generationBlurb}
          </p>
        </div>
      </SettingsCard>

      <SettingsCard title={STRINGS.car.suspensionTitle}>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-baseline justify-between gap-2">
              <Label className="text-xs text-muted-foreground">
                {STRINGS.car.springRate}
              </Label>

              <span className="text-[11px] text-muted-foreground">
                {loading
                  ? STRINGS.car.locked
                  : SPRING_PRESETS[presetIndex].label}
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
              <LoginPrompt action={STRINGS.car.loginToChangeSuspension} />
            ) : null}

            <p className="text-xs text-muted-foreground">
              {STRINGS.car.springRateBlurb}
              <br />
              <strong>{STRINGS.car.springRateWip}</strong>
              {STRINGS.car.springRateWipRest}
            </p>
          </div>
        </div>
      </SettingsCard>

      <SettingsCard title={STRINGS.car.customizationTitle}>
        <div className="space-y-4">
          <ComingSoonSelect label={STRINGS.car.color} options={CAR_COLORS} />
          <ComingSoonSelect label={STRINGS.car.kits} options={CAR_KITS} />

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">
              {STRINGS.car.wheelDesign}
            </Label>
            <Select
              value={wheelDesign}
              onValueChange={(value) => setWheelDesign(value as WheelDesign)}
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder={STRINGS.car.wheelDesignPlaceholder} />
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
            {STRINGS.car.customizationBlurb}
          </p>
        </div>
      </SettingsCard>
    </div>
  );
};

export default CarSelectionSettings;
