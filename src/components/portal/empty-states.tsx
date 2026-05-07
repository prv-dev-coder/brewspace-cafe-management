"use client"

import { CoffeeIcon, PackageOpenIcon, CalendarXIcon, HeartOffIcon } from "lucide-react"
import { GlassCard } from "./glass-card"

interface EmptyStateProps {
  title: string
  description: string
  icon: "coffee" | "package" | "calendar" | "heart"
}

export function PortalEmptyState({ title, description, icon }: EmptyStateProps) {
  const Icon = {
    coffee: CoffeeIcon,
    package: PackageOpenIcon,
    calendar: CalendarXIcon,
    heart: HeartOffIcon,
  }[icon]

  return (
    <GlassCard className="flex flex-col items-center justify-center p-12 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 mb-4">
        <Icon className="size-8 text-primary" />
      </div>
      <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>
    </GlassCard>
  )
}
