import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function RenameInline(props: {
  value: string;
  setValue: (v: string) => void;
  onCommit: () => void;
  onCancel: () => void;
}) {
  const { value, setValue, onCommit, onCancel } = props;

  return (
    <>
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="h-9 w-full sm:w-[180px]"
      />
      <Button onClick={onCommit} disabled={value.trim().length < 2}>
        Save name
      </Button>
      <Button variant="ghost" onClick={onCancel}>
        Cancel
      </Button>
    </>
  );
}