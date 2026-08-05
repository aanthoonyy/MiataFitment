import type { FitmentConfig } from "@/types/stores";
import type { CarModel } from "@/constants/wheelPositions";
import { DEFAULT_SETTINGS } from "@/types/settings";

const VALID_MODELS: CarModel[] = ["na", "nb", "nc", "nd"];

export function buildShareUrl(config: FitmentConfig): string {
  const params = new URLSearchParams();
  params.set("model", config.model);
  for (const [key, value] of Object.entries(config.settings)) {
    params.set(key, String(value));
  }
  return `${window.location.origin}/visualizer?${params.toString()}`;
}

export function parseShareParams(
  searchParams: URLSearchParams
): FitmentConfig | null {
  const rawModel = searchParams.get("model");
  if (!rawModel || !VALID_MODELS.includes(rawModel as CarModel)) return null;

  const model = rawModel as CarModel;
  const settings = { ...DEFAULT_SETTINGS };

  for (const key of Object.keys(DEFAULT_SETTINGS) as (keyof typeof DEFAULT_SETTINGS)[]) {
    const raw = searchParams.get(key);
    if (raw === null) continue;
    const parsed = parseFloat(raw);
    if (Number.isFinite(parsed)) {
      (settings as Record<string, number>)[key] = parsed;
    }
  }

  return { model, settings };
}
