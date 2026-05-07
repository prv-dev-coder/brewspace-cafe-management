import { AnalyticsOverview } from "@/components/dashboard/analytics/analytics-overview"
import { DashboardRealtimeBridge } from "@/components/dashboard/realtime-bridge"
import { fetchDashboardAnalytics } from "@/lib/dashboard/queries"
import { getServerUser, getUserRole } from "@/lib/auth/session"

export default async function DashboardPage() {
  const user = await getServerUser()
  const role = getUserRole(user) ?? "owner"
  const analytics = await fetchDashboardAnalytics()

  return (
    <div className="mx-auto flex w-full max-w-[1300px] flex-col gap-5">
      <DashboardRealtimeBridge />
      <header className="space-y-1">
        <p className="text-sm text-muted-foreground">BrewSpace Analytics</p>
        <h1 className="text-3xl font-semibold tracking-tight">Overview Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Signed in as <span className="font-medium text-foreground">{user?.email ?? "unknown user"}</span>
          {" · "}
          <span className="uppercase tracking-wide">{role}</span>
        </p>
      </header>

      <AnalyticsOverview data={analytics} />
    </div>
  )
}
