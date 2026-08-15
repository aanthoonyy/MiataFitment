import * as React from "react"

import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

interface SettingsCardProps {
  title: string
  /** Rendered opposite the title, for a toggle that governs the whole card. */
  action?: React.ReactNode
  /** Greys the card out when its values are being driven from somewhere else. */
  dimmed?: boolean
  className?: string
  children: React.ReactNode
}

const SettingsCard = ({
  title,
  action,
  dimmed,
  className,
  children,
}: SettingsCardProps) => (
  <div
    className={cn(
      "rounded-xl bg-zinc-50 p-4 shadow-sm shadow-black/10",
      dimmed && "opacity-60",
      className,
    )}
  >
    <div className="flex items-center justify-between">
      <div className="text-sm font-medium">{title}</div>
      {action}
    </div>

    <Separator className="my-3" />

    {children}
  </div>
)

export { SettingsCard }
