import { Field } from "@/components/ui/field";
import { NumberField } from "@/components/ui/number-field";
import { useSetting } from "@/hooks/useSetting";
import type { Axle } from "@/constants/wheelPositions";
import type { Settings } from "@/types/settings";

// One measurement that exists on both axles, and which setting holds it for
// each. The spec is what makes a tab a list of measurements rather than eight
// hand-wired inputs.
export interface AxleFieldSpec {
  id: string;
  label: string;
  unit: string;
  keys: Record<Axle, keyof Settings>;
}

interface AxleNumberFieldsProps {
  axle: Axle;
  fields: readonly AxleFieldSpec[];
  disabled?: boolean;
}

const AxleNumberField = ({
  axle,
  field,
  disabled,
}: {
  axle: Axle;
  field: AxleFieldSpec;
  disabled?: boolean;
}) => {
  const inputId = `${axle}-${field.id}`;
  const [value, setValue] = useSetting(field.keys[axle]);

  return (
    <Field id={inputId} label={field.label} unit={field.unit}>
      <NumberField
        id={inputId}
        value={value}
        onChange={setValue}
        disabled={disabled}
      />
    </Field>
  );
};

const AxleNumberFields = ({
  axle,
  fields,
  disabled,
}: AxleNumberFieldsProps) => (
  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
    {fields.map((field) => (
      <AxleNumberField
        key={field.id}
        axle={axle}
        field={field}
        disabled={disabled}
      />
    ))}
  </div>
);

export default AxleNumberFields;
