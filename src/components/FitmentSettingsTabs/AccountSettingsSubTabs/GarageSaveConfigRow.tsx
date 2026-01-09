import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
  const handlePrimaryClick = () => {
    if (nameTaken) {
      setSaveOpen(true); // go into overwrite flow
    } else {
      onSave();
    }
  };

  const primaryDisabled =
    !canSave || isAtLimit || (!saveName.trim());

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="min-w-0">
        <Label htmlFor="save-name" className="text-xs">
          Name this config
        </Label>

        <Input
          id="save-name"
          value={saveName}
          onChange={(e) => setSaveName(e.target.value)}
          placeholder='e.g. "Track 15x8 +25 205/50"'
          className="mt-1 w-full"
        />

        <div className="mt-1 text-xs text-muted-foreground">
          {helperText}
        </div>
      </div>

      <Button
        className="w-full"
        variant={nameTaken ? "secondary" : "default"}
        onClick={handlePrimaryClick}
        disabled={primaryDisabled}
      >
        {nameTaken ? "Overwrite…" : "Save"}
      </Button>

      <Dialog open={saveOpen} onOpenChange={setSaveOpen}>
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
            <Button
              variant="secondary"
              onClick={() => setSaveOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={onOverwrite}>Overwrite</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
