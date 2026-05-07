"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircleIcon, RotateCcwIcon } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex h-[70vh] flex-col items-center justify-center space-y-6 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-rose-500/10">
        <AlertCircleIcon className="h-10 w-10 text-rose-500" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Something went wrong!</h2>
        <p className="text-muted-foreground max-w-[400px]">
          {error.message || "An unexpected error occurred while loading the orders dashboard."}
        </p>
      </div>
      <Button onClick={() => reset()} className="gap-2">
        <RotateCcwIcon className="h-4 w-4" />
        Try again
      </Button>
    </div>
  )
}
