import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type SaveConfigRowProps = {
  saveName: string;
  setSaveName: React.Dispatch<React.SetStateAction<string>>;

  helperText: string;

  canSave: boolean;
  nameTaken: boolean;
  isAtLimit: boolean;

  saveOpen: boolean;
  setSaveOpen: React.Dispatch<React.SetStateAction<boolean>>;

  onSave: () => void;
  onOverwrite: () => void;
};

export function SaveConfigRow({
  saveName,
  setSaveName,
  helperText,
  canSave,
  nameTaken,
  isAtLimit,
  saveOpen,
  setSaveOpen,
  onSave,
  onOverwrite,
}: SaveConfigRowProps) {
  return (
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

        <div className="mt-1 text-xs text-muted-foreground">{helperText}</div>
      </div>

      <div className="flex w-full gap-2 sm:w-auto">
        <Button
          className="w-1/2 sm:w-auto"
          onClick={onSave}
          disabled={!canSave || nameTaken || isAtLimit}
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
              <Button onClick={onOverwrite}>Overwrite</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
