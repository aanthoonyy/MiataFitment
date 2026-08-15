import type { Settings } from "@/types/settings";
import { DEFAULT_SETTINGS } from "@/types/settings";
import type { FitmentConfig } from "@/types/stores";
import type { SavedConfigPayload } from "@/types/garage";
import { isCarModel } from "@/constants/wheelPositions";
import { withCurrentSettingKeys } from "@/utils/settingsMigration";

const SETTINGS_KEYS = Object.keys(DEFAULT_SETTINGS) as (keyof Settings)[];

function isObject(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === "object" && !Array.isArray(v);
}

function toNumber(v: unknown): number | undefined {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const n = Number(v);
    if (Number.isFinite(n)) return n;
  }
  return undefined;
}

function pickSettings(input: unknown): Partial<Settings> {
  if (!isObject(input)) return {};

  // Anything saved before units were added to the field names still uses the
  // old ones, so translate before reading or every field misses and the config
  // silently comes back as the defaults.
  const migrated = withCurrentSettingKeys(input);

  const out: Partial<Record<keyof Settings, number>> = {};
  for (const key of SETTINGS_KEYS) {
    const n = toNumber(migrated[key]);
    if (n !== undefined) out[key] = n;
  }
  return out;
}

export function payloadToFitmentConfig(
  payload: SavedConfigPayload | undefined
): FitmentConfig {
  const fallback: FitmentConfig = {
    model: "na",
    settings: DEFAULT_SETTINGS,
  };

  if (!payload) return fallback;
  if (!isObject(payload)) return fallback;

  if ("settings" in payload || "model" in payload) {
    const model = isCarModel(payload.model) ? payload.model : "na";

    return {
      model,
      settings: { ...DEFAULT_SETTINGS, ...pickSettings(payload.settings) },
    };
  }

  const picked = pickSettings(payload);
  if (Object.keys(picked).length > 0) {
    return {
      model: "na",
      settings: { ...DEFAULT_SETTINGS, ...picked },
    };
  }

  return fallback;
}
