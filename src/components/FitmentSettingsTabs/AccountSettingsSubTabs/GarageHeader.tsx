import { STRINGS, t } from "@/i18n/strings";

type GarageHeaderProps = {
  maxSaves: number;
  count: number;
};

export function GarageHeader({ maxSaves, count }: GarageHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <div className="text-sm font-medium">{STRINGS.garage.title}</div>
        <p className="mt-1 text-sm text-muted-foreground">
          {t(STRINGS.garage.blurb, { maxSaves })}
        </p>
      </div>

      <div className="shrink-0 text-xs text-muted-foreground">
        {t(STRINGS.garage.usage, { count, maxSaves })}
      </div>
    </div>
  );
}
