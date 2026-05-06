import type { ReactNode } from "react"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

type AuthFieldProps = {
  id: string
  label: string
  error?: string
  children: ReactNode
}

export function AuthField({ id, label, error, children }: AuthFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      <p className={cn("min-h-5 text-xs", error ? "text-destructive" : "text-transparent")}>
        {error ?? "placeholder"}
      </p>
    </div>
  )
}
