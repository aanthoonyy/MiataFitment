import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface MatchFrontToggleProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const MatchFrontToggle = ({ id, checked, onChange }: MatchFrontToggleProps) => (
  <div className="flex items-center gap-2">
    <Checkbox
      id={id}
      checked={checked}
      onCheckedChange={(value) => onChange(value === true)}
    />
    <Label htmlFor={id} className="text-xs text-muted-foreground">
      Match front
    </Label>
  </div>
);

export default MatchFrontToggle;
