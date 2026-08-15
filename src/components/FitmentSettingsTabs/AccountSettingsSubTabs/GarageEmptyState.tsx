import { STRINGS } from "@/i18n/strings";

export function EmptyState() {
  return (
    <div className="w-full rounded-xl border border-dashed border-zinc-200 p-4 text-sm text-muted-foreground">
      {STRINGS.garage.empty}
    </div>
  );
}
