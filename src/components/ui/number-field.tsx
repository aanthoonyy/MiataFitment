import * as React from "react"

import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

// Anything that could still become a number if you kept typing: a lone minus
// sign, a trailing decimal point, an empty box part way through a retype.
const PARTIAL_NUMBER = /^-?\d*\.?\d*$/

interface NumberFieldProps {
  id: string
  value: number
  onChange: (value: number) => void
  disabled?: boolean
  className?: string
}

/**
 * A numeric input that holds its own text while you type and commits only once
 * that text parses.
 *
 * Reading `parseFloat` straight into the store instead means clearing the box
 * to retype it commits NaN, which reaches the geometry and makes the wheel
 * vanish until a valid number is typed.
 */
const NumberField = ({
  id,
  value,
  onChange,
  disabled,
  className,
}: NumberFieldProps) => {
  const [text, setText] = React.useState(() => String(value))
  const [committed, setCommitted] = React.useState(value)

  // The value also changes from outside — the match toggle mirroring the front
  // axle, or a saved config being loaded. Adjusting during render rather than
  // from an effect avoids rendering a stale number for a frame first.
  if (value !== committed) {
    setCommitted(value)
    setText(String(value))
  }

  const handleChange = (next: string) => {
    if (!PARTIAL_NUMBER.test(next)) return
    setText(next)

    const parsed = Number.parseFloat(next)
    if (Number.isNaN(parsed)) return
    setCommitted(parsed)
    onChange(parsed)
  }

  return (
    <Input
      id={id}
      className={cn("h-9", className)}
      type="number"
      inputMode="decimal"
      value={text}
      disabled={disabled}
      onChange={(event) => handleChange(event.target.value)}
    />
  )
}

export { NumberField }
