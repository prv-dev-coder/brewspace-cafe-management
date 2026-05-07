import { redirect } from "next/navigation"
import { getServerUser } from "@/lib/auth/session"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { PortalNav } from "@/components/portal/portal-nav"
import { DashboardRealtimeBridge } from "@/components/dashboard/realtime-bridge"
import { fetchDashboardNotifications } from "@/lib/dashboard/queries"
import type { DashboardUser } from "@/components/dashboard/types"

export default async function CustomerPortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getServerUser()

  if (!user) {
    redirect("/login")
  }

  const notifications = await fetchDashboardNotifications()

  // Fetch the latest profile data from the database to ensure sync
  const supabase = await createServerSupabaseClient()
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, avatar_url")
    .eq("id", user.id)
    .single()

  // Map to DashboardUser type with safe fallbacks
  const dashboardUser: DashboardUser = {
    name: profile?.full_name || (user.user_metadata?.full_name as string) || user.email?.split('@')[0] || "Guest",
    email: user.email || "",
    role: (user.app_metadata?.role as any) || "customer",
    avatar_url: profile?.avatar_url || user.user_metadata?.avatar_url,
  }

  return (
    <div className="relative min-h-screen bg-background selection:bg-primary/20">
      {/* Dynamic Background Glows - Ensure they stay behind everything */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full bg-primary/20 blur-[120px] opacity-60" />
        <div className="absolute right-[-5%] top-[20%] h-[400px] w-[400px] rounded-full bg-blue-500/10 blur-[100px] opacity-40" />
        <div className="absolute left-[-5%] bottom-[-10%] h-[350px] w-[350px] rounded-full bg-purple-500/10 blur-[90px] opacity-30" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <DashboardRealtimeBridge />
        <PortalNav user={dashboardUser} notifications={notifications} />
        
        <main className="flex-1 container max-w-6xl px-4 py-8 md:px-8 md:py-12 relative">
          {children}
        </main>

        <footer className="py-8 border-t border-white/5 text-center text-xs text-muted-foreground">
          <p>© 2026 BrewSpace Premium. All rights reserved.</p>
        </footer>
      </div>
    </div>
  )
}
