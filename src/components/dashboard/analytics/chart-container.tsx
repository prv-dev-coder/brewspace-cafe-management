"use client"

import * as React from "react"
import { ResponsiveContainer } from "recharts"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface ChartContainerProps {
  children: React.ReactElement
  height?: number | string
  className?: string
  fallback?: React.ReactNode
}

export function ChartContainer({ 
  children, 
  height = 300, 
  className,
  fallback 
}: ChartContainerProps) {
  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <div 
      className={cn("w-full min-w-0", className)} 
      style={{ height }}
    >
      {isMounted ? (
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      ) : (
        fallback || <Skeleton className="h-full w-full rounded-xl" />
      )}
    </div>
  )
}
