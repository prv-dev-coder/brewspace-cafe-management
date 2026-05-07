import { Suspense } from "react"
import { fetchReservations } from "@/lib/dashboard/queries"
import { SectionHeader } from "@/components/dashboard/section-header"
import { TableSkeleton } from "@/components/dashboard/loading-skeleton"
import { isToday, isFuture } from "date-fns"
import { ReservationClient } from "./reservation-client"

export default async function ReservationsPage() {
  const [reservations] = await Promise.all([
    fetchReservations(),
  ])

  const todayRes = reservations.filter(r => isToday(new Date(r.reservation_time)))
  const futureRes = reservations.filter(r => isFuture(new Date(r.reservation_time)) && !isToday(new Date(r.reservation_time)))

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <SectionHeader 
        title="Reservation Desk" 
        description="Monitor upcoming bookings and manage guest seatings."
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
          <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">Today&apos;s Bookings</h3>
          <div className="text-4xl font-bold">{todayRes.length}</div>
          <p className="text-xs text-muted-foreground mt-2">Expected guests: {todayRes.reduce((s, r) => s + r.guest_count, 0)}</p>
        </div>
        <div className="rounded-xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
          <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">Upcoming</h3>
          <div className="text-4xl font-bold">{futureRes.length}</div>
          <p className="text-xs text-muted-foreground mt-2">Next 7 days</p>
        </div>
        <div className="rounded-xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
          <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">Capacity</h3>
          <div className="text-4xl font-bold">82%</div>
          <p className="text-xs text-muted-foreground mt-2">Peak time: 7:00 PM</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight">Booking Log</h2>
        </div>
        <Suspense fallback={<TableSkeleton />}>
          <ReservationClient reservations={reservations} />
        </Suspense>
      </div>
    </div>
  )
}
