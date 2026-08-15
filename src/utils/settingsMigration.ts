import type { Settings } from "@/types/settings";

/**
 * Settings field names as they were before units were added to them.
 *
 * Configs already saved to a user's garage and share links already bookmarked
 * still carry these names, and neither can be rewritten after the fact, so this
 * mapping is permanent rather than a migration that can eventually be dropped.
 * Without it every stored fitment silently falls back to the defaults.
 */
const LEGACY_SETTING_KEYS: Readonly<Record<string, keyof Settings>> = {
  frontCamber: "frontCamberDeg",
  rearCamber: "rearCamberDeg",
  frontCaster: "frontCasterDeg",
  frontToe: "frontToeRad",
  rearToe: "rearToeRad",
  rideHeightFront: "rideHeightFrontFt",
  rideHeightRear: "rideHeightRearFt",
  frontTireWidth: "frontTireWidthMm",
  frontTireSidewall: "frontTireAspectRatio",
  frontWheelWidth: "frontWheelWidthIn",
  frontWheelDiameter: "frontWheelDiameterIn",
  frontWheelOffset: "frontWheelOffsetMm",
  frontWheelSpacer: "frontWheelSpacerMm",
  rearTireWidth: "rearTireWidthMm",
  rearTireSidewall: "rearTireAspectRatio",
  rearWheelWidth: "rearWheelWidthIn",
  rearWheelDiameter: "rearWheelDiameterIn",
  rearWheelOffset: "rearWheelOffsetMm",
  rearWheelSpacer: "rearWheelSpacerMm",
};

const CURRENT_TO_LEGACY_KEYS: Readonly<Record<string, string>> =
  Object.fromEntries(
    Object.entries(LEGACY_SETTING_KEYS).map(([legacy, current]) => [
      current,
      legacy,
    ]),
  );

/**
 * Copies any legacy field onto the name it goes by now.
 *
 * Current names win, so anything written since the rename passes through
 * untouched and a payload holding both is not corrupted by the older half.
 */
export function withCurrentSettingKeys(
  raw: Record<string, unknown> | undefined | null,
): Record<string, unknown> {
  if (!raw) return {};

  const migrated: Record<string, unknown> = { ...raw };
  for (const [legacy, current] of Object.entries(LEGACY_SETTING_KEYS)) {
    if (raw[current] === undefined && raw[legacy] !== undefined) {
      migrated[current] = raw[legacy];
    }
  }
  return migrated;
}

/** The name a setting used to go by, for readers that look keys up one by one. */
export const legacySettingKey = (current: keyof Settings): string | undefined =>
  CURRENT_TO_LEGACY_KEYS[current];
