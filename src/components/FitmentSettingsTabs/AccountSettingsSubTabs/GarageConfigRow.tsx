import { Button } from "@/components/ui/button";
import { SavedConfig } from "@/types/garage";
import { payloadToPreview } from "@/utils/garagePayload";

export function ConfigRow(props: {
  config: SavedConfig;
  onLoad: () => void;
  onDelete: () => void;
}) {
  const { config: c, onLoad, onDelete } = props;

  const derivedPreview = payloadToPreview(c.payload);

  return (
    <div className="flex flex-col rounded-xl border border-zinc-200 bg-white">
      <div className="p-3">
        <div className="flex items-center gap-2">
          <div className="truncate text-sm font-medium">{c.name}</div>
        </div>

    {derivedPreview ? (
          <div className="mt-1 line-clamp-2 text-xs text-muted-foreground">
            {derivedPreview}
          </div>
        ) : null}
      </div>

      <div className="flex w-full gap-2 border-t border-zinc-200 p-2">
        <Button variant="secondary" onClick={onLoad} className="flex-1">
          Load
        </Button>

        <Button variant="destructive" onClick={onDelete} className="flex-1">
          Delete
        </Button>
      </div>
    </div>
  );
}
