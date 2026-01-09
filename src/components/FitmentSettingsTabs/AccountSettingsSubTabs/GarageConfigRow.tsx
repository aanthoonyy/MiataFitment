import { Button } from "@/components/ui/button";
import { RenameInline } from "./GarageRenameInline";
import { formatRelativeish } from "@/utils/formatRelativeish";
import { SavedConfig } from "@/types/garage";

export function ConfigRow(props: {
  config: SavedConfig;
  isRenaming: boolean;

  renameValue: string;
  setRenameValue: (v: string) => void;

  onLoad: () => void;
  onStartRename: () => void;
  onCommitRename: () => void;
  onCancelRename: () => void;
  onDelete: () => void;
}) {
  const {
    config: c,
    isRenaming,
    renameValue,
    setRenameValue,
    onLoad,
    onStartRename,
    onCommitRename,
    onCancelRename,
    onDelete,
  } = props;

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <div className="truncate text-sm font-medium">{c.name}</div>
          <div className="text-xs text-muted-foreground">
            • {formatRelativeish(c.updatedAt)}
          </div>
        </div>

        {c.payloadPreview ? (
          <div className="mt-1 truncate text-xs text-muted-foreground">
            {c.payloadPreview}
          </div>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2 sm:justify-end">
        <Button variant="secondary" onClick={onLoad}>
          Load
        </Button>

        {isRenaming ? (
          <RenameInline
            value={renameValue}
            setValue={setRenameValue}
            onCommit={onCommitRename}
            onCancel={onCancelRename}
          />
        ) : (
          <Button variant="ghost" onClick={onStartRename}>
            Rename
          </Button>
        )}

        <Button variant="destructive" onClick={onDelete}>
          Delete
        </Button>
      </div>
    </div>
  );
}
