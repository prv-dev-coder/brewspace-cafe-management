import type { ReactNode } from "react"
import { ThemeToggle } from "@/components/theme-toggle"

type AuthShellProps = {
  children: ReactNode
  title: string
  subtitle: string
}

export function AuthShell({ children, title, subtitle }: AuthShellProps) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.2),transparent_45%),radial-gradient(circle_at_80%_20%,rgba(236,72,153,0.2),transparent_35%)]" />
      <div className="absolute right-5 top-5 z-10">
        <ThemeToggle />
      </div>

      <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/25 bg-white/55 p-6 shadow-2xl backdrop-blur-xl dark:border-white/15 dark:bg-zinc-900/45 sm:p-8">
        <div className="mb-6 space-y-2 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Brewspace Premium</p>
          <h1 className="text-3xl font-semibold text-foreground">{title}</h1>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  )
}
