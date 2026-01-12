import * as React from "react";
import { getUserSettings, saveUserSettings } from "@/services/userSettingsAPI";

type UseUserSettingsArgs = {
  userId?: string | null;
  initial?: {
    darkMode: boolean;
    metric: boolean;
  };
  onChange?: (next: { darkMode: boolean; metric: boolean }) => void;
};

export function useUserSettings(args: UseUserSettingsArgs) {
  const { userId, initial, onChange } = args;

  const [darkMode, setDarkModeState] = React.useState<boolean>(
    initial?.darkMode ?? false
  );
  const [metric, setMetricState] = React.useState<boolean>(
    initial?.metric ?? false
  );

  const [loading, setLoading] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<unknown>(null);

  React.useEffect(() => {
    if (!userId) return;

    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);

      try {
        const row = await getUserSettings(userId);
        if (!cancelled && row) {
          setDarkModeState(row.darkMode);
          setMetricState(row.metric);
        }
      } catch (e) {
        if (!cancelled) setError(e);
        console.error("Failed to load user settings", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  const persist = React.useCallback(
    async (next: { darkMode: boolean; metric: boolean }) => {
      if (!userId) return;

      setSaving(true);
      setError(null);

      try {
        await saveUserSettings({
          userId,
          darkMode: next.darkMode,
          metric: next.metric,
        });

        onChange?.(next);
      } catch (e) {
        setError(e);
        console.error("Failed to save user settings", e);
        throw e;
      } finally {
        setSaving(false);
      }
    },
    [userId, onChange]
  );

  const setDarkMode = React.useCallback(
    async (value: boolean) => {
      const prev = { darkMode, metric };
      const next = { darkMode: value, metric };

      setDarkModeState(value);

      try {
        await persist(next);
      } catch {
        setDarkModeState(prev.darkMode);
      }
    },
    [darkMode, metric, persist]
  );

  const setMetric = React.useCallback(
    async (value: boolean) => {
      const prev = { darkMode, metric };
      const next = { darkMode, metric: value };

      setMetricState(value);

      try {
        await persist(next);
      } catch {
        setMetricState(prev.metric);
      }
    },
    [darkMode, metric, persist]
  );

  const toggleDarkMode = React.useCallback(() => {
    return setDarkMode(!darkMode);
  }, [darkMode, setDarkMode]);

  const toggleMetric = React.useCallback(() => {
    return setMetric(!metric);
  }, [metric, setMetric]);

  return {
    darkMode,
    metric,
    loading,
    saving,
    error,

    setDarkMode,
    setMetric,
    toggleDarkMode,
    toggleMetric,
  };
}
