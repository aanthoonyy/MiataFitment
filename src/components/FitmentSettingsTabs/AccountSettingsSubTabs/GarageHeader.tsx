type GarageHeaderProps = {
  maxSaves: number;
  count: number;
};

export function GarageHeader({ maxSaves, count }: GarageHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <div className="text-sm font-medium">Garage</div>
        <p className="mt-1 text-sm text-muted-foreground">
          Save up to {maxSaves} configurations. Load them anytime.
        </p>
      </div>

      <div className="shrink-0 text-xs text-muted-foreground">
        {count}/{maxSaves} used
      </div>
    </div>
  );
}
