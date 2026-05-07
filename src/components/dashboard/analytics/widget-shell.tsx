import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

type WidgetShellProps = {
  title: string
  description?: string
  action?: ReactNode
  children: ReactNode
  className?: string
}

export function WidgetShell({ title, description, action, children, className }: WidgetShellProps) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-white/25 bg-white/70 p-4 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/45 overflow-hidden min-w-0",
        className
      )}
    >
      <header className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
          {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
        </div>
        {action}
      </header>
      {children}
    </section>
  )
}
