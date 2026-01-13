import React from "react";
import { Link as RouterLink } from "react-router-dom";

import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface CarSelectionSettingsProps {
  model: "na" | "nb" | "nc" | "nd" | string;
  setModel: (value: string) => void;
  user: unknown | null;
  loading: boolean;
}

const CarSelectionSettings: React.FC<CarSelectionSettingsProps> = ({
  model,
  setModel,
  user,
  loading,
}) => {
  const sectionTitle = "text-sm font-medium";
  const sectionCard =
    "rounded-xl bg-zinc-50 p-4 shadow-sm shadow-black/10";

  const disabled = !user || loading;

  return (
    <div className={sectionCard}>
      <div className="flex items-center justify-between">
        <div className={sectionTitle}>Car Selection</div>
      </div>

      <Separator className="my-3" />

      <div className="space-y-4">
        <div className="space-y-1.5">
          <div className="flex items-baseline justify-between gap-2">
            <Label className="text-xs text-muted-foreground">
              Miata Generation
            </Label>
            <span className="text-[11px] text-muted-foreground">
              {disabled ? "Locked" : "Editable"}
            </span>
          </div>

          <Select
            value={model}
            onValueChange={(v) => setModel(v)}
            disabled={disabled}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Select a generation" />
            </SelectTrigger>
            
            <SelectContent className="bg-white text-black border shadow-md">
              <SelectItem value="na">NA Miata (1989–1997)</SelectItem>
              <SelectItem value="nb">
                NB Miata (1998–2005)
              </SelectItem>
              <SelectItem value="nc" disabled>
                NC Miata (2006–2015)
              </SelectItem>
              <SelectItem value="nd" disabled>
                ND Miata (2016–Present)
              </SelectItem>
            </SelectContent>
          </Select>

          {!user && !loading ? (
            <p className="text-xs text-muted-foreground">
              Please{" "}
              <RouterLink
                to="/login"
                className="underline underline-offset-4 hover:text-foreground"
              >
                log in
              </RouterLink>{" "}
              to change car selection.
            </p>
          ) : null}
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed">
          Select your Miata generation to view and customize its fitment
          settings. Each generation has unique wheel wells and suspension
          geometry.
        </p>
      </div>
    </div>
  );
};

export default CarSelectionSettings;
