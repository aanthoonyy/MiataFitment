import * as React from "react"

import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface FieldProps {
  id: string
  label: string
  /** Unit of the value, shown greyed beside the label. */
  unit?: string
  /** Current value, formatted for reading. Sliders show it, inputs do not. */
  valueText?: string
  className?: string
  children: React.ReactNode
}

const Field = ({
  id,
  label,
  unit,
  valueText,
  className,
  children,
}: FieldProps) => (
  <div className={cn("space-y-1.5", className)}>
    <div className="flex items-baseline justify-between gap-2">
      <Label htmlFor={id} className="text-xs text-muted-foreground">
        {label}
      </Label>

      <div className="flex items-baseline gap-2">
        {unit ? (
          <span className="text-[11px] text-muted-foreground">{unit}</span>
        ) : null}
        {valueText ? (
          <span className="text-xs text-foreground tabular-nums">
            {valueText}
          </span>
        ) : null}
      </div>
    </div>

    {children}
  </div>
)

export { Field }
