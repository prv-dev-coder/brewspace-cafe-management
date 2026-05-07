"use client"

import { memo } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { ArrowUpIcon, ArrowDownIcon, InfoIcon } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string
  delta?: string
  hint?: string
  status?: "neutral" | "success" | "warning" | "error"
  className?: string
}

export const StatsCard = memo(function StatsCard({
  title,
  value,
  delta,
  hint,
  status = "neutral",
  className,
}: StatsCardProps) {
  const isPositive = delta?.startsWith("+")
  const isNegative = delta?.startsWith("-")

  const statusColors = {
    neutral: "text-muted-foreground",
    success: "text-emerald-500",
    warning: "text-amber-500",
    error: "text-rose-500",
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Card className={cn("overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:shadow-lg hover:shadow-primary/5", className)}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          {hint && (
            <div className="group relative">
              <InfoIcon className="h-4 w-4 text-muted-foreground/50 transition-colors group-hover:text-primary" />
              <div className="absolute bottom-full right-0 mb-2 hidden w-48 rounded-md bg-popover p-2 text-xs text-popover-foreground shadow-md group-hover:block">
                {hint}
              </div>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold tracking-tight">{value}</div>
          {delta && (
            <p className={cn("mt-1 flex items-center text-xs font-medium", 
              isPositive ? "text-emerald-500" : isNegative ? "text-rose-500" : statusColors[status]
            )}>
              {isPositive && <ArrowUpIcon className="mr-1 h-3 w-3" />}
              {isNegative && <ArrowDownIcon className="mr-1 h-3 w-3" />}
              {delta}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
})
