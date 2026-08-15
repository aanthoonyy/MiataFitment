import { useCallback } from "react";

import { useFitmentStore } from "@/stores";
import type { Settings } from "@/types/settings";

/**
 * Reads and writes one fitment setting.
 *
 * Subscribes to that single value rather than the whole settings object, so
 * dragging one slider re-renders the field bound to it and nothing else.
 */
export function useSetting<K extends keyof Settings>(
  key: K,
): [Settings[K], (value: Settings[K]) => void] {
  const value = useFitmentStore((state) => state.settings[key]);

  const setValue = useCallback(
    (next: Settings[K]) =>
      useFitmentStore
        .getState()
        .updateSettings({ [key]: next } as Pick<Settings, K>),
    [key],
  );

  return [value, setValue];
}
