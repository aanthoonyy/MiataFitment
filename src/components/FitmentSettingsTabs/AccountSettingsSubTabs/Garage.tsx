import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type SavedConfig = {
  id: string;
  name: string;
  // UI-only for now. Later this becomes your real Settings / car config object.
  payloadPreview?: string;
  updatedAt: string; // ISO string
};

type GarageProps = {
  maxSaves?: number;

  // UI-first: these are optional so you can wire them later.
  onSave?: (name: string) => Promise<void> | void;
  onLoad?: (id: string) => Promise<void> | void;
  onDelete?: (id: string) => Promise<void> | void;
  onRename?: (id: string, newName: string) => Promise<void> | void;
  onOverwrite?: (id: string, name: string) => Promise<void> | void;

  // If you want to control the list externally later (Supabase).
  initialConfigs?: SavedConfig[];
};

function formatRelativeish(iso: string) {
  // Keep it simple for now (no deps). You can replace with date-fns later.
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export const Garage: React.FC<GarageProps> = ({
  maxSaves = 5,
  initialConfigs = [],
  onSave,
  onLoad,
  onDelete,
  onRename,
  onOverwrite,
}) => {
  const [configs, setConfigs] = React.useState<SavedConfig[]>(initialConfigs);

  const [saveName, setSaveName] = React.useState("");
  const [saveOpen, setSaveOpen] = React.useState(false);

  const [renameId, setRenameId] = React.useState<string | null>(null);
  const [renameValue, setRenameValue] = React.useState("");

  const isAtLimit = configs.length >= maxSaves;

  const canSaveName = saveName.trim().length >= 2;
  const nameTaken = configs.some(
    (c) => c.name.toLowerCase() === saveName.trim().toLowerCase()
  );

  const handleSave = async () => {
    const name = saveName.trim();
    if (!name || name.length < 2) return;

    // UI behavior: if name exists, we nudge toward overwrite
    if (nameTaken) return;

    if (configs.length >= maxSaves) return;

    // Call external hook if provided
    await onSave?.(name);

    // UI-only local add
    const now = new Date().toISOString();
    setConfigs((prev) => [
      {
        id: crypto.randomUUID(),
        name,
        payloadPreview: "NA • 15x8 • -3° camber (example)",
        updatedAt: now,
      },
      ...prev,
    ]);

    setSaveName("");
    setSaveOpen(false);
  };

  const handleLoad = async (id: string) => {
    await onLoad?.(id);
    // UI-only: no-op
  };

  const handleDelete = async (id: string) => {
    await onDelete?.(id);
    setConfigs((prev) => prev.filter((c) => c.id !== id));
  };

  const startRename = (c: SavedConfig) => {
    setRenameId(c.id);
    setRenameValue(c.name);
  };

  const commitRename = async () => {
    if (!renameId) return;
    const next = renameValue.trim();
    if (next.length < 2) return;

    const collision = configs.some(
      (c) => c.id !== renameId && c.name.toLowerCase() === next.toLowerCase()
    );
    if (collision) return;

    await onRename?.(renameId, next);

    setConfigs((prev) =>
      prev.map((c) =>
        c.id === renameId
          ? { ...c, name: next, updatedAt: new Date().toISOString() }
          : c
      )
    );
    setRenameId(null);
    setRenameValue("");
  };

  const handleOverwriteByName = async () => {
    const name = saveName.trim();
    if (!name || name.length < 2) return;

    const existing = configs.find(
      (c) => c.name.toLowerCase() === name.toLowerCase()
    );
    if (!existing) return;

    await onOverwrite?.(existing.id, name);

    setConfigs((prev) =>
      prev.map((c) =>
        c.id === existing.id
          ? {
              ...c,
              updatedAt: new Date().toISOString(),
              payloadPreview: "Updated current config (example)",
            }
          : c
      )
    );

    setSaveName("");
    setSaveOpen(false);
  };

return (
  <div className="w-full rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <div className="text-sm font-medium">Garage</div>
        <p className="mt-1 text-sm text-muted-foreground">
          Save up to {maxSaves} configurations. Load them anytime.
        </p>
      </div>

      <div className="shrink-0 text-xs text-muted-foreground">
        {configs.length}/{maxSaves} used
      </div>
    </div>

    <Separator className="my-3" />

    {/* Save current config */}
    <div className="grid w-full gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
      <div className="min-w-0">
        <Label htmlFor="save-name" className="text-xs">
          Name this config
        </Label>

        <Input
          id="save-name"
          value={saveName}
          onChange={(e) => setSaveName(e.target.value)}
          placeholder='e.g. "Track -15x8 -3.0°"'
          className="mt-1 w-full"
        />

        <div className="mt-1 text-xs text-muted-foreground">
          {nameTaken
            ? "A config with this name already exists — overwrite it?"
            : isAtLimit
            ? `You’ve hit the ${maxSaves}-save limit. Delete one to save a new config.`
            : "Tip: include wheel/tire/alignment in the name."}
        </div>
      </div>

      <div className="flex w-full gap-2 sm:w-auto">
        <Button
          className="w-1/2 sm:w-auto"
          onClick={handleSave}
          disabled={!canSaveName || nameTaken || isAtLimit}
        >
          Save
        </Button>

        <Dialog open={saveOpen} onOpenChange={setSaveOpen}>
          <DialogTrigger asChild>
            <Button
              className="w-1/2 sm:w-auto"
              variant="secondary"
              disabled={!nameTaken}
            >
              Overwrite…
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Overwrite existing config?</DialogTitle>
              <DialogDescription>
                This will replace the saved config named{" "}
                <span className="font-medium">{saveName.trim()}</span> with your
                current settings.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <Button variant="secondary" onClick={() => setSaveOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleOverwriteByName}>Overwrite</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>

    <Separator className="my-4" />

    {/* List */}
    {configs.length === 0 ? (
      <div className="w-full rounded-xl border border-dashed border-zinc-200 p-4 text-sm text-muted-foreground dark:border-zinc-800">
        No saved configs yet. Save one above and it’ll show up here.
      </div>
    ) : (
      <div className="space-y-2">
        {configs.map((c) => (
          <div
            key={c.id}
            className="flex flex-col gap-2 rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950 sm:flex-row sm:items-center sm:justify-between"
          >
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
              <Button variant="secondary" onClick={() => handleLoad(c.id)}>
                Load
              </Button>

              {renameId === c.id ? (
                <>
                  <Input
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    className="h-9 w-full sm:w-[180px]"
                  />
                  <Button
                    onClick={commitRename}
                    disabled={renameValue.trim().length < 2}
                  >
                    Save name
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setRenameId(null);
                      setRenameValue("");
                    }}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button variant="ghost" onClick={() => startRename(c)}>
                  Rename
                </Button>
              )}

              <Button variant="destructive" onClick={() => handleDelete(c.id)}>
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

};
