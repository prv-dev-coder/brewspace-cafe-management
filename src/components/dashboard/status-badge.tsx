import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  status?: string
  className?: string
}

export function StatusBadge({
  status = "unknown",
  className,
}: StatusBadgeProps) {
  const normalizedStatus = status.toLowerCase()

  const getStatusStyles = (s: string) => {
    switch (s) {
      case "completed":
      case "confirmed":
      case "paid":
      case "in_stock":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"

      case "pending":
      case "unpaid":
      case "low_stock":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20"

      case "cancelled":
      case "out_of_stock":
      case "refunded":
        return "bg-rose-500/10 text-rose-500 border-rose-500/20"

      default:
        return "bg-slate-500/10 text-slate-500 border-slate-500/20"
    }
  }

  return (
    <Badge
      variant="outline"
      className={cn(
        "capitalize font-medium px-2.5 py-0.5",
        getStatusStyles(normalizedStatus),
        className
      )}
    >
      {normalizedStatus.replace("_", " ")}
    </Badge>
  )
}