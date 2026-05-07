"use client"

import * as React from "react"
import { motion, type HTMLMotionProps } from "framer-motion"
import { cn } from "@/lib/utils"

interface GlassCardProps extends HTMLMotionProps<"div"> {
  hoverEffect?: boolean
  gradient?: boolean
  children?: React.ReactNode
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, hoverEffect = false, gradient = false, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          "relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl dark:border-white/5 dark:bg-black/20",
          "shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),_0_8px_32px_rgba(0,0,0,0.1)]",
          "transition-all duration-300",
          hoverEffect && "hover:bg-white/10 dark:hover:bg-white/[0.05] hover:shadow-[0_12px_40px_rgba(0,0,0,0.2)] hover:-translate-y-0.5",
          gradient && "bg-gradient-to-br from-white/10 to-white/5 dark:from-white/5 dark:to-transparent",
          className
        )}
        {...props}
      >
        {/* Content wrapper to ensure children are above any card-level overlays */}
        <div className="relative z-10 h-full">
          {children}
        </div>
        
        {/* Subtle inner gloss overlay - pointer-events-none to prevent blocking interaction */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/[0.02] to-transparent z-0" />
      </motion.div>
    )
  }
)
GlassCard.displayName = "GlassCard"
