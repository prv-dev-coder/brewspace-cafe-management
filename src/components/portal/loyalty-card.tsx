"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { CoffeeIcon, StarIcon } from "lucide-react"

interface LoyaltyCardProps {
  points: number
  tier: string
  progress: number
  nextTierPoints: number
}

export function LoyaltyCard({
  points,
  tier,
  progress,
  nextTierPoints,
}: LoyaltyCardProps) {
  const cardRef = React.useRef<HTMLDivElement>(null)

  const [rotate, setRotate] = React.useState({
    x: 0,
    y: 0,
  })

  const handleMouseMove = (
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()

    const width = rect.width
    const height = rect.height

    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    const rotateY = ((mouseX / width) - 0.5) * 14
    const rotateX = ((mouseY / height) - 0.5) * -14

    setRotate({
      x: rotateX,
      y: rotateY,
    })
  }

  const handleMouseLeave = () => {
    setRotate({
      x: 0,
      y: 0,
    })
  }

  return (
    <div className="w-full max-w-sm perspective-[1200px]">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{
          rotateX: rotate.x,
          rotateY: rotate.y,
        }}
        transition={{
          type: "spring",
          stiffness: 180,
          damping: 18,
        }}
        className="relative h-56 w-full cursor-pointer overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-primary via-primary/90 to-primary/60 p-7 text-white shadow-2xl"
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        {/* Background shine */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-70" />

        {/* Decorative blur */}
        <div className="pointer-events-none absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-white/10 blur-3xl" />

        <div
          className="relative z-10 flex h-full flex-col justify-between"
          style={{
            transform: "translateZ(40px)",
          }}
        >
          {/* Top section */}
          <div className="flex items-start justify-between">
            <div>
              <span className="inline-flex rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] backdrop-blur-md">
                {tier} Member
              </span>

              <h3 className="mt-4 text-4xl font-black tracking-tight">
                {points} pts
              </h3>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/20 p-3 backdrop-blur-xl">
              <StarIcon className="h-6 w-6 fill-white/20 text-white" />
            </div>
          </div>

          {/* Bottom section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-white/80">
              <span className="flex items-center gap-2">
                <CoffeeIcon className="h-4 w-4" />
                Brew Rewards
              </span>

              <span>
                {Math.max(nextTierPoints - points, 0)} to next tier
              </span>
            </div>

            <div className="h-2.5 w-full overflow-hidden rounded-full bg-black/30">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{
                  duration: 1.2,
                  ease: "easeOut",
                }}
                className="h-full rounded-full bg-gradient-to-r from-white/80 to-white shadow-[0_0_15px_rgba(255,255,255,0.5)]"
              />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default LoyaltyCard