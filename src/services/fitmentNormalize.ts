import type { Settings } from "@/types/settings";
import { DEFAULT_SETTINGS } from "@/types/settings";
import type { FitmentConfig } from "@/stores/fitmentStore";
import type { SavedConfigPayload } from "@/types/garage";

const SETTINGS_KEYS = Object.keys(DEFAULT_SETTINGS) as (keyof Settings)[];

function isObject(v: unknown): v is Record<string, any> {
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

  const out: Partial<Settings> = {};
  for (const key of SETTINGS_KEYS) {
    const n = toNumber((input as any)[key]);
    if (n !== undefined) (out as any)[key] = n;
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

  if (isObject(payload) && ("settings" in payload || "model" in payload)) {
    const model =
      typeof (payload as any).model === "string" ? (payload as any).model : "na";

    const picked = pickSettings((payload as any).settings);
    return {
      model,
      settings: { ...DEFAULT_SETTINGS, ...picked },
    };
  }

  if (isObject(payload)) {
    const picked = pickSettings(payload);
    const hasAny = Object.keys(picked).length > 0;
    if (hasAny) {
      return {
        model: "na",
        settings: { ...DEFAULT_SETTINGS, ...picked },
      };
    }
  }

  return fallback;
}
