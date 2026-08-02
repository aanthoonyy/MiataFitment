import * as React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { useUserSettingsStore } from "@/stores/userSettingsStore";

export default function UserSettings() {
  const { user } = useAuth();

  const metric = useUserSettingsStore((s) => s.metric);
  const loading = useUserSettingsStore((s) => s.loading);
  const saving = useUserSettingsStore((s) => s.saving);
  const setMetric = useUserSettingsStore((s) => s.setMetric);
  const fetchSettings = useUserSettingsStore((s) => s.fetchSettings);

  // Fetch settings on mount when user is available
  React.useEffect(() => {
    if (user?.id) {
      fetchSettings(user.id);
    }
  }, [user?.id, fetchSettings]);

  const handleMetricChange = (checked: boolean) => {
    setMetric(checked, user?.id);
  };

  return (
    <div className="bg-white">
      <div className="text-sm font-medium">Account Settings</div>

      <Separator className="my-4" />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium">Metric units</div>
            <div className="text-xs text-muted-foreground">
              Switch between imperial and metric
            </div>
          </div>

          <Checkbox
            checked={metric}
            disabled={!user || loading || saving}
            onCheckedChange={(v) => handleMetricChange(Boolean(v))}
          />
        </div>
      </div>
    </div>
  );
}
