import { PortalEmptyState } from "@/components/portal/empty-states"

export default function ReservationsPage() {
  const reservations: any[] = []

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reservations</h1>
        <p className="text-muted-foreground mt-1">Manage your upcoming and past table bookings.</p>
      </div>

      {reservations.length === 0 ? (
        <PortalEmptyState 
          title="No reservations" 
          description="You haven't booked a table recently. Book one via the main website to see it here." 
          icon="calendar" 
        />
      ) : (
        <div className="grid gap-4">
          {/* Reservation list mapping would go here */}
        </div>
      )}
    </div>
  )
}
