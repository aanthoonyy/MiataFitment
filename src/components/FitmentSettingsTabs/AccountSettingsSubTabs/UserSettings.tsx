import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/provider/AuthProvider";
import { useUserSettings } from "@/hooks/useUserSettings";

export default function UserSettings() {
  const { user } = useAuth();
  const s = useUserSettings({ userId: user?.id });

  return (
    <div className="bg-white">
      <div className="text-sm font-medium">Account Settings</div>

      <Separator className="my-4" />

      <div className="space-y-4">
        {/* <div className="flex items-center justify-between"> */}
          {/* <div> */}
            {/* <div className="text-sm font-medium">Dark mode</div> */}
            {/* <div className="text-xs text-muted-foreground">
              Switch between light and dark theme
            </div> */}
          {/* </div> */}

          {/* <Checkbox
            checked={s.darkMode}
            disabled={!user || s.loading || s.saving}
            onCheckedChange={(v) => s.setDarkMode(Boolean(v))}
          /> */}
        {/* </div> */}

        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium">Metric units</div>
            <div className="text-xs text-muted-foreground">
              Switch between imperial and metric
            </div>
          </div>

          <Checkbox
            checked={s.metric}
            disabled={!user || s.loading || s.saving}
            onCheckedChange={(v) => s.setMetric(Boolean(v))}
          />
        </div>
      </div>
    </div>
  );
}
