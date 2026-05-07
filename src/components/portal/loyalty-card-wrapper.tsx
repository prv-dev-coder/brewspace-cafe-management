"use client"

import dynamic from "next/dynamic"

const LoyaltyCard = dynamic(
  () => import("@/components/portal/loyalty-card"),
  {
    ssr: false,
    loading: () => (
      <div className="h-56 w-full animate-pulse rounded-3xl bg-muted/30" />
    ),
  }
)

interface LoyaltyCardWrapperProps {
  points: number
  tier: string
  progress: number
  nextTierPoints: number
}

export function LoyaltyCardWrapper(
  props: LoyaltyCardWrapperProps
) {
  return <LoyaltyCard {...props} />
}